import React, { useState } from 'react';
import { Container, Button, Label, Input, Form, FormGroup } from 'reactstrap';
import api from '../../../services/api';

export default function UserRegistration({ history }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const submitHandel = async (evt) => {
        evt.preventDefault()
        console.log('Name', firstName + ' ' + lastName);
        console.log('Email', email)
        await api.post('/user/registration', {
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        }).then(res => {
            localStorage.setItem('user', res.data.id)
            console.log(res)
            history.push('/login')

        }).catch(err => {
            if (err.response) {
                console.log('Err response', err.response)

            }
            else if (err.request) {
                console.log('Err request', err.request)
            }
            else {
                console.log(err)
            }
        })
    }
    return (
        <Container>
            <h1>Registration</h1>
            <p>Please <strong>Register</strong> for a new Account</p>
            <Form onSubmit={submitHandel}>
                <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                    <Label htmlFor='firstName' className='mr-sm-2'>First Name</Label>
                    <Input type='text' name='firstName' id='firstName' placeholder="First Name" onChange={(evt) => setFirstName(evt.target.value)} />
                </FormGroup>
                <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                    <Label htmlFor='lastName' className='mr-sm-2'>Last Name</Label>
                    <Input type='text' name='lastName' id='lastName' placeholder="Last Name" onChange={(evt) => setLastName(evt.target.value)} />
                </FormGroup>
                <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                    <Label className="mr-sm-2">Email</Label>
                    <Input type='email' name='email' id='userEmail' placeholder="Email" onChange={evt => setEmail(evt.target.value)} />
                </FormGroup>
                <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                    <Label className='mr-sm-2'>Password</Label>
                    <Input type='password' name='password' id='userPassword' placeholder="Password" onChange={evt => setPassword(evt.target.value)} />
                </FormGroup>
                <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
                    <Label className='mr-sm-2'>Confirm Password</Label>
                    <Input type='password' name='confirmPassword' id='userConfirmPassword' placeholder="Confirm Password" onChange={evt => setConfirmPassword(evt.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Button className="submit-btn">Create Account</Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={()=>history.push('/login')}>Log In</Button>
                </FormGroup>
            </Form>

        </Container>

    )
}