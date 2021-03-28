import {FC} from 'react';
import logo from './logo.svg';
import './App.css';
import HelloWord from './components/hello-world';
import Login from './layouts/account/login';

const App: FC<any> = (props) => {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <br/>
        <HelloWord />
        <Login />
      </header>
    </div>
  );
}

export default App;
