import { GetUserByUserPrincipalName, SendInvitationLink } from '../../../MSGraphAPI/helper';
var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

type SendReferalResult = {
  email: string;
  existing: boolean;
};

export default async function (root, args, context, info) {
  // check if emails (userPrincipalName) are existing
  let emails = args.emails;
  let results: SendReferalResult[] = [];

  // SendGrid's email properties
  let emailSubject = '';
  let emailContent = '';

  for await (const email of emails) {
    let existingUser = await GetUserByUserPrincipalName(email); // return {value:['businessPhones','displayName', ...]}

    if (existingUser.value.length === 0) {
      // new user, send invitation code
      console.log('new user');
      // TODO: generate invitation code
      await SendInvitationLink(email, 'https://soscale.com');

      emailSubject = 'Invitation';
      emailContent = 'TODO: Invitation Code';
      results.push({ email: email, existing: false });
    } else {
      // existing user, use SendGrid to send notification
      console.log('existing user');
      emailSubject = 'Notification';
      emailContent = 'You have a new referal request. Please go to the portal to handle it.';
      results.push({ email: email, existing: true });
    }

    // let sendgridMail = new sendgrid.Email({
    //   to: email,
    //   from: process.env.HOST_EMAIL,
    //   subject: emailSubject,
    //   text: emailContent,
    // });

    // sendgrid.send(sendgridMail, function (err, json) {
    //   if (err) {
    //     return console.error(err);
    //   }
    //   console.log(json);
    // });
  }

  return results;
}
