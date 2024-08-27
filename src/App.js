import React, { useState } from 'react';
import './App.css';
import { Header } from './Components/Navbar'; // Corrected import name
import { GameDashboard } from './Components/GameDashboard';

function App() {
  const [account, setAccount] = useState('');

  return (
    <div className="App">
      <Header setAccount={setAccount} />
      <GameDashboard account={account} />
    </div>
  );
}

export default App;
