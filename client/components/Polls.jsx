import React, { useState, useEffect } from 'react';
import { poll } from 'poll'

const Polls = () => {
    function fn() {
        console.log('Hello, beautiful!')
    }
// poll(fn, 1000)

    return (
        <button onClick={() => poll(fn, 5000)}> Hello!</button>
    )
}

export default Polls;