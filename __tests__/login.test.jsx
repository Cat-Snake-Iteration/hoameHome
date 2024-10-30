import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import Login from '../client/components/Login.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

//Mock function
const login = jest.fn()

test('when button is clicked the function is involked', () => {
    render(
    <GoogleOAuthProvider clientId='70669525785-chgik7e7rdngn09p3b1mc1373bb80p9q.apps.googleusercontent.com'>
        <MemoryRouter>
            <Login onClick={login}/>
        </MemoryRouter>
    </GoogleOAuthProvider>
)

    const button = screen.getByRole('button', { name: 'Login with Google'})
    console.log("BUTTON", button)

    fireEvent.click(button);

    expect(login).toHaveBeenCalled();
})