import * as msal from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: process.env.B2C_CLIENT_ID,
    authority: process.env.B2C_AUTHORITY,
    clientSecret: process.env.B2C_CLIENT_SECRET,
  },
};

// With client credentials flows permissions need to be granted in the portal by a tenant administrator.
// The scope is always in the format '<resource>/.default'.
const tokenRequest = {
  scopes: ['https://graph.microsoft.com/.default'],
};

// Create msal application object
const cca = new msal.ConfidentialClientApplication(msalConfig);

class MyAuthenticationProvider {
  /**
   * This method will get called before every request to the msgraph server
   * This should return a Promise that resolves to an accessToken (in case of success) or rejects with error (in case of failure)
   * Basically this method will contain the implementation for getting and refreshing accessTokens
   */

  async getAccessToken() {
    return new Promise(async (resolve, reject) => {
      const authResponse = await cca.acquireTokenByClientCredential(tokenRequest);
      if (authResponse.accessToken && authResponse.accessToken.length !== 0) {
        resolve(authResponse.accessToken);
      } else {
        reject(Error('Error: cannot obtain access token.'));
      }
    });
  }
}

module.exports = MyAuthenticationProvider;
