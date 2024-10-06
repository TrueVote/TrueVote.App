#!/usr/bin/env ts-node
import axios from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ElectionModel } from '../src/TrueVote.Api';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.truevote.org';
console.info('API_BASE_URL:', API_BASE_URL);

interface FetchResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface PostResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const signIn = async (nsec: string): Promise<string> => {
  console.info(`Signing in with nsec: ${nsec}`);

  return await 'finished';
};

const fetchElection = async (electionId: string): Promise<FetchResult> => {
  console.info(`Fetching election with ID: ${electionId}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/election?ElectionId=${electionId}`);
    console.info(`Received response with status: ${response.status}`);

    if (response.status !== 200) {
      return {
        success: false,
        error: `Unexpected status code: ${response.status} for election ID ${electionId}`,
      };
    }

    const electionDetails = response.data as ElectionModel;

    console.info(`Received election data for: ${electionDetails.Name}`);
    return { success: true, data: electionDetails };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return { success: false, error: `Election with ID ${electionId} not found` };
      }
      return {
        success: false,
        error: `Axios error: ${error.message} (Status: ${error.response?.status || 'unknown'})`,
      };
    }
    return { success: false, error: `Error fetching election with ID ${electionId}: ${error}` };
  }
};

const generateEACs = async (
  electionId: string,
  numberOfBallots: number,
  userId: string,
): Promise<PostResult<string[]>> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/election/createaccesscodes`, {
      ElectionId: electionId,
      NumberOfAccessCodes: numberOfBallots,
      RequestDescription: 'Ballot generation',
      UserId: userId,
    });

    if (response.status === 201 && Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: 'Unexpected response format',
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        error: `Error generating EACs: ${error.response.status}`,
      };
    } else {
      return {
        success: false,
        error: 'Error generating EACs: Network error',
      };
    }
  }
};

const generateUsers = (numberOfUsers: number, electionId: string): void => {
  console.info(`Generating ${numberOfUsers} users for election ${electionId}`);
};

const generateAndSubmitBallot = (electionId: string): void => {
  console.info(`Generating and submitting a ballot for election ${electionId}`);
};

async function generateBallots(
  electionId: string,
  numberOfBallots: number,
  nsec: string,
): Promise<void> {
  try {
    // Fetch the election
    // Sign in and get user ID
    const userId = await signIn(nsec);
    console.log('Successfully signed in');

    const electionResult = await fetchElection(electionId);
    if (!electionResult.success) {
      console.error(`Failed to fetch election: ${electionResult.error}`);
      return; // Exit the function early
    }

    console.info(`Generating ${numberOfBallots} ballots for election ${electionId}`);

    // Generate EACs
    let eacs: string[];
    try {
      const result = await generateEACs(electionId, numberOfBallots, userId);
      eacs = result.data ?? [];
      console.info(`Successfully generated ${eacs.length} EACs for election ${electionId}`);
    } catch (error) {
      console.error('Failed to generate EACs:');
      process.exit(1); // Exit with error code
    }

    // Generate N number of Users for this election
    generateUsers(numberOfBallots, electionId);

    // Loop through N number of iterations
    for (let i = 0; i < numberOfBallots; i++) {
      // For each iteration, generate a BallotModel with randomly selected candidates selected = true
      // Submit the ballot
      generateAndSubmitBallot(electionId);
      // Increment the ballot count
    }
  } catch (error) {
    console.error('Error in generateBallots:', error);
    process.exit(1); // Exit with error code
  }
}

const main = async (): Promise<void> => {
  const argv = await yargs(hideBin(process.argv))
    .option('electionid', {
      alias: 'e',
      description: 'Election ID',
      type: 'string',
      demandOption: true,
    })
    .option('numberofballots', {
      alias: 'n',
      description: 'Number of ballots to generate',
      type: 'number',
      demandOption: true,
    })
    .option('nsec', {
      description: 'Nostr secret key (nsec)',
      type: 'string',
      demandOption: true,
    })
    .help()
    .alias('help', 'h')
    .parse();

  const ballotCount = await generateBallots(argv.electionid, argv.numberofballots, argv.nsec);

  console.info(`Generated ${ballotCount} ballots for election ${argv.electionid}`);
};

main().catch(console.error);
