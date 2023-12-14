/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/typedef */
import { EnvConfig } from '@/EnvConfig';
import {
  BallotHashModel,
  BallotModel,
  ElectionModel,
  StatusModel,
  SubmitBallotModel,
  SubmitBallotModelResponse,
} from '@/TrueVote.Api';
import { QueryResult, TypedDocumentNode, gql, useQuery } from '@apollo/client';

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
          RaceType
          RaceTypeMetadata
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

export const DBGetBallotById = (
  ballotId: string | undefined,
): QueryResult<{
  GetBallotById: {
    Ballots: BallotModel[];
    BallotHashes: BallotHashModel[];
  };
}> => {
  const query: TypedDocumentNode<{
    GetBallotById: {
      Ballots: BallotModel[];
      BallotHashes: BallotHashModel[];
    };
  }> = gql`
    query ($BallotId: String!) {
      GetBallotById(BallotId: $BallotId) {
        Ballots {
          BallotId
          DateCreated
          Election {
            ElectionId
            Name
            Description
            DateCreated
            StartDate
            EndDate
            Races {
              Name
              RaceId
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
    GetBallotById: {
      Ballots: BallotModel[];
      BallotHashes: BallotHashModel[];
    };
  }>(query, { variables: { BallotId: ballotId } });
};

export const DBSubmitBallot = async (
  submitBallotModel: SubmitBallotModel,
): Promise<SubmitBallotModelResponse> => {
  console.info('DBSubmitBallot->submitBallotModel', submitBallotModel);

  const body: string = JSON.stringify(submitBallotModel);
  console.info('Body: /ballot/submitballot', body);

  return await Promise.resolve(
    fetch(EnvConfig.apiRoot + '/api/ballot/submitballot', {
      method: 'POST',
      body: body,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res: Response) => {
        console.info('Response: /ballot/submitballot', res);
        if (res.status === 409) {
          const j = res.json();

          console.error('409 Error', j);
          return Promise.reject<SubmitBallotModelResponse>(j);
        }
        return res.json();
      })
      .then((data: SubmitBallotModelResponse) => {
        console.info('Data: /ballot/submitballot', data);
        return Promise.resolve<SubmitBallotModelResponse>(data);
      })
      .catch((e: any) => {
        return Promise.reject<any>(e);
      }),
  );
};

export const APIStatus = async (): Promise<StatusModel> => {
  console.info('Body: /status');

  return await Promise.resolve(
    fetch(EnvConfig.apiRoot + '/api/status', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res: Response) => {
        console.info('Response: /status', res);
        if (res.status !== 200) {
          console.error(res.status, ' Error ', res.statusText);
          return Promise.reject<any>(res);
        }
        return res.json();
      })
      .then((data: StatusModel) => {
        console.info('Data: /status', data);
        return Promise.resolve<StatusModel>(data);
      })
      .catch((e: any) => {
        return Promise.reject<any>(e);
      }),
  );
};
