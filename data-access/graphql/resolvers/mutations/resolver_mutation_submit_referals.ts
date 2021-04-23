import { mail } from 'sendgrid';
import { GetUserByUserPrincipalName, SendInvitationLink } from '../../../MSGraphAPI/helper';
const sgMail = require('@sendgrid/mail');
// var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

type SendReferalResult = {
  email: string;
  existing: boolean;
};

const sendGridSendMail = (email: string, subject: string, content: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email, // Change to your recipient
    from: process.env.HOST_EMAIL, // Change to your verified sender
    subject: subject,
    text: content,
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

export default async function (root, args, context, info) {
  // check if emails (userPrincipalName) are existing
  let emails = args.emails;
  let results: SendReferalResult[] = [];

  // SendGrid's email properties
  let subject = '';
  let content = '';

  for await (const email of emails) {
    let existingUser = await GetUserByUserPrincipalName(email); // return {value:['businessPhones','displayName', ...]}

    if (existingUser.value.length === 0) {
      // new user, send invitation code
      console.log('new user');

      // await SendInvitationLink(email, 'https://soscale.com');

      subject = 'Invitation';
      // TODO: generate invitation code
      content = 'TODO: Invitation Code';
      results.push({ email: email, existing: false });
    } else {
      // existing user, use SendGrid to send notification
      console.log('existing user');
      subject = 'Notification';
      content = 'You have a new referal request. Please go to the portal to handle it.';
      results.push({ email: email, existing: true });
    }

    sendGridSendMail(email, subject, content);
  }

  return results;
}
