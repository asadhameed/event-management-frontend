
import React, { useState, useContext } from 'react';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../user-context';
const TopNav = () => {
    const [collapsed, setCollapsed] = useState(true);
    const { isLogin, SetLogin } = useContext(UserContext)

    const toggleNavbar = () => setCollapsed(!collapsed);

    const logoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        SetLogin(false);
    }

    return (
        <div>
            <Navbar color="faded" light>
                <NavbarToggler onClick={toggleNavbar} />
                <Link to='/' hidden={!isLogin} onClick={logoutHandler}>Log out</Link>
                <Link to='/login' hidden={isLogin} >Log in</Link>

                <Collapse isOpen={!collapsed} navbar>
                    <Nav navbar>

                        <NavItem>
                            <Link to='/' >Dash Board</Link>
                        </NavItem>
                        {isLogin ?
                            <div>
                                <NavItem>
                                    <Link to='/eventRegister'>My Events</Link>
                                </NavItem>
                                <NavItem>
                                    <Link to='/eventRegisterStatus'>Subscribed Events</Link>
                                </NavItem>
                                <NavItem>
                                    <Link to='/event'> Create Event</Link>
                                </NavItem>
                            </div>
                            : ""}
                    </Nav>
                </Collapse>


            </Navbar>
        </div>
    )

}

export default TopNav;