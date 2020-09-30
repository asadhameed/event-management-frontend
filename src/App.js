import React from 'react';
import './App.css';
import Routers from './routers';
import { Container } from 'reactstrap'
import { Route } from 'react-router-dom';
function App() {
  return (
    <Container>
      <h1>Sport's App</h1>
      <Routers></Routers>
    </Container>


  );
}

export default App;
