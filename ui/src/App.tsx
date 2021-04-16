import React, { FC } from 'react';

import './App.css';
import Main from './layouts/main';
import Login from './layouts/account/login';
import AssignedProfile from './layouts/account/assigned-profile';
import PasswordlessProfile from './layouts/account/passwordless-profile';
import { Switch, Route } from 'react-router-dom';
import RequireMsal from './components/require-msal';
import SubmitEmails from './layouts/applicant-portal/submit-emails';

const App: FC<any> = (props) => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/passwordlessProfile">
          <RequireMsal identifier="passwordless">
            <PasswordlessProfile />
            <SubmitEmails />
          </RequireMsal>
        </Route>
        <Route path="/assignedProfile">
          <RequireMsal identifier="assigned">
            <AssignedProfile />
          </RequireMsal>
        </Route>

        <Route exact path="/">
          <Main></Main>
        </Route>
      </Switch>
    </div>
  );
};

export default App;
