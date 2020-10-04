import React, { useState, useEffect } from 'react'
import { UncontrolledAlert, Button, ButtonGroup, Form } from 'reactstrap';
import api from '../../services/api';
import moment from 'moment';
import './dashboard.css'
export default function DashBoard({ history }) {
    const [events, setEvents] = useState([]);
    const [selectType, setSelectedType] = useState(null);
    const [url, setUrl] = useState('/events');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [visible, setVisible]=useState(false)
    const id = localStorage.getItem('user');


    useEffect(() => {
        setUrl('/events')
        getEvents();
    }, [])


    const filterUserEvent = (query) => {
        setSelectedType(query)
        setUrl('/event/byuser/')
        getEvents()
    }
    const filterEvents = (query) => {
        setSelectedType(query)
        const url = selectType ? ('/events/' + selectType) : '/events';
        setUrl(url)
        getEvents()

    }
    const getEvents = async () => {
        console.log(url)
        await api.get(url, {
            headers: {
                user_id: id
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
        await api.delete('/event/' + eventId)
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

    console.log(events)
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
                <Button color='secondary' onClick={() => history.push('/event')}>Create A event</Button>

            </div>
            { success ? <UncontrolledAlert color='success' >The event delete Successfully</UncontrolledAlert> : ''}
            {error ? <UncontrolledAlert color='danger' >The event couldn't delete</UncontrolledAlert> : '' } 
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