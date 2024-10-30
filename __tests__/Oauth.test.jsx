import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useGoogleLogin } from '@react-oauth/google';
import Login from '../client/components/Login.jsx';
import '@testing-library/jest-dom';
// import { jest, expect, it, describe, afterAll, beforeEach } from '@jest/globals'
import { request } from 'supertest'
import db from '../server/models/hoameModels.js'
import app from '../server/server.js'

const mockGoogle = jest.mock('@react-oauth/google', () => ({
    useGoogleLogin: jest.fn().mockReturnValue('test-google-id-123')
}))

describe('test the whole oauth workflow', () => {
    let testGoogleId = 'test-google-id-123'
    let mockLogin;

    // beforeEach(() => {
    //     mockLogin = useGoogleLogin.mockImplementation(() => ({
    //         onSuccess: jest.fn(),
    //         onError: jest.fn(),
    //     }))
        // jest.mock('@react-oauth/google', () => ({
        //     useGoogleLogin: jest.fn().mockReturnValue('test-google-id-123')
        // }))
    })

   afterAll(async () => {
    await db.query('DELETE FROM users WHERE google_id = $1', [testGoogleId])
    if (db && db.end) {
        await db.end();
    }
   })

   it('should call useGoogleLogin on google login button ', async() => {
    render(<Login onLogin={jest.fn()}/>)

    const googleLoginButton = screen.getByText('Login with Google')
    fireEvent.click(googleLoginButton)

    expect(mockLogin).toHaveBeenCalled();

    const response = await request(app)
    .post('/api/login')
    .send({
        username:'testuser@example.com',
        google_id: testGoogleId,
        oauth_provider: 'google'
    })

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('google_id', testGoogleId)

    // const response = await request(app)
    // .post('/login')
    // .send({ google_id: testGoogleId })

    // expect(response.statusCode).toBe(200)
    // expect(response.body).toHaveProperty('google_id')
    // expect(response.body.google_id).toBe(testGoogleId)
   })
})

// describe('GET /login', () => {
//     afterAll(async () =>{
//         await db.reset()
//     })
//     it('should redirect to Google OAuth', async () => {
//         const response = await request(app).get('/login')
//         expect(response.status).toBe(302)
//         expect(response.headers.location).toMatch(/accounts\.google\.com/)
//     })
// })

