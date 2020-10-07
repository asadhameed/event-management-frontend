import React, { useState, useEffect, useMemo } from 'react'
import { UncontrolledAlert, Button, ButtonGroup } from 'reactstrap';
import socketIO from 'socket.io-client';
import api from '../../services/api';
import moment from 'moment';
import './dashboard.css'
export default function DashBoard({ history }) {
    const [events, setEvents] = useState([]);
    const [selectType, setSelectedType] = useState(null);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('')
    
    const id = localStorage.getItem('user');
    const token = localStorage.getItem('token')
    const socket = useMemo(() => {
        if (token) {
            return socketIO('http://localhost:8000', {
                query: { token }
            })
        }
    }, [token])

    const config = {
        headers: { 'x-auth-token': token }
    }

    useEffect(() => {
        getEvents();
    }, [events,selectType])

    useEffect(() => {
        setMessage('');
        if (token) {
           
            socket.on('eventRegistration_request', response => {
                const notifi = `${response.user.firstName} ${response.user.lastName} want to register for your event ${response.event.title} `
                setMessage(notifi)
            })
        }

    }, [socket])


    const filterUserEvent = async (query) => {
        setSelectedType(query)
        const url = '/event/byuser/'
        await getEvents(url)
    }
    const filterEvents = async (query) => {
        setSelectedType(query)
        const url = query ? ('/events/' + query) : '/events';
        await getEvents(url)

    }
    const singOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user')
        history.push('/')
    }
    const registerHandler = async (event) => {
        setMessage('');
        if (!id && !token) {
            setMessage('Please login for register to this Event');
        }

        await api.post('/eventRegister/' + event._id, {}, config)
            .then(res => {
                setMessage('You register for the event wait for approve');
            }).catch(err => {
                if (err.response) {
                    console.log('Response error', err.response)
                }
                else {
                    console.log('else err-------->', err)
                }
            })
    }
    const getEvents = async (filterURL) => {
        const url = filterURL ? filterURL : '/events/'
        await api.get(url, {
            headers: {
                'x-auth-token': token
            }
        })
            .then(response => {
                setEvents(response.data)
            })
            .catch(err => {
                if (err.response) {
                    console.log(err.response.data)
                }
                else {
                    console.log(err)
                }
            })
    }
    const deleteEvent = async (eventId) => {

        setMessage('');
        setError(false)
        await api.delete('/event/' + eventId, config)
            .then(() => {

                setMessage('The event delete Successfully');
                getEvents();
            })
            .catch(err => {
                setError(true)
                if (err.response) {
                    console.log(err.response)
                }
                else
                    console.log(err)
            })

    }
    return (
        <>
            <div className='filterPanel'>
                <ButtonGroup>
                    <Button color='primary' onClick={() => filterEvents(null)} active={selectType === null}>All</Button>
                    <Button color='primary' hidden={!id} onClick={() => filterUserEvent('userEvent')} active={selectType === 'userEvent'} >My events</Button>
                    <Button color='primary' onClick={() => filterEvents('running')} active={selectType === 'running'}>Running</Button>
                    <Button color='primary' onClick={() => filterEvents('swimming')} active={selectType === 'swimming'}>Swimming</Button>
                    <Button color='primary' onClick={() => filterEvents('cycling')} active={selectType === 'cycling'}>Cycling</Button>
                    <Button color='primary' onClick={() => filterEvents('walking')} active={selectType === 'walking'}>walking</Button>

                </ButtonGroup>
                <ButtonGroup>
                    <Button color='danger' hidden={!id} onClick={singOut} >Sign out</Button>
                    <Button color='secondary' hidden={id} onClick={() => history.push('/login')}>Login</Button>
                    <Button color='secondary' hidden={!id} size='sm' onClick={() => history.push('/event')}>Create A event</Button>
                </ButtonGroup>

            </div>
            { (message !== '') ? <UncontrolledAlert color='success' >{message}</UncontrolledAlert> : ''}
            {/* { (notification !== '') ? <UncontrolledAlert color='info' >{notification}</UncontrolledAlert> : ''} */}
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
                            <span><strong>Event Date: </strong>{moment(event.date).format('DD-mm-yyyy')}</span>
                            <span><strong>Event Price: </strong>{parseFloat(event.price).toFixed(2)} $</span>
                            <span><strong>Description: </strong>{event.description}</span>

                            {(event.user !== id) ? <Button id='eventRegister' size='sm' onClick={() => registerHandler(event)}>Register</Button> : ''}

                        </li>
                    ))
                }
            </ul>
        </>
    )
}