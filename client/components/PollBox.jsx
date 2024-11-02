import React, { useState, useEffect } from 'react';

const PollBox = ({ question }) => {
    const submitYes = () => {
        console.log("submitYes clicked")
    }

    const submitNo = () => {
        console.log("submitNo clicked")
    }

    return (
        <div>
            <div>
                {question}
                <button onClick={submitYes}>Yes</button>
                <button onClick={submitNo}>No</button>
            </div>
        </div>
    )
}

export default PollBox