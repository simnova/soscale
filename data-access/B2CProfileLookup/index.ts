// npm i express passport passport-http azure-function-express


import { createHandler } from "azure-function-express";
import express, { Router } from "express";
import passport from "passport";
import { BasicStrategy } from "passport-http";

//Credentials used for validating api calls
const b2cUsername = process.env.B2C_HTTP_USERNAME ?? 'missing-username'; //TODO: to be populated from Key Vault
const b2cPassword = process.env.B2C_HTTP_PASSWORD ?? 'missing-password'; //TODO: to be populated from Key Vault

const app: express.Application = express();
const router = Router();

app.use(passport.initialize());

passport.use(new BasicStrategy(
  function(username, password, done) {
    if (username === b2cUsername && password === b2cPassword) {
      return done(null, true);
    }
    return done(null, true); //mark false if we really cared
  }
))

router.route("/health").get((_req, res) => {
  return res.status(200).json({ status: "healthy" });
});

router.route("/logIn").post(passport.authenticate('basic', {
  session: false
}), async (req, res) => {
  try {
    if (req.body) {
      return res.status(200).json({bodyData: JSON.stringify({"emswpUserPermissions":[{"roles":["ADMIN_SV"],"schoolId":302}]})});
    }
    else {
      return res.status(200).json({bodyData: "ERROR - Request body from B2C is empty"});
    }
  }
  catch (error) {
    console.error("oops",error)
  }
});

app.use("/api/B2CProfileLookup", router);

module.exports = createHandler(app);