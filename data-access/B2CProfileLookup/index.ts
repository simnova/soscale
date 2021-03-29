// npm i express passport passport-http azure-function-express


import { createHandler } from "azure-function-express";
import express, { Router } from "express";
import passport from "passport";


const app: express.Application = express();
const router = Router();

app.use(passport.initialize());



router.route("/health").get((_req, res) => {
  return res.status(200).json({ status: "healthy" });
});

router.route("/logIn").post((req, res) => {
  try {
    return res.status(200).json({bodyData: JSON.stringify({"emswpUserPermissions":[{"roles":["ADMIN_SV"],"schoolId":302}]})});
  }
  catch (error) {
    console.error("oops",error)
  }
});

app.use("/api/B2CProfileLookup", router);

module.exports = createHandler(app);