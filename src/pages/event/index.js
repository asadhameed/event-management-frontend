import React, { useState, useMemo } from 'react';

import { Container, Form, FormGroup, Input, Label, Button, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, UncontrolledAlert } from 'reactstrap';
import api from '../../services/api';
import pictureIcon from '../../images/picture.png'
import './event.css';
export default function CreateEvent({ history }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [eventType, setEventType] = useState('');
    const [date, setDate] = useState('')
    const [errorMessage, setErrorMessage] = useState(false)
    const [createEvent, setCreateEvent] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const id = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    const toggle = () => setDropdownOpen(prevState => !prevState)
    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail])
    const submitHandel = async (evt) => {
        setErrorMessage(false);
        setCreateEvent('');
        evt.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('thumbnail', thumbnail);
        formData.append('eventType', eventType);
        formData.append('date', date);

        await api.post('/event', formData, {
            headers: {
                'x-auth-token': token
            }
        }).then(res => {
            setCreateEvent('The event Create successful. Go to Dash Board')
            setTitle('');
            setDescription('');
            setPrice('');
            setThumbnail(null)
            setDate('')
            setEventType('')
            history.push('/')

        }).catch(err => {
            setErrorMessage(true)
            if (err.response) {
                console.log(err.response)
            }
            else {
                console.log(err)
            }
        })

    }

    return (

        <Container>
            <h1>Create your Event</h1>
            <Form onSubmit={submitHandel}>
                <FormGroup>
                    {(createEvent !== '' ? <UncontrolledAlert color='success'>{createEvent}</UncontrolledAlert> : '')}
                    {errorMessage ? <UncontrolledAlert className="event-validation" color="danger"> Missing required information</UncontrolledAlert> : ""}
                </FormGroup>
                <FormGroup >
                    <Label>Tile</Label>
                    <Input type='text' value={title} name='title' id='eventTitle' placeholder='Event title' onChange={evt => { setTitle(evt.target.value) }} />
                </FormGroup>
                {/* <FormGroup>
                    <Label>Event Type</Label>
                    <Input type='text' value={eventType} name='eventType' id='eventType' placeholder='Event Type' onChange={evt => { setEventType(evt.target.value) }} />
                </FormGroup> */}
                <FormGroup>
                    <Label>Event Date</Label>
                    <Input type='date' value={date} name='date' id='eventDate' placeholder='Event date' onChange={evt => { setDate(evt.target.value) }} />
                </FormGroup>
                <FormGroup>
                    <Label>Description</Label>
                    <Input type='textarea' value={description} name='description' id='eventDescription' placeholder='Event description' onChange={evt => { setDescription(evt.target.value) }} />
                </FormGroup>
                <FormGroup>
                    <Label>Price</Label>
                    <Input type='number' value={price} name='price' id='eventPrice' placeholder='Event price' onChange={evt => { setPrice(evt.target.value) }} />
                </FormGroup>
                <FormGroup>
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle caret>
                            Event Type
                            </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => setEventType('running')}>Running</DropdownItem>
                            <DropdownItem onClick={() => setEventType('walking')}>Walking</DropdownItem>
                            <DropdownItem onClick={() => setEventType('swimming')}>swimming</DropdownItem>
                            <DropdownItem onClick={() => setEventType('cycling')}>Cycling</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </FormGroup>
                <FormGroup>
                    <Label>Event Image</Label>
                    <Label id='thumbnail' style={{ backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''} >
                        <Input type='file' name='thumbnail' id='eventThumbnail' onChange={evt => { setThumbnail(evt.target.files[0]) }} />
                        <img src={pictureIcon} style={{ maxWidth: "50px" }} alt="upload icon " />
                    </Label>
                </FormGroup>

                <FormGroup>
                    <Button className="submit-btn">Create Event</Button>
                </FormGroup>
                <FormGroup>
                    <Button className='secondary-btn' onClick={() => history.push('/')}>Cancel</Button>
                </FormGroup>
            </Form>

        </Container>
    )
}