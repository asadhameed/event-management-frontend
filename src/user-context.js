import React, { useState, createContext } from 'react';

export const UserContext = createContext();
export const ContextWrapper = (pros) => {

    const defaultValueHandler = () => {
        const id = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        return (id && token) ? true : false;
    }
    const [isLogin, SetLogin] = useState(defaultValueHandler);
    const user = {
        isLogin,
        SetLogin
    }

    return (
        <UserContext.Provider value={user}>
            { /*children should be in small alphabetic */}
            {pros.children}
        </UserContext.Provider>

    )
}