#!/usr/bin/env ts-node
import axios from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {
  AccessCodesResponse,
  ElectionModel,
  SecureString,
  SignInEventModel,
  SignInResponse,
} from '../src/TrueVote.Api';
import { signInWithNostr } from './SignInWithNostr';

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

const DBUserSignIn = async (
  signInEventModel: SignInEventModel,
): Promise<PostResult<SignInResponse>> => {
  console.info('signinEventModel', signInEventModel);

  try {
    const response = await axios.post(`${API_BASE_URL}/api/user/signin`, signInEventModel);

    if (response.status === 200) {
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
        error: `Error on signIn: ${error.response.status}`,
      };
    } else {
      return {
        success: false,
        error: 'Error signIn: Network error',
      };
    }
  }
};

const signIn = async (nsec: string): Promise<SignInResponse | undefined> => {
  const handleError: any = (e: SecureString): void => {
    console.error('Nostr sign-in error:', e);
    process.exit(1);
  };
  try {
    const signInEventModel = await signInWithNostr(nsec, handleError);
    console.info(signInEventModel);
    if (signInEventModel) {
      console.info('Successfully signed Nostr event');
      try {
        const result: FetchResult = await DBUserSignIn(signInEventModel);
        console.info(result.data);
        return result.data;
      } catch (e) {
        console.error('Exception calling DBUserSignIn', e);
        handleError(e as SecureString);
        return undefined;
      }
    } else {
      console.error('Failed to sign Nostr event');
      return undefined;
    }
  } catch (error) {
    console.error('Unexpected error during Nostr sign-in:', error);
    return undefined;
  }
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
  token: string,
): Promise<PostResult<AccessCodesResponse>> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/election/createaccesscodes`,
      {
        ElectionId: electionId,
        NumberOfAccessCodes: numberOfBallots,
        RequestDescription: 'Ballot generation',
        UserId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 201) {
      const accessCodeResponse = response.data as AccessCodesResponse;

      return {
        success: true,
        data: accessCodeResponse,
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

const generateBallots = async (
  electionId: string,
  numberOfBallots: number,
  nsec: string,
): Promise<number> => {
  try {
    // Sign in and get user ID
    const signInResponse = await signIn(nsec);
    if (!signInResponse) {
      console.error(`Failed to signIn`);
      return 0;
    }
    console.info('Successfully signed in');

    // Fetch the election
    const electionResult = await fetchElection(electionId);
    if (!electionResult.success) {
      console.error(`Failed to fetch election: ${electionResult.error}`);
      return 0;
    }
    console.info('Successfully fetched election');

    console.info(`Generating ${numberOfBallots} ballots for election ${electionId}`);

    // Generate EACs
    const eacResult = await generateEACs(
      electionId,
      numberOfBallots,
      signInResponse.User.UserId,
      signInResponse.Token,
    );
    if (!eacResult.success) {
      console.error(`Failed to generate EACs: ${eacResult.error}`);
      return 0;
    }
    console.info(
      `Successfully generated ${eacResult.data?.AccessCodes.length} EACs for election ${electionId}`,
    );

    // Generate N number of Users for this election
    await generateUsers(numberOfBallots, electionId);

    let ballotCount: number = 0;
    // Loop through N number of iterations
    for (let i = 0; i < numberOfBallots; i++) {
      // For each iteration, generate a BallotModel with randomly selected candidates selected = true
      // Submit the ballot
      await generateAndSubmitBallot(electionId);
      // Increment the ballot count
      ballotCount++;
    }
    return ballotCount;
  } catch (error) {
    console.error('Error in generateBallots:', error);
    return 0;
  }
};

const main = async (): Promise<void> => {
  try {
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
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    process.exit(0);
  }
};

main().catch((error) => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
