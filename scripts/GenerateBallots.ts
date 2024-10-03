#!/usr/bin/env ts-node
import axios from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ElectionModel } from '../src/TrueVote.Api';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.truevote.org';
console.info('API_BASE_URL:', API_BASE_URL);

interface FetchResult {
  success: boolean;
  data?: ElectionModel;
  error?: string;
}

const fetchElection = async (electionId: string): Promise<FetchResult> => {
  console.info(`Fetching election with ID: ${electionId}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/election/${electionId}`);
    console.info(`Received response with status: ${response.status}`);

    if (response.status !== 200) {
      return {
        success: false,
        error: `Unexpected status code: ${response.status} for election ID ${electionId}`,
      };
    }

    console.info(`Received election data for: ${response.data.ElectionName}`);
    return { success: true, data: response.data as ElectionModel };
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

const generateEACs = (numberOfEACs: number, electionId: string): void => {
  console.info(`Generating ${numberOfEACs} EACs for election ${electionId}`);
};

const generateUsers = (numberOfUsers: number, electionId: string): void => {
  console.info(`Generating ${numberOfUsers} users for election ${electionId}`);
};

const generateAndSubmitBallot = (electionId: string): void => {
  console.info(`Generating and submitting a ballot for election ${electionId}`);
};

const generateBallots = async (electionId: string, numberOfBallots: number): Promise<number> => {
  var numBallotsGenerated = 0;

  // Fetch the election
  const electionResult = await fetchElection(electionId);
  if (!electionResult.success) {
    console.error(`Failed to fetch election: ${electionResult.error}`);
    return numBallotsGenerated; // Exit the function early
  }

  console.info(`Generating ${numberOfBallots} ballots for election ${electionId}`);

  // Generate N number of EACs for this election
  generateEACs(numberOfBallots, electionId);

  // Generate N number of Users for this election
  generateUsers(numberOfBallots, electionId);

  // Loop through N number of iterations
  for (let i = 0; i < numberOfBallots; i++) {
    // For each iteration, generate a BallotModel with randomly selected candidates selected = true
    // Submit the ballot
    generateAndSubmitBallot(electionId);
    // Increment the ballot count
    numBallotsGenerated++;
  }

  return numBallotsGenerated;
};

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
    .help()
    .alias('help', 'h')
    .parse();

  const ballotCount = await generateBallots(argv.electionid, argv.numberofballots);

  console.info(`Generated ${ballotCount} ballots for election ${argv.electionid}`);
};

main().catch(console.error);
