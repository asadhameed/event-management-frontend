import React, { useState } from 'react'
import { Button, Input, Label, Form, FormGroup } from 'reactstrap';
import Api from '../../../services/api';
export default function Login({history}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const handelSubmit = async evt => {
        evt.preventDefault();
        console.log('email and password', email, password)
        await Api.post('/user/login', {
            email,
            password
        }).then(res => {
            localStorage.setItem("user", res.data.user)
            console.log("DATA STORED", res.data.user);
            history.push('/dashboard')
        }).catch(err => {
            if (err.response) {
                console.log('err.response--------------->', err.response)
                // client received an error response (5xx, 4xx)
            } else if (err.request) {
                console.log('err.request--------------->', err.request)
                // client never received a response, or request never left
            } else {
                console.log('err', err)
            }
        });

    }
    return (
        <Form inline onSubmit={handelSubmit}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label htmlFor="userEmail" className="mr-sm-2" >Email</Label >
                <Input type="email" name="email" id="userEmail" placeholder="test@test.com" onChange={evt => setEmail(evt.target.value)} />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label htmlFor="userPassword" className="mr-sm-2">Password</Label>
                <Input name="password" type="password" id="userPassword" placeholder="Password" onChange={evt => setPassword(evt.target.value)}></Input>
            </FormGroup>


            <Button>Log in</Button>
        </Form>

    )
}