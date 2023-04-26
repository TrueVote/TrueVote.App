import { EnvConfig } from '@/EnvConfig';
import { ElectionModel, SubmitBallotModel, SubmitBallotModelResponse } from '@/TrueVote.Api';
import { DocumentNode, gql, useQuery } from '@apollo/client';

export const DBGetElectionById: any = (electionId: string | undefined) => {
  const query: DocumentNode = gql`
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
          RaceTypeName
          Candidates {
            CandidateId
            DateCreated
            Name
            PartyAffiliation
            Selected
          }
        }
      }
    }
  `;

  return useQuery(query, { variables: { ElectionId: electionId } });
};

export const DBAllElections: any = () => {
  const query: DocumentNode = gql`
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

  return useQuery(query);
};

export const DBAllBallots: any = () => {
  const query: DocumentNode = gql`
    query {
      GetBallot {
        ElectionId
        BallotId
        DateCreated
        Election {
          Races {
            Name
            RaceId
            RaceTypeName
            Candidates {
              CandidateId
              DateCreated
              Name
              PartyAffiliation
              Selected
            }
          }
        }
      }
    }
  `;

  return useQuery(query);
};

export const DBGetBallotById: any = (ballotId: string | undefined) => {
  const query: DocumentNode = gql`
    query ($BallotId: String!) {
      GetBallotById(BallotId: $BallotId) {
        ElectionId
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
            RaceTypeName
            Candidates {
              CandidateId
              DateCreated
              Name
              PartyAffiliation
              Selected
            }
          }
        }
      }
    }
  `;

  return useQuery(query, { variables: { BallotId: ballotId } });
};

export const DBSubmitBallot: any = async (
  election: ElectionModel,
): Promise<SubmitBallotModelResponse> => {
  console.info('DBSubmitBallot->election', election);

  const submitBallotModel: SubmitBallotModel = <SubmitBallotModel>{};
  submitBallotModel.Election = election;
  submitBallotModel.ElectionId = election.ElectionId;

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
      .then((res: any) => {
        console.info('Response: /ballot/submitballot', res);
        return res.json();
      })
      .then((data: SubmitBallotModelResponse) => {
        console.info('Data: /ballot/submitballot', data);
        return Promise.resolve<SubmitBallotModelResponse>(data);
      })
      .catch((err: any) => {
        return Promise.reject<any>(err);
      }),
  );
};
