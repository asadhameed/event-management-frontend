import React, { useContext, useEffect, useState } from 'react';
import api from '../../services/api';
import moment from 'moment';
import Axios from 'axios';

import { UserContext } from '../../user-context';
import '../eventRegister/eventRegister.css';


export default function EventRegisterStatus({ history }) {
  const [eventsSubscribed, setEventSubscribed] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const { isLogin } = useContext(UserContext)
  const [config] = useState({ headers: { 'x-auth-token': token } });
  useEffect(() => {
    if (!isLogin) history.push('/');
    const source = Axios.CancelToken.source();
    config.cancelToken = source.token;
    const getSubscribedEvents = async () => {
      await api.get('/eventsSubscribed', config)
        .then(res => {
          setEventSubscribed(res.data)
        })
        .catch(err => console.log(err))
    }
    getSubscribedEvents();
    return () => {
      source.cancel();
    }
  }, [isLogin, history, config])

  const isApproved = (status) => status ? 'Approved' : 'Rejected'

  return (
    (eventsSubscribed.length) ? (
      <>
        <div className='pageHeadline'> <strong>your subscription</strong></div>
        <ul className='eventsRegister'>
          {
            eventsSubscribed.map(eventSub => (
              <li key={eventSub._id}>
                <div><strong id='eventTitle'>{eventSub.event.title}</strong></div>
                <span><strong>Event Date :</strong>{moment(eventSub.event.date).format('DD-MM-YYYY')}</span>
                <span><strong>Price: </strong>{parseFloat(eventSub.event.price).toFixed(2)}$</span>
                <span><strong>Status :</strong>
                  <span className={eventSub.approved === undefined ? 'Pending' : isApproved(eventSub.approved)}>{eventSub.approved === undefined ? 'Pending' : isApproved(eventSub.approved)}</span>
                </span>
              </li>
            ))
          }
        </ul>
      </>
    )
      : (<div className='notFound'> <strong>you do not subscribe a event</strong></div>)

  )
}
