import {
  BallotHashModel,
  BallotList,
  BallotModel,
  ElectionModel,
  ElectionResults,
} from '@/TrueVote.Api';
import { ApolloClient, gql, useApolloClient } from '@apollo/client';

export class ApolloClientFactory {
  public apolloClient: ApolloClient<object> = useApolloClient();

  constructor() {
    console.info('~ApolloClientFactory()');
  }
}

const GET_ELECTION_BY_ID_QUERY = gql`
  query GetElectionById($ElectionId: String!) {
    GetElectionById(ElectionId: $ElectionId) {
      ElectionId
      Name
      Description
      HeaderImageUrl
      DateCreated
      StartDate
      EndDate
      Races {
        Name
        RaceId
        DateCreated
        RaceType
        RaceTypeName
        MinNumberOfChoices
        MaxNumberOfChoices
        Candidates {
          CandidateId
          DateCreated
          Name
          PartyAffiliation
          CandidateImageUrl
          Selected
          SelectedMetadata
        }
      }
    }
  }
`;

export const DBGetElectionById = async (
  apolloClient: ApolloClient<object> | undefined,
  electionId: string | undefined,
): Promise<ElectionModel[]> => {
  if (!apolloClient) {
    throw new Error('Apollo client is undefined');
  }

  if (!electionId) {
    throw new Error('ElectionId is undefined');
  }

  try {
    const { data, errors } = await apolloClient.query({
      query: GET_ELECTION_BY_ID_QUERY,
      variables: { ElectionId: electionId },
    });

    if (errors) {
      throw new Error(errors.map((e) => e.message).join(', '));
    }

    return data.GetElectionById;
  } catch (error) {
    console.error('Error fetching election:', error);
    throw error;
  }
};

const GET_ALL_ELECTIONS_QUERY = gql`
  query GetAllElections {
    GetElection {
      ElectionId
      Name
      Description
      HeaderImageUrl
      DateCreated
      StartDate
      EndDate
    }
  }
`;

export const DBAllElections = async (
  apolloClient: ApolloClient<object> | undefined,
): Promise<ElectionModel[]> => {
  if (!apolloClient) {
    throw new Error('Apollo client is undefined');
  }

  try {
    const { data, errors } = await apolloClient.query({
      query: GET_ALL_ELECTIONS_QUERY,
    });

    if (errors) {
      throw new Error(errors.map((e) => e.message).join(', '));
    }

    return data.GetElection;
  } catch (error) {
    console.error('Error fetching all elections:', error);
    throw error;
  }
};

const GET_ALL_BALLOTS_QUERY = gql`
  query GetAllBallots {
    GetBallot {
      Ballots {
        BallotId
        DateCreated
        Election {
          ElectionId
          Name
          Races {
            Name
            RaceId
            DateCreated
            RaceType
            RaceTypeName
            Candidates {
              CandidateId
              DateCreated
              Name
              PartyAffiliation
              CandidateImageUrl
              Selected
              SelectedMetadata
            }
          }
        }
      }
      BallotHashes {
        BallotId
        BallotHashId
        ServerBallotHash
        ServerBallotHashS
        DateCreated
        DateUpdated
        TimestampId
      }
    }
  }
`;

export const DBAllBallots = async (
  apolloClient: ApolloClient<object> | undefined,
): Promise<{
  Ballots: BallotModel[];
  BallotHashes: BallotHashModel[];
}> => {
  if (!apolloClient) {
    throw new Error('Apollo client is undefined');
  }

  try {
    const { data, errors } = await apolloClient.query({
      query: GET_ALL_BALLOTS_QUERY,
    });

    if (errors) {
      throw new Error(errors.map((e) => e.message).join(', '));
    }

    return data.GetBallot;
  } catch (error) {
    console.error('Error fetching all ballots:', error);
    throw error;
  }
};

const GET_BALLOT_BY_ID_QUERY = gql`
  query GetBallotById($BallotId: String!) {
    GetBallotById(BallotId: $BallotId) {
      Ballots {
        BallotId
        DateCreated
        Election {
          ElectionId
          Name
          Races {
            Name
            RaceId
            DateCreated
            RaceType
            RaceTypeName
            Candidates {
              CandidateId
              DateCreated
              Name
              PartyAffiliation
              CandidateImageUrl
              Selected
              SelectedMetadata
            }
          }
        }
      }
      BallotHashes {
        BallotId
        BallotHashId
        ServerBallotHash
        ServerBallotHashS
        DateCreated
        DateUpdated
        TimestampId
      }
    }
  }
`;

export const DBGetBallotById = async (
  apolloClient: ApolloClient<object> | undefined,
  ballotId: string | undefined,
): Promise<BallotList> => {
  if (!apolloClient) {
    throw new Error('Apollo client is undefined');
  }

  if (!ballotId) {
    throw new Error('BallotId is undefined');
  }

  try {
    const { data, errors } = await apolloClient.query({
      query: GET_BALLOT_BY_ID_QUERY,
      variables: { BallotId: ballotId },
    });

    if (errors) {
      throw new Error(errors.map((e) => e.message).join(', '));
    }

    return data.GetBallotById;
  } catch (error) {
    console.error('Error fetching ballot:', error);
    throw error;
  }
};

const GET_ELECTION_RESULTS_BY_ID_QUERY = gql`
  query ($ElectionId: String!) {
    GetElectionResultsByElectionId(ElectionId: $ElectionId) {
      ElectionId
      TotalBallots
      Races {
        RaceId
        RaceName
        CandidateResults {
          CandidateId
          CandidateName
          TotalVotes
        }
      }
    }
  }
`;

export const DBGetElectionResultsById = async (
  apolloClient: ApolloClient<object> | undefined,
  electionId: string | undefined,
): Promise<ElectionResults> => {
  if (!apolloClient) {
    throw new Error('Apollo client is undefined');
  }

  if (!electionId) {
    throw new Error('ElectionId is undefined');
  }

  try {
    const { data, errors } = await apolloClient.query({
      query: GET_ELECTION_RESULTS_BY_ID_QUERY,
      variables: { ElectionId: electionId },
    });

    if (errors) {
      throw new Error(errors.map((e) => e.message).join(', '));
    }

    return data.GetElectionResultsByElectionId;
  } catch (error) {
    console.error('Error fetching election results:', error);
    throw error;
  }
};
