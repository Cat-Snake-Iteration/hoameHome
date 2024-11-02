import React, { useState, useEffect } from 'react';

const PollForm = ({question}) => {
    const [newTitle, setNewTitle] = useState('');
    const newPoll = async (e)=>{
        e.preventDefault();
        if (!newTitle || !newMessage) {
            setError('Title & Message are required!'); // check for validation of both fields
            return;
          }
      
    }
    try{
        const response = await fetch(`http://localhost:3000/api/questions`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                title: newTitle,
              }),
        })
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if(response.ok){
            setNewTitle('');
            setError('');
        }else{
            console.log('Failed to post new poll');
            setError('Failed to post new poll, try again');
        }
        setError('')
    }catch(error){
        console.log('error adding :', error);
        setError('Failed to add announcement, try again.');
    }
    return(
        <div>
            <form onSubmit = {newPoll}>
            <input
            type='text'
            placeholder='Title'
            value={newTitle}
            className='titleInput'
            onChange={(e) => setNewTitle(e.target.value)}
          />
            </form>
            <button type='submit' className='submitButton'>
            Submit
          </button>
            
        </div>
    )
};
export default PollForm;