import React from 'react';
import logo from './logo.svg';
import './App.css';
import useMsal from "./components/core/msal/use-msal";
import HelloWorld from './components/helloWorld';

function App() {
  const {login,logout,getAuthToken,isLoggedIn} = useMsal()
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
          {/* ----------Add this below------------- */}
          <br/>Login Status: {isLoggedIn?<span>Logged In</span> :<span>Logged Out</span>} <br/>
          <button onClick={() => login()}>LogIn</button>
          <button onClick={() => logout()}>LogOut</button>
          <button onClick={() => getAuthToken()}>Get Token</button>
        </p>
        <HelloWorld />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;