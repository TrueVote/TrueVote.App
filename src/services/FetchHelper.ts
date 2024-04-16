/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/typedef */
import { SecureString } from '@/TrueVote.Api';
import { storeJwt } from './DataClient';
import { getNostrNsecFromStorage } from './NostrHelper';
import { signInWithNostr } from './PagerHelper';

export class FetchHelper {
  public static handleError(e: SecureString): void {
    console.error('Error from FetchHelper->signIn', e);
  }

  private static async checkForExpiredToken(response: Response): Promise<boolean> {
    console.debug('FetchHelper->checkForExpiredToken()', response);

    // Check if the response has a 401 Unauthorized status
    if (response.status !== 401) {
      return false;
    }

    // Check if the www-authenticate header is present
    const wwwAuthenticate = response.headers.get('www-authenticate');
    if (wwwAuthenticate) {
      // Parse the www-authenticate header to check for the 'error="invalid_token"' and 'error_description' values
      if (wwwAuthenticate.includes('invalid_token') && wwwAuthenticate.includes('expired')) {
        return true; // Token has expired
      }
    }

    return false; // Token has not expired. Must be some other reason.
  }

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

    // Determine if it is a 401 because the token is expired or another reason. Inspect the headers.
    if (response.status === 401 && (await FetchHelper.checkForExpiredToken(response))) {
      console.error('FetchHelper, 401 Unauthorized - Expired Token', response);

      // Try and sign in again
      const nsec: string | null = getNostrNsecFromStorage();
      if (nsec !== null && String(nsec).length > 0) {
        const { res } = await signInWithNostr(nsec, FetchHelper.handleError);
        if (res) {
          console.info('Success from FetchHelper->signIn', res);
          storeJwt(res.Value);

          // Call self recursively now that we have a new token, this will re-submit the request with the new token
          return this.fetchWithToken(res.Value, url);
        }
      }

      // Return the original response and the caller will handle
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
        console.info('Received new token, updating storage');
        storeJwt(newToken);
      }
    }

    // Return the response
    return response;
  }
}
