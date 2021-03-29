import {FC} from 'react';

import './App.css';
import Main from './layouts/main';
import Login from './layouts/account/login';
import AssignedProfile from './layouts/account/assigned-profile';
import PasswordlessProfile from './layouts/account/passwordless-profile';
import { Switch, Route } from 'react-router-dom';
import MsalProvider from './components/msal-react-lite';

const App: FC<any> = (props) => {

  return (
    <div className="App">
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route path="/assignedProfile">
          <MsalProvider >

          </MsalProvider>
          <AssignedProfile></AssignedProfile>
        </Route>
        <Route path="/passwordlessProfile">
          <PasswordlessProfile></PasswordlessProfile>
        </Route>
        <Route exact path="/">
          <Main></Main>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
