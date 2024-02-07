/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/typedef */
import { useNostrProfile } from '@/Global';
import { storeJwt } from './DataClient';
import { nostrSignOut } from './NostrHelper';

export class FetchHelper {
  public static async fetchWithToken(
    currentToken: string | null,
    url: string,
    options?: RequestInit,
  ): Promise<Response> {
    //const { nostrProfile, updateNostrProfile } = useGlobalState();

    // Add authorization header with the current token
    if (currentToken) {
      if (!options) {
        options = {};
      }
      if (!options.headers) {
        options.headers = new Headers();
      } else if (!(options.headers instanceof Headers)) {
        // Convert headers object to Headers instance
        options.headers = new Headers(options.headers);
      }
      options.headers.append('Authorization', `Bearer ${currentToken}`);
    }

    // Perform the fetch request
    const response = await fetch(url, options);

    // Server says no, need to logout user client side
    if (response.status === 401) {
      console.error('FetchHelper, 401 Unauthorized');

      console.info('Current NostrProfile', useNostrProfile);
      // useUpdateNostrProfile(emptyNostrProfile);
      nostrSignOut();
      console.info('Updated NostrProfile', useNostrProfile);

      return response;
    }

    // Check if the response includes an Authorization header
    const authHeader = response.headers.get('Authorization');
    console.info('AuthHeader', authHeader);
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract the token from the response header
      const newToken = authHeader.substring('Bearer '.length);

      // Compare the new token with the current token
      if (newToken !== currentToken) {
        // Update the current token
        storeJwt(currentToken);
      }
    }

    // Return the response
    return response;
  }
}
