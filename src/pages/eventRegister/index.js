import React, { useContext, useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import Axios from 'axios';
import moment from 'moment'

import api from '../../services/api';
import { UserContext } from '../../user-context';
import './eventRegister.css'

export default function EventRegister({ history }) {
    const { isLogin } = useContext(UserContext);
    const [statusChange, setStatusChange] = useState(false);
    const [eventsRegister, setEventsRegister] = useState([]);
    const [token] = useState(localStorage.getItem('token'));
    const [config] = useState({ headers: { 'x-auth-token': token } });

    useEffect(() => {
        if (!isLogin) history.push('/');
        const source = Axios.CancelToken.source();
        config.cancelToken = source.token;
        const getEventRegister = () => {
            api.get('/eventsRegister', config)
                .then(res => {
                    setEventsRegister(res.data);
                })
                .catch(err => console.log(err))
        }
        getEventRegister();

        return () => {
            source.cancel();
        }
    }, [isLogin, history, statusChange, config])

    const isApproved = (status) => status ? 'Approved' : 'Rejected'
    const approvalEventRegister = async (statusUrl, eventReg) => {
        setStatusChange(false);
        await api.post('/eventRegister/' + statusUrl + eventReg._id)
            .then(res => {
                setStatusChange(true);
            })
            .catch(err => setStatusChange(true))
    }

    const approvedHandler = (eventReg) => {
        approvalEventRegister('approved/', eventReg);
    }

    const rejectedHandler = (eventReg) => {
        approvalEventRegister('rejected/', eventReg);
    }

    return ((
        (eventsRegister.length) ?
            (
                <>
                    <div className='pageHeadline'> <strong>Users waiting for approval</strong></div>
                    <ul className='eventsRegister'>
                        {
                            eventsRegister.map(eventReg => (
                                <li key={eventReg._id}>
                                    <div> <strong id='eventTitle'>{eventReg.event.title}</strong></div>
                                    <span><strong> Event Date :</strong> {moment(eventReg.event.date).format('DD-MM-YYYY')}</span>
                                    <span><strong> Price: </strong>{parseFloat(eventReg.event.price).toFixed(2)} $</span>
                                    <span> <strong>User Name : </strong>{eventReg.user.firstName} {eventReg.user.lastName}</span>
                                    <span><strong> User Email: </strong>{eventReg.user.email}</span>
                                    <span> <strong>status : </strong>
                                        <span className={eventReg.approved !== undefined ? isApproved(eventReg.approved) : 'Pending'}>{eventReg.approved !== undefined ? isApproved(eventReg.approved) : 'Pending'}</span>
                                    </span>
                                    <ButtonGroup>
                                        <strong> Change the Status :-</strong>
                                        <Button color='success' hidden={eventReg.approved} size='sm' onClick={() => approvedHandler(eventReg)}>Accept</Button>
                                        <Button color='danger' hidden={!eventReg.approved && eventReg.approved !== undefined} size='sm' onClick={() => rejectedHandler(eventReg)}>Reject</Button>
                                    </ButtonGroup>
                                </li>
                            ))
                        }
                    </ul>
                </>
            )
            : <div className='notFound'><strong> If you created the event. Some one do not subscribe your event.</strong></div>
    ))
}