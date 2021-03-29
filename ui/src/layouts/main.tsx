import { FC } from 'react';
import HelloWord from '../components/hello-world';
import logo from '../logo.svg';

const Main: FC< any> = (props) => {

 

  return (
    <>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="/login"
        >
          Login
        </a>
        <br/>
        <HelloWord />
        
      </header>
    </>
  )
}

export default Main;