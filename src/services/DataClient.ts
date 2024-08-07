import { EnvConfig } from '@/EnvConfig';
import {
  BallotHashModel,
  BallotModel,
  ElectionModel,
  FeedbackModel,
  SecureString,
  SignInEventModel,
  SignInResponse,
  StatusModel,
  SubmitBallotModel,
  SubmitBallotModelResponse,
  UserModel,
} from '@/TrueVote.Api';
import { QueryResult, TypedDocumentNode, gql, useQuery } from '@apollo/client';
import { FetchHelper } from './FetchHelper';

const JwtStorageKey: string = 'jwt_token';

export const storeJwt = (token: string | null | undefined): void => {
  localStorage.setItem(JwtStorageKey, token ?? '');
};

export const getJwt = (): string | null => {
  return localStorage.getItem(JwtStorageKey) ?? null;
};

export const jwtSignOut = (): void => {
  localStorage.removeItem(JwtStorageKey);
};

const setHeaders: any = () => {
  const headers: HeadersInit = {
    'Content-type': 'application/json; charset=UTF-8',
  };

  return headers;
};

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
    FetchHelper.fetchWithToken(getJwt(), EnvConfig.apiRoot + '/api/ballot/submitballot', {
      method: 'POST',
      body: body,
      headers: setHeaders(),
    })
      .then((res: Response) => {
        console.info('Response: /ballot/submitballot', res);
        if (res.status !== 201) {
          return res.json().then((errorData) => {
            console.error(res.status + ' Error', errorData);
            throw errorData; // Throw the error data object
          });
        }
        return res.json();
      })
      .then((data: SubmitBallotModelResponse) => {
        console.info('Data: /ballot/submitballot', data);
        return Promise.resolve<SubmitBallotModelResponse>(data);
      })
      .catch((e: any) => {
        return Promise.reject<any>(e); // Reject with the error object
      }),
  );
};

export const APIStatus = async (): Promise<StatusModel> => {
  console.info('Request: /status');

  try {
    const response = await FetchHelper.fetchWithToken(getJwt(), EnvConfig.apiRoot + '/api/status', {
      method: 'GET',
      headers: setHeaders(),
    });

    console.info('Response: /status', response);

    if (!response.ok) {
      console.error(response.status, 'Error ', response.statusText);
      const errorMessage: SecureString = { Value: await response.statusText };
      throw errorMessage;
    }

    const data: StatusModel = await response.json();
    console.info('Data: /status', data);
    return data;
  } catch (error) {
    console.error('Error in APIStatus', error);
    throw error;
  }
};

export const APIPing = async (): Promise<SecureString> => {
  console.info('Request: /ping');

  try {
    const response = await FetchHelper.fetchWithToken(getJwt(), EnvConfig.apiRoot + '/api/ping', {
      method: 'GET',
      headers: setHeaders(),
    });

    console.info('Response: /ping', response);

    if (response.status !== 200) {
      const errorMessage: SecureString = { Value: await response.statusText };
      console.error('Error', response.status, errorMessage);
      throw errorMessage;
    }

    const data: SecureString = await response.json();
    console.info('Data: /ping', data);
    return data;
  } catch (error) {
    console.error('Error in APIPing', error);
    throw error;
  }
};

export const APIAdd = async (): Promise<SecureString> => {
  console.info('Request: /add');

  try {
    const response = await FetchHelper.fetchWithToken(getJwt(), EnvConfig.apiRoot + '/api/add', {
      method: 'GET',
      headers: setHeaders(),
    });

    console.info('Response: /add', response);

    if (response.status !== 200) {
      const errorMessage: SecureString = { Value: await response.statusText };
      console.error('Error', response.status, errorMessage);
      throw errorMessage;
    }

    const data: SecureString = await response.json();
    console.info('Data: /add', data);
    return data;
  } catch (error) {
    console.error('Error in APIAdd', error);
    throw error;
  }
};

export const DBUserSignIn = async (signInEventModel: SignInEventModel): Promise<SignInResponse> => {
  console.info('DBUserSignIn->signInEventModel', signInEventModel);

  try {
    const body: string = JSON.stringify(signInEventModel);
    console.info('Body: /user/signin', body);

    const response = await fetch(EnvConfig.apiRoot + '/api/user/signin', {
      method: 'POST',
      body: body,
      headers: setHeaders(),
    });

    console.info('Response: /user/signin', response);

    if (response.status !== 200) {
      const errorMessage: SecureString = { Value: await response.statusText };
      console.error('Error in response of DBUserSignIn', response.status, errorMessage);
      throw errorMessage;
    }

    const data: SignInResponse = await response.json();
    console.info('Data: /user/signin', data);
    return data;
  } catch (error) {
    console.error('Error in DBUserSignIn', error);
    throw error;
  }
};

export const DBSaveUser = async (user: UserModel): Promise<UserModel> => {
  console.info('DBSaveUser->user', user);

  try {
    const body: string = JSON.stringify(user);
    console.info('Body: /user/saveuser', body);

    const response = await FetchHelper.fetchWithToken(
      getJwt(),
      EnvConfig.apiRoot + '/api/user/saveuser',
      {
        method: 'PUT',
        body: body,
        headers: setHeaders(),
      },
    );

    console.info('Response: /user/saveuser', response);

    if (response.status !== 200) {
      const errorMessage: SecureString = { Value: await response.statusText };
      console.error('Error in response of DBSaveUser', response.status, errorMessage);
      throw errorMessage;
    }

    const data: UserModel = await response.json();
    console.info('Data: /user/saveuser', data);
    return data;
  } catch (error: any) {
    const errorMessage: SecureString = {
      Value: 'Error in DBSaveUser: ' + (error.Value !== undefined ? error.Value : error),
    };
    console.error(errorMessage);
    throw errorMessage;
  }
};

export const DBSaveFeedback = async (feedback: FeedbackModel): Promise<SecureString> => {
  console.info('DBSaveFeedback->user', feedback);

  try {
    const body: string = JSON.stringify(feedback);
    console.info('Body: /user/savefeedback', body);

    const response = await FetchHelper.fetchWithToken(
      getJwt(),
      EnvConfig.apiRoot + '/api/user/savefeedback',
      {
        method: 'POST',
        body: body,
        headers: setHeaders(),
      },
    );

    console.info('Response: /user/savefeedback', response);

    if (response.status !== 200) {
      const errorMessage: SecureString = { Value: await response.statusText };
      console.error('Error in response of DBSaveFeedback', response.status, errorMessage);
      throw errorMessage;
    }

    const data: SecureString = await response.json();
    console.info('Data: /user/savefeedback', data);
    return data;
  } catch (error: any) {
    const errorMessage: SecureString = {
      Value: 'Error in DBSaveFeedback: ' + (error.Value !== undefined ? error.Value : error),
    };
    console.error(errorMessage);
    throw errorMessage;
  }
};
