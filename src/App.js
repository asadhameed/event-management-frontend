import React from 'react';
import './App.css';
import Routers from './routers';
import { Container } from 'reactstrap'
function App() {
  return (
    <Container>
      <h1>Sport's App</h1>
      <div className='content'>
        <Routers />
      </div>
    </Container>
  );
}

export default App;
