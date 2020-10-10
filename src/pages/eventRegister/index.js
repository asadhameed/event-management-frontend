import React, { useContext, useEffect } from 'react';
import {UserContext} from '../../user-context';

export default function EventRegister({history}){
    const {  isLogin} =useContext(UserContext);
    useEffect(()=>{
        if(!isLogin) history.push('/')
    },[isLogin, history])
    return(
        <div>
            This is event Register page!!!
        </div>
    )
}