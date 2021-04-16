import { GetUserByUserPrincipalName } from '../../../MSGraphAPI/helper';
// var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);

type Result = {
  email: string;
  existing: boolean;
};

export default async function (root, args, context, info) {
  // check if emails (userPrincipalName) are existing
  let emails = args.emails;
  let results: Result[] = [];

  for await (const email of emails) {
    let existingUser = await GetUserByUserPrincipalName(email); // return {value:['businessPhones','displayName', ...]}
    if (existingUser.value.length === 0) {
      // new user, send invitation code
      console.log('new user');
      results.push({ email: email, existing: false });
    } else {
      // existing user, send notification
      console.log('existing user');
      results.push({ email: email, existing: true });
    }
  }

  // emails.forEach(async (email) => {
  //   let existingUser = await GetUserByUserPrincipalName(email); // return {value:['businessPhones','displayName', ...]}
  //   if (existingUser.value.length === 0) {
  //     // new user, send invitation code
  //     console.log('new user');
  //     results.push({ email: email, existing: false });
  //   } else {
  //     // existing user, send notification
  //     console.log('existing user');
  //     results.push({ email: email, existing: true });
  //   }
  // });
  return results;
}
