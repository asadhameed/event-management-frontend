import React, { useState, useEffect, useMemo, useContext } from 'react'
import { UncontrolledAlert, Button, ButtonGroup, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import Axios from 'axios';
import socketIO from 'socket.io-client';
import api from '../../services/api';
import moment from 'moment';
import { UserContext } from '../../user-context';
import './dashboard.css'
export default function DashBoard({ history }) {
    const [events, setEvents] = useState([]);
    const [url, setURL] = useState('/events');
    const [selectType, setSelectedType] = useState(null);
    const [eventsRegisterRequest, setEventsRegisterRequest] = useState([]);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [token] = useState(localStorage.getItem('token'));
    const [config] = useState({ headers: { 'x-auth-token': token } });
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [eventSubscribed, setEventSubscribed] = useState([]);
    const { isLogin } = useContext(UserContext);
    const id = localStorage.getItem('user');

    const toggle = () => setDropDownOpen(!dropDownOpen);
    const socket = useMemo(() => {
        if (token) {
            return socketIO('https://sport-event-api.herokuapp.com/', {
                query: { token }
            })
        }
    }, [token])


    useEffect(() => {
        setMessage('');
        let isActive = true
        if (isActive) {
            if (token) {

                socket.on('eventRegistration_request', response => {
                    setEventsRegisterRequest([...eventsRegisterRequest, response]);
                    const notification = `${response.user.firstName} ${response.user.lastName} want to register for your event ${response.event.title} `;
                    setMessage(notification);
                })
            }
        }
        isActive = false;
    }, [socket, eventsRegisterRequest, token])

    useEffect(() => {
        /***********************************
         * Can't perform a React state update on an unmounted component. 
         * This is a no-op, but it indicates a memory leak in your application. 
         * To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
         */
        //first method--->CancelToke
        // second define own variable like isActive
        // let isActive=true
        const source = Axios.CancelToken.source();
        config.cancelToken = source.token;
        async function getEvents() {
            await api.get(url, config)
                .then(response => {
                    // if(isActive){
                    setEvents(response.data);
                    //  }

                })
                .catch(err => {

                    if (err.response) {
                        console.log(err.response.data);
                    }
                    else {
                        console.log(err);
                    }
                })
        }
        getEvents();

        return () => {
            //isActive=false;
            source.cancel();
        }
    }, [url, config])

    useEffect(() => {
        const source = Axios.CancelToken.source();
        config.cancelToken = source.token;
        async function getEventSubscribed() {
            await api.get('/eventsSubscribed', config)
                .then(res => setEventSubscribed(res.data))
                .catch(err => console.log(err))
        }
        if (isLogin) getEventSubscribed();

        return () => {
            source.cancel();
        }

    }, [url, config, isLogin, message])
    const filterUserEvent = async (query) => {
        setSelectedType(query);
        const url = '/event/byuser/';
        setURL(url);
    }
    const filterEvents = async (query) => {
        setSelectedType(query);
        const url = query ? ('/events/' + query) : '/events';
        setURL(url);

    }
    const registerHandler = async (event) => {
        setMessage('');
        if (!isLogin) {
            setMessage('Please login for register to this Event');
        }

        await api.post('/eventRegister/' + event._id, {}, config)
            .then(res => {
                setMessage('You register for the event wait for approve');
            }).catch(err => {
                if (err.response) {
                    console.log('Response error', err.response);
                }
                else {
                    console.log('else err-------->', err);
                }
            })
    }

    const approvalEventRegister = async (status, eventRegister) => {
        //console.log(status, eventRegister)
        await api.post('/eventRegister/' + status + eventRegister._id)
            .then(res => {
                const filterEvents = eventsRegisterRequest.filter(item => item !== eventRegister);
                setEventsRegisterRequest(filterEvents);


            })
            .catch(err => console.log(err))
    }
    const approveHandler = async (eventRegister) => {
        await approvalEventRegister('approved/', eventRegister);
    }
    const rejectHandler = async (eventRegister) => {
        await approvalEventRegister('rejected/', eventRegister);
    }
    const deleteEvent = async (eventId) => {
        setMessage('');
        setError(false);
        await api.delete('/event/' + eventId, config)
            .then(() => {
                setMessage('The event delete Successfully');
                setURL(url);
            })
            .catch(err => {
                setError(true);
                if (err.response) {
                    console.log(err.response);
                }
                else
                    console.log(err);
            })
    }

    const isEventSubscribed = (eventId) => {
        // console.log(eventSubscribed)
        const findEventSubscribed = eventSubscribed.find(eventSub => eventSub.event._id === eventId);
        if (!findEventSubscribed)
            return false;
        if (findEventSubscribed.approved)
            return 'Approved'
        return (findEventSubscribed.approved === false) ? 'Rejected' : 'Pending'
    }

    return (

        <>
            <ul className='eventRegisterRequest'>
                {
                    eventsRegisterRequest.map(register => (
                        <li key={register._id}>
                            <div className='eventRegisterRequestPanel'>
                                <span>
                                    <strong>{register.user.firstName} {register.user.lastName} </strong>
                                          want to register for the event
                                <strong>{register.event.title}</strong>
                                </span>
                                <ButtonGroup>
                                    <Button color='success' onClick={() => approveHandler(register)} >Accept</Button>
                                    <Button color='danger' onClick={() => rejectHandler(register)} >Reject</Button>
                                </ButtonGroup>
                            </div>
                        </li>
                    ))
                }
            </ul>
            <div className='filterPanel'>
                <Dropdown isOpen={dropDownOpen} toggle={toggle}>
                    <DropdownToggle color='primary' caret>Filter</DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem color='primary' onClick={() => filterEvents(null)} active={selectType === null}>All</DropdownItem>
                        <DropdownItem color='primary' hidden={!isLogin} onClick={() => filterUserEvent('userEvent')} active={selectType === 'userEvent'} >My Events</DropdownItem>
                        <DropdownItem color='primary' onClick={() => filterEvents('running')} active={selectType === 'running'}>Running</DropdownItem>
                        <DropdownItem color='primary' onClick={() => filterEvents('swimming')} active={selectType === 'swimming'}>Swimming</DropdownItem>
                        <DropdownItem color='primary' onClick={() => filterEvents('cycling')} active={selectType === 'cycling'}>Cycling</DropdownItem>
                        <DropdownItem color='primary' onClick={() => filterEvents('walking')} active={selectType === 'walking'}>Walking</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            { (message !== '') ? <UncontrolledAlert color='success' >{message}</UncontrolledAlert> : ''}
            {error ? <UncontrolledAlert color='danger' >The event couldn't delete</UncontrolledAlert> : ''}
            <ul className='eventsList'>
                {
                    events.map(event => (
                        <li key={event._id}>
                            <header style={{ backgroundImage: `url(${event.thumbnail_url})` }} >
                                <div>
                                    {(event.user === id) ? <Button color='danger' onClick={() => deleteEvent(event._id)} size='sm'>X</Button> : ''}
                                </div>
                            </header>

                            <strong id='eventTitle'>{event.title}</strong>
                            <span><strong>Type: </strong>{event.eventType}</span>
                            <span><strong>Event Date: </strong>{moment(event.date).format('DD-MM-YYYY')}</span>
                            <span><strong>Event Price: </strong>{parseFloat(event.price).toFixed(2)} $</span>
                            <span><strong>Description: </strong>{event.description}</span>
                            { isEventSubscribed(event._id) ? <span><strong>Status: </strong>{isEventSubscribed(event._id)}</span> : ''}
                            {(event.user !== id && !isEventSubscribed(event._id)) ? <Button id='eventRegister' size='sm' onClick={() => registerHandler(event)}>Register</Button> : ''}
                        </li>
                    ))
                }
            </ul>
        </>
    )
}