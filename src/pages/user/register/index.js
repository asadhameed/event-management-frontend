import React from 'react';
import { Button, Label, Input, Form, FormGroup } from 'reactstrap';

export default function UserRegistration() {
    return (
        

        <Form>
            <FormGroup>
                <Label>First Name</Label>
                <Input type='text' name='firstName' id='firstName' placeholder="First Name" />
            </FormGroup>
            <FormGroup>
                <Label>Second Name</Label>
                <Input type='text' name='lastName' id='lastName' placeholder="Last Name" />
            </FormGroup>
            <FormGroup>
                <Label>Email</Label>
                <Input type='email' name='email' id='userEmail' placeholder="Email" />
            </FormGroup>
            <FormGroup>
                <Label>Password</Label>
                <Input type='password' name='password' id='userPassword' placeholder="Password" />
            </FormGroup>
            <FormGroup>
                <Label>Confirm Password</Label>
                <Input type='confirmPassword' name='confirmPassword' id='userConfirmPassword' placeholder="Confirm Password" />
            </FormGroup>
            <Button>Log in</Button>
        </Form>
    )
}