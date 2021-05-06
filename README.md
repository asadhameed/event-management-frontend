# Project Description

The front-end of the web application of <strong>Event management</strong>. <br>
The application has the following pages:

- The <strong>Dashboard</strong> Shows all events and user can filter the events by type.
- <strong> Log in Page </strong>
- <strong> Registration Page </strong>
- <strong> MyEvents </strong> Shows all events which user is created.
- <strong> Subscribed Events </strong> Shows the events which user is subscribed. See the status of the events.
- <strong> Create event </strong> Log in user can create an event.
- If a user subscribed to the event then send the notification to the admin. The admin can accept or reject the event.

## Setup with Back-end API

First, open src\service\api.js file in the project directory. Change the baseURL value

- baseURL:'BACK-END API' <br>
  <space> For example baseURL:'http://localhost:8000/'

Open src\pages\dashboard\index.js file in the project directory. Change the socketIO value

- socketIO('BACK-END API' <br>
  <space> For example socketIO('http://localhost:8000/'

Open package.json file in the project directory.

- Running app on local machine then change the following value <br>
  <space> "start":"react-scripts start"
- Deploying app on heroku then did not change the start value .

## Available Scripts

In the project directory, you can run:

### `npm i`

This command will install all the dependency packages in the node_modules directory.

### `npm start`

Runs the app in the production mode.<br />
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

### Open [Back-End Code](https://github.com/asadhameed/event-management-backend)
