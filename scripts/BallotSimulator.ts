#!/usr/bin/env ts-node
import axios from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateKeyPair } from '../src/services/NostrHelper';
import {
  AccessCodesResponse,
  ElectionModel,
  RaceModel,
  SecureString,
  SignInEventModel,
  SignInResponse,
  SubmitBallotModel,
  SubmitBallotModelResponse,
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
  //console.info('DBUserSignIn->signinEventModel', signInEventModel);

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
  console.info('signIn');

  const handleError: any = (e: SecureString): void => {
    console.error('Nostr sign-in error:', e);
    process.exit(1);
  };

  try {
    const signInEventModel = await signInWithNostr(nsec, handleError);
    // console.info(signInEventModel);
    if (signInEventModel) {
      console.info('Successfully signed Nostr event');
      try {
        const result: FetchResult = await DBUserSignIn(signInEventModel);
        // console.info(result.data);
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
  console.info(`Fetching election: ${electionId}`);
  try {
    const response = await axios.get(`${API_BASE_URL}/election?ElectionId=${electionId}`);
    if (response.status !== 200) {
      return {
        success: false,
        error: `Unexpected status code: ${response.status} for election: ${electionId}`,
      };
    }

    const electionDetails = response.data as ElectionModel;

    console.info(`Received election data: ${electionDetails.Name}`);
    return { success: true, data: electionDetails };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return { success: false, error: `Election: ${electionId} not found` };
      }
      return {
        success: false,
        error: `Axios error: ${error.message} (Status: ${error.response?.status || 'unknown'})`,
      };
    }
    return { success: false, error: `Error fetching election: ${electionId}: ${error}` };
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
      console.info(`Received EAC data for election: ${accessCodeResponse.ElectionId}`);

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

// For numberOfUsers, generate an new nsec using NostrHelper, signIn with that nsec,
// which will generate each user. Return an array of UserIds returned back from signIn.
const generateUsers = async (
  numberOfUsers: number,
  electionId: string,
): Promise<[userIDs: string[], userTokens: string[]]> => {
  console.info(`Generating ${numberOfUsers} Users for election: ${electionId}`);

  const userIds: string[] = [];
  const userTokens: string[] = [];

  for (let i = 0; i < numberOfUsers; i++) {
    // Generate a new nsec using NostrHelper
    const { nsec } = generateKeyPair();

    // Sign in with the generated nsec
    try {
      const signInResponse = await signIn(nsec);
      if (!signInResponse) {
        console.error(`Failed to signIn generated user`);
        return [userIds, userTokens];
      }

      console.info(`Generated user [${i}]: ${signInResponse.User.UserId}`);
      userIds.push(signInResponse.User.UserId);
      userTokens.push(signInResponse.Token);
    } catch (error) {
      console.error(`Failed to sign in generated user ${i}:`, error);
    }
  }

  return [userIds, userTokens];
};

// Given an election, loop through each race. For each race, if the MinNumberOfChoices is == 0
// Then decide to vote in that race with a 75% chance random as yes.
// If the MinNumberOfChoices is >= 1, then of course we most vote in that race.
// For each race we are voting in, set random Candidates.Selected = true but no more than MaxNumberOfChoices
const randomizeBallotChoices = (electionDetails: ElectionModel): ElectionModel => {
  const modifiedElection = { ...electionDetails };

  modifiedElection.Races.forEach((race: RaceModel) => {
    let shouldVote =
      (race.MinNumberOfChoices && race.MinNumberOfChoices >= 1) || Math.random() < 0.75;

    if (shouldVote) {
      // Calculate the number of candidates to select, ensuring it does not exceed MaxNumberOfChoices
      const candidatesToSelect = Math.min(
        race.MaxNumberOfChoices || 0,
        Math.max(
          race.MinNumberOfChoices || 0,
          Math.floor(Math.random() * (race.MaxNumberOfChoices || 0)), // Ensure this is capped correctly
        ),
      );

      const shuffledCandidates = [...race.Candidates].sort(() => Math.random() - 0.5);

      // Ensure we do not select more candidates than MaxNumberOfChoices
      const actualCandidatesToSelect = Math.min(candidatesToSelect, shuffledCandidates.length);

      // Reset the Selected property to false before selecting new candidates
      shuffledCandidates.forEach((candidate) => {
        candidate.Selected = false; // Reset selection
      });

      // Select the candidates
      shuffledCandidates.slice(0, actualCandidatesToSelect).forEach((candidate) => {
        candidate.Selected = true;
      });
    }
  });

  return modifiedElection;
};

const submitBallot = async (
  submitBallotModel: SubmitBallotModel,
  token: string,
): Promise<PostResult<SubmitBallotModelResponse>> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ballot/submitballot`, submitBallotModel, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      const submitBallotModelResponse = response.data as SubmitBallotModelResponse;
      console.info(
        `Received submitBallot data for election: ${submitBallotModel.Election.ElectionId}`,
      );

      return {
        success: true,
        data: submitBallotModelResponse,
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
        error: `Error generating ballot: ${error.response.status} details: ${JSON.stringify(error.response.data.errors)}`,
      };
    } else {
      return {
        success: false,
        error: 'Error generating ballot: Network error',
      };
    }
  }
};

const generateAndSubmitBallots = async (
  numberOfUsers: number,
  electionDetails: ElectionModel,
  eacResult: AccessCodesResponse,
  userTokens: string[],
): Promise<string[]> => {
  const ballotIds: string[] = [];

  console.info(numberOfUsers, electionDetails, eacResult, userTokens);

  for (let i = 0; i < numberOfUsers; i++) {
    // Randomize the 'select = true' for each candidate in each race

    const ballot: ElectionModel = randomizeBallotChoices(electionDetails);

    const submitBallotModel: SubmitBallotModel = {
      Election: ballot,
      AccessCode: eacResult.AccessCodes[i].AccessCode,
    };

    // Submit the ballot
    try {
      const submitBallotResponse = await submitBallot(submitBallotModel, userTokens[i]);
      if (!submitBallotResponse) {
        console.error(`Failed to submitBallot`);
        return ballotIds;
      }

      if (submitBallotResponse.error) {
        console.error(`Failed to submitBallot response error`, submitBallotResponse.error);
        return ballotIds;
      }

      const ballotDetails = submitBallotResponse.data as SubmitBallotModelResponse;

      console.info(`Generated ballot [${i}]: ${ballotDetails.BallotId}`);
      ballotIds.push(ballotDetails.BallotId);
    } catch (error) {
      console.error(`Failed to submit generated ballot: ${i}:`, error);
    }
  }

  return ballotIds;
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
    console.info(`Fetching election: ${electionId}`);
    const electionResult = await fetchElection(electionId);
    if (!electionResult.success) {
      console.error(`Failed to fetch election: ${electionResult.error}`);
      return 0;
    }
    console.info('Successfully fetched election');

    // Generate EACs
    console.info(`Generating ${numberOfBallots} EACs for election: ${electionId}`);
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
      `Successfully generated ${eacResult.data?.AccessCodes.length} EACs for election: ${electionId}`,
    );

    // Generate N number of Users for this election
    console.info(`Generating ${numberOfBallots} Users for election: ${electionId}`);
    const [userIds, userTokens] = await generateUsers(numberOfBallots, electionId);
    if (userIds.length < numberOfBallots) {
      console.error(
        `Error: Generated: ${userIds.length} Users out of expected: ${numberOfBallots}`,
      );
      return 0;
    }
    console.info(`Successfully generated: ${userIds.length} Users for election: ${electionId}`);

    // Generate N number of Ballots for this election
    console.info(`Generating ${numberOfBallots} Ballots for election: ${electionId}`);
    const ballotIds = await generateAndSubmitBallots(
      numberOfBallots,
      electionResult.data as ElectionModel,
      eacResult.data as AccessCodesResponse,
      userTokens,
    );
    if (ballotIds.length < numberOfBallots) {
      console.error(
        `Error: Generated: ${ballotIds.length} Ballots out of expected: ${numberOfBallots}`,
      );
      return 0;
    }
    console.info(`Successfully generated: ${ballotIds.length} Ballots for election: ${electionId}`);

    return ballotIds.length;
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

    console.info(`Generated ${ballotCount} ballots for election: ${argv.electionid}`);
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
