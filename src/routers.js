import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/user/login';
import Dashboard from './pages/dashboard';
import Register from './pages/user/register';
import CreateEvent from './pages/event'
import EventRegister from './pages/eventRegister';
import Topnav from './components/topnav';
import EventRegisterStatus from './pages/eventRegisterStatus';
export default function Router() {
    return (
        <BrowserRouter>
        <Topnav></Topnav>
            <Switch>
                <Route path='/' exact component={Dashboard} />
                <Route path='/login' exact component={Login} />
                <Route path='/register' exact component={Register} />
                <Route path='/event' exact component={CreateEvent} />
                <Route path='/eventRegister' exact component={EventRegister} />
                <Route path='/eventRegisterStatus' exact component={EventRegisterStatus} />
            </Switch>
        </BrowserRouter>
    )
}