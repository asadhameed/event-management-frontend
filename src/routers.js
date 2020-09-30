import React from 'react'
import {BrowserRouter,Switch, Route} from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
export default function Router(){
    return(
        <BrowserRouter>
        <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/dashboard' exact component={Dashboard} />
        </Switch>
        </BrowserRouter>
    )
}