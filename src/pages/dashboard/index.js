import React, { useState, useEffect } from 'react'
import { UncontrolledAlert, Button, ButtonGroup, Form } from 'reactstrap';
import api from '../../services/api';
import moment from 'moment';
import './dashboard.css'
export default function DashBoard({ history }) {
    const [events, setEvents] = useState([]);
    const [selectType, setSelectedType] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const id = localStorage.getItem('user');
    const token = localStorage.getItem('token')


    useEffect(() => {
        getEvents();
    }, [])


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
        // localStorage.clear()
        history.push('/')
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
        setSuccess(false)
        setError(false)
        await api.delete('/event/' + eventId, { headers: { 'x-auth-token': token } })
            .then(() => {
                setSuccess(true)
                getEvents()

            }).catch(err => {
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
            { success ? <UncontrolledAlert color='success' >The event delete Successfully</UncontrolledAlert> : ''}
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

                        </li>
                    ))
                }
            </ul>
        </>
    )
}