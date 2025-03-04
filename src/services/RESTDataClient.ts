import {
  CheckCodeRequest,
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
import { FetchHelper } from './FetchHelper';

const JwtStorageKey: string = 'jwt_token';
declare const __API_URL__: string;
export const ApiRoot: string = __API_URL__;

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

export const DBSubmitBallot = async (
  submitBallotModel: SubmitBallotModel,
): Promise<SubmitBallotModelResponse> => {
  console.info('DBSubmitBallot->submitBallotModel', submitBallotModel);

  const body: string = JSON.stringify(submitBallotModel);
  console.info('Body: /ballot/submitballot', body);

  return await FetchHelper.fetchWithToken(getJwt(), __API_URL__ + '/ballot/submitballot', {
    method: 'POST',
    body: body,
    headers: setHeaders(),
  })
    .then(async (res: Response) => {
      console.info('Response: /ballot/submitballot', res);
      if (res.status !== 201) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { message: res.statusText };
        }
        console.error(res.status + ' Error', errorData);
        throw errorData;
      }
      return res.json();
    })
    .then((data: SubmitBallotModelResponse) => {
      console.info('Data: /ballot/submitballot', data);
      return data;
    })
    .catch((e: any) => {
      console.error('Catch Error: /ballot/submitballot', e);
      throw e;
    });
};

export const APIStatus = async (): Promise<StatusModel> => {
  console.info('Request: /status');

  try {
    const response = await FetchHelper.fetchWithToken(getJwt(), __API_URL__ + '/status', {
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
    const response = await FetchHelper.fetchWithToken(getJwt(), __API_URL__ + '/ping', {
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
    const response = await FetchHelper.fetchWithToken(getJwt(), __API_URL__ + '/add', {
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

    if (FetchHelper.debugDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, FetchHelper.debugDelay));
    }

    const response = await fetch(__API_URL__ + '/user/signin', {
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

    const response = await FetchHelper.fetchWithToken(getJwt(), __API_URL__ + '/user/saveuser', {
      method: 'PUT',
      body: body,
      headers: setHeaders(),
    });

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
  console.info('DBSaveFeedback->feedback', feedback);

  try {
    const body: string = JSON.stringify(feedback);
    console.info('Body: /user/savefeedback', body);

    const response = await FetchHelper.fetchWithToken(
      getJwt(),
      __API_URL__ + '/user/savefeedback',
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

export const DBCheckAccessCode = async (
  checkCodeRequest: CheckCodeRequest,
): Promise<ElectionModel> => {
  console.info('DBCheckAccessCode->AccessCode', checkCodeRequest.AccessCode);

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('AccessCode', checkCodeRequest.AccessCode);
    console.info('Body: /election/checkaccesscode', queryParams.toString());

    const response = await FetchHelper.fetchWithToken(
      getJwt(),
      __API_URL__ + '/election/checkaccesscode?' + queryParams.toString(),
      {
        method: 'GET',
        headers: setHeaders(),
      },
    );

    console.info('Response: /election/checkaccesscode', response);

    if (response.status !== 200) {
      const errorMessage: SecureString = { Value: await response.statusText };
      console.error('Error in response of DBCheckAccessCode', response.status, errorMessage);
      throw errorMessage;
    }

    const data: ElectionModel = await response.json();
    console.info('Data: /election/checkaccesscode', data);
    return data;
  } catch (error: any) {
    const errorMessage: SecureString = {
      Value: 'Error in DBCheckAccessCode: ' + (error.Value !== undefined ? error.Value : error),
    };
    console.error(errorMessage);
    throw errorMessage;
  }
};
