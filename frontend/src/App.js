// import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact />  {/* we give exact because everypage must pass through the pasge and this will also render as well */}
      <Route path="/chat" component={ChatPage} exact  />
    </div>
  );
}

export default App;
