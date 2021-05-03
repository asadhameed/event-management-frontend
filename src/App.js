import React from "react";
import "./App.css";
import Routers from "./routers";
import { Container } from "reactstrap";
import { ContextWrapper } from "./user-context";
function App() {
  return (
    <Container>
      <ContextWrapper>
        <h1>Event's App</h1>
        <div className="github_link">
          <a
            rel="noopener noreferrer"
            href="https://github.com/asadhameed/event-management-frontend"
            target="_blank"
          >
            <h6>Front-End code</h6>
          </a>
          <a
            rel="noopener noreferrer"
            href="https://github.com/asadhameed/event-management-backend"
            target="_blank"
          >
            <h6 style={{ float: "right" }}> Back-End code</h6>
          </a>
        </div>
        <div className="content">
          <Routers />
        </div>
      </ContextWrapper>
    </Container>
  );
}

export default App;
