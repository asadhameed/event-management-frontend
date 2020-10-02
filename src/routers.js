import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/user/login';
import Dashboard from './pages/dashboard';
import Register from './pages/user/register';
import CreateEvent from './pages/event'
export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Dashboard} />
                <Route path='/login' exact component={Login} />
                <Route path='/register' exact component={Register}></Route>
                <Route path='/event' exact component={CreateEvent} />
            </Switch>
        </BrowserRouter>
    )
}