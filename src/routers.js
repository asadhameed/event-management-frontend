import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/user/login';
import Dashboard from './pages/dashboard';
import Register from './pages/user/register';
//<Route path='/' exact component={Login} />
//<Route path='/' exact component={Register}></Route>
export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Register}></Route>
                <Route path='/' exact component={Login} />
                <Route path='/dashboard' exact component={Dashboard} />
            </Switch>
        </BrowserRouter>
    )
}