import 'isomorphic-fetch';
import MicrosoftGraph, { Client } from '@microsoft/microsoft-graph-client';
import e from 'express';

const MyAuthenticationProvider = require('./authConfig');
const clientOptions = {
  authProvider: new MyAuthenticationProvider(),
} as MicrosoftGraph.ClientOptions;

const client = Client.initWithMiddleware(clientOptions);
const b2cIssuer = process.env.B2C_TENANT ?? 'missing-issuer';
// const b2cExtensionClientId = process.env.B2C_EXTENSION_CLIENT_ID;

export async function GetUserByUserPrincipalName(userPrincipalName: string) {
  console.log('Graph API called at: ' + new Date().toString());
  return client
    .api(`/users`)
    .filter(
      `identities/any(c:c/issuerAssignedId eq '${userPrincipalName}' and c/issuer eq '${b2cIssuer}')`
    )
    .select([
      'businessPhones',
      'displayName',
      'givenName',
      'jobTitle',
      'mail',
      'mobilePhone',
      'officeLocation',
      'preferredLanguage',
      'surname',
      'userPrincipalName',
      'id',
    ])
    .get()
    .catch((err) => {
      console.log(err);
    });
}

export async function SendInvitationLink(email: string, redirectURL) {
  const invitation = {
    invitedUserEmailAddress: email,
    inviteRedirectUrl: redirectURL,
    sendInvitationMessage: true,
  };

  let invitationResult = await client.api('/invitations').post(invitation);
  console.log(invitationResult);
}
