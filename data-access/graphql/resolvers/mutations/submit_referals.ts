import { GetUserByUserPrincipalName } from '../../../MSGraphAPI/helper';

export default function (root, args, context, info) {
  // check if emails (userPrincipalName) are existing
  let emails = args.emails;
  emails.forEach(async (email) => {
    let existingUser = await GetUserByUserPrincipalName(email); // return {value:['businessPhones','displayName', ...]}
    if (existingUser.value.length === 0) {
      // new user, send invitation code
      console.log('new user');
    } else {
      // existing user, send notification
      console.log('existing user');
    }
  });
}
