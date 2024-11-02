import React, { useState, useEffect } from 'react';
import PollBox from './PollBox';



const Polls = () => {
    const [questions, setQuestions] = useState('')
    // console.log("within polls")

    const getQuestions = async () => {

        try { 
            const response = await fetch(`http://localhost:3000/api/polls`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const data = await response.json();
            console.log("DATA HAS BEEN RETURNED", data)
            setQuestions(data[0].title_question)
        } catch (err) {
            console.log(err)
        }
    }
        useEffect(() => {
            getQuestions();
        }, []);

        return (
            <div>
        <PollBox question={questions}/>
            </div>
        )
    }


   


export default Polls;