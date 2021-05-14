// npm i express passport passport-http azure-function-express

import { createHandler } from 'azure-function-express';
import express, { Router } from 'express';
import passport from 'passport';
import { conflictError } from './interfaces';

const app: express.Application = express();
const router = Router();

app.use(passport.initialize());

router.route('/health').get((_req, res) => {
  return res.status(200).json({ status: 'healthy' });
});

router.route('/logIn').post((req, res) => {
  try {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var isEmailAddress = emailRegex.test(req.body['signInNames.userName']);

    if (isEmailAddress) {
      var unauthMessage = {
        version: '1.0.1',
        status: 409,
        userMessage: 'The username or password provided in the request are invalid.',
      } as conflictError;

      return res.status(409).json(unauthMessage);
    } else {
      /*
      Roles for Authority Portal =
      ACE_ADMIN
      USER_SV
      ADMIN_SV
      ACE_ADMIN_SV
      ACE_ADMIN_DIVA
      ADMIN_DIVA
      USER_DIVA
      */
      return res.status(200).json({
        bodyData: JSON.stringify({
          emswpUserPermissions: [{ roles: ['ADMIN_SV'], schoolId: 302 }],
        }),
        callRestAPI: false,
      });
    }
  } catch (error) {
    console.error('oops', error);
  }
});

router.route("/signUpWithEmail").post((req, res) => {
  console.log('signUpWithEmail');
  try {
    console.log(req.body);
    var isEmailValid = true; //Database call to validate email
    var expiredOTP = false //OTP is never expired at original sign up

    if (isEmailValid){
      //Email valid
      return res.status(200).json({message: "nothing", expiredOTP: expiredOTP});
    }
    else {
      //Email not valid
      var unauthMessage = {
        version: '1.0.1',
        status: 409,
        userMessage: 'Email not valid.',
      } as conflictError;
      return res.status(409).json(unauthMessage);
    }
  }
  catch (error) {
    console.log(error);
    return res.status(409).json({message: "nothing"});
  }
});

router.route("/compareSignInEmail").post((req, res) => {
  console.log('compareSignInEmail');
  try {
    console.log(req.body);
    var validEmail = true;
    //var originalLogInEmail = req.body.originalLogInEmail;
    if (validEmail){
      return res.status(200).json({message: "nothing"});
    }
    else {
      var unauthMessage = {
        version: '1.0.1',
        status: 409,
        userMessage: 'Email not valid.',
      } as conflictError;
      return res.status(409).json(unauthMessage);
    }
  }
  catch (error) {
    console.log(error);
    return res.status(409).json({message: "nothing"});
  }
});

router.route("/checkOTPExpiration").post((req, res) => {
  console.log('checkOTPExpiration');
  try {
    console.log(req.body);
    var expiredOTP = true //Database call to check OTP expiration

    return res.status(200).json({message: "nothing", expiredOTP: expiredOTP, originalLogInEmail: req.body.signInName});
  }
  catch (error) {
    console.log(error);
    return res.status(409).json({message: "nothing"});
  }
});

router.route("/saveNewUserOID").post((req, res) => {
  console.log('saveNewUserOID');
  try {
    console.log(req.body);
    //email: req.body.email
    //objectId: req.body.objectId

    return res.status(200).json({message: "nothing"});
  }
  catch (error) {
    console.log(error);
    return res.status(409).json({message: "nothing"});
  }
});

app.use("/api/B2CProfileLookup", router);

module.exports = createHandler(app);
