import React, { useState, useEffect, useMemo } from 'react'
import { UncontrolledAlert, Button, ButtonGroup } from 'reactstrap';
import Axios from 'axios';
import socketIO from 'socket.io-client';
import api from '../../services/api';
import moment from 'moment';
import './dashboard.css'
export default function DashBoard({ history }) {
    const [events, setEvents] = useState([]);
    const [url ,setURL] = useState('/events')
    const [selectType, setSelectedType] = useState(null);
    const [eventsRegisterRequest, setEventsRegisterRequest] = useState([])
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('')
    const [token, setToken]=useState(localStorage.getItem('token'))

    const [config, setConfig] = useState( {    headers: { 'x-auth-token': token }})
    const id = localStorage.getItem('user');
   
    const socket = useMemo(() => {
        if (token) {
            return socketIO('http://localhost:8000', {
                query: { token }
            })
        }
    }, [token])

   
    useEffect(() => {
        setMessage('');
        if (token) {

            socket.on('eventRegistration_request', response => {
                setEventsRegisterRequest([...eventsRegisterRequest, response]);
                const notification = `${response.user.firstName} ${response.user.lastName} want to register for your event ${response.event.title} `
                setMessage(notification)
            })
        }

    }, [socket, eventsRegisterRequest,token])

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
        config.cancelToken=source.token;
        async function getEvents  ()  {
            await api.get(url, config)
                .then(response => {
                   // if(isActive){
                         setEvents(response.data)
                  //  }
                   
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
        getEvents();

      return ()=>{
          //isActive=false;
          source.cancel()
        }
    }, [url, events, config])

   
    const filterUserEvent = async (query) => {
        setSelectedType(query)
        const url = '/event/byuser/'
         setURL(url)
    }
    const filterEvents = async (query) => {
        setSelectedType(query)
        const url = query ? ('/events/' + query) : '/events';
         setURL(url)

    }
    const singOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user')
        setConfig('')
        setToken('');
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

    const approvalEventRegister= async(status,eventRegister)=>{
        //console.log(status, eventRegister)
        await api.post('/eventRegister/'+status + eventRegister._id)
        .then(res=>{
            const filterEvents = eventsRegisterRequest.filter(item=> item !== eventRegister )
            setEventsRegisterRequest(filterEvents)
           

        })
        .catch(err=>console.log(err))
    }
    const approveHandler = async(eventRegister)=>{
        await approvalEventRegister('approved/',eventRegister);
    }
    const rejectHandler = async(eventRegister)=>{
        await approvalEventRegister('rejected/',eventRegister);
    }
    const deleteEvent = async (eventId) => {
        setMessage('');
        setError(false)
        await api.delete('/event/' + eventId, config)
            .then(() => {
                setMessage('The event delete Successfully');
                setURL(url)
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
            {/* {console.log(eventsRegisterRequest)} */}
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
                                    <Button color='success' onClick={()=>approveHandler(register)} >Approve</Button>
                                    <Button color='danger'  onClick={()=>rejectHandler(register)} >Reject</Button>
                                </ButtonGroup>

                            </div>  </li>
                    ))
                }
            </ul>
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