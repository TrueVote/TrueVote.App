import { BallotHashModel, BallotList, BallotModel, ElectionModel } from '@/TrueVote.Api';
import { ApolloClient, QueryResult, TypedDocumentNode, gql, useQuery } from '@apollo/client';

export const DBGetElectionById = (
  electionId: string | undefined,
): QueryResult<{ GetElectionById: ElectionModel[] }> => {
  const query: TypedDocumentNode<{ GetElectionById: ElectionModel[] }> = gql`
    query ($ElectionId: String!) {
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

  return useQuery<{ GetElectionById: ElectionModel[] }>(query, {
    variables: { ElectionId: electionId },
  });
};

export const DBAllElections = (): QueryResult<{ GetElection: ElectionModel[] }> => {
  const query: TypedDocumentNode<{ GetElection: ElectionModel[] }> = gql`
    query {
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

  return useQuery<{ GetElection: ElectionModel[] }>(query);
};

export const DBAllBallots = (): QueryResult<{
  GetBallot: {
    Ballots: BallotModel[];
    BallotHashes: BallotHashModel[];
  };
}> => {
  const query: TypedDocumentNode<{
    GetBallot: {
      Ballots: BallotModel[];
      BallotHashes: BallotHashModel[];
    };
  }> = gql`
    query {
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

  return useQuery<{
    GetBallot: {
      Ballots: BallotModel[];
      BallotHashes: BallotHashModel[];
    };
  }>(query);
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
