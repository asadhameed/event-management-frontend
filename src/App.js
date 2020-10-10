import React from 'react';
import './App.css';
import Routers from './routers';
import { Container } from 'reactstrap'
import { ContextWrapper } from './user-context';
function App() {
  return (
   
      <Container> 
         <ContextWrapper>
        <h1>Sport's App</h1>
        <div className='content'>
          <Routers />
        </div>
        </ContextWrapper>
      </Container>
     
  );
}

export default App;
