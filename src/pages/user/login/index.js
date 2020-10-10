import React, { useContext, useState } from 'react'
import { Container, Button, Input, Label, Form, FormGroup, UncontrolledAlert } from 'reactstrap';
import Api from '../../../services/api';
import {UserContext} from '../../../user-context';
export default function Login({ history }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const { SetLogin} = useContext(UserContext)
    const handelSubmit = async evt => {
        evt.preventDefault();
        setMessage('')
       
        await Api.post('/user/login', {
            email,
            password
        }).then(res => {
            localStorage.setItem("user", res.data.user)
            localStorage.setItem('token', res.headers['x-auth-token'])
            SetLogin(true)
            history.push('/')
        }).catch(err => {
            if (err.response) {
                if (err.response.status === 401) {
                    setMessage(err.response.data)
                }
                else if (err.response.status === 400) {
                    let allErrors = '';
                    const { errors } = err.response.data;
                    errors.forEach(value => {
                        allErrors += value.msg;
                    });
                    setMessage(allErrors)
                }
            } else if (err.request) {
                console.log('err.request--------------->', err.request)
            } else {
                console.log('err', err)
            }
        });
    }
    return (
        <Container>
            <h1>Login:</h1>
            <p>Please <strong>Login</strong> into your Account </p>
            <Form onSubmit={handelSubmit}>
                {(message !== '') ? <UncontrolledAlert color='danger'> {message} </UncontrolledAlert> : ''}
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label htmlFor="userEmail" className="mr-sm-2" >Email</Label >
                    <Input type="email" name="email" id="userEmail" placeholder="test@test.com" onChange={evt => setEmail(evt.target.value)} />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label htmlFor="userPassword" className="mr-sm-2">Password</Label>
                    <Input name="password" type="password" id="userPassword" placeholder="Password" onChange={evt => setPassword(evt.target.value)}></Input>
                </FormGroup>
                <FormGroup>
                </FormGroup>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Button className='submit-btn'>Log in</Button>
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Button className="secondary-btn" onClick={() => history.push('/register')}>create Account</Button>
                </FormGroup>
            </Form>
        </Container>
    )
}