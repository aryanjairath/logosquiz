import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import './Leaderboard.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
const Leaderboard  = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate();

    useEffect (() => {
        const setLeaderboard =  async () => {
            const response = await axios.get('http://localhost:5000/api/leaderboard')
            setData(response.data)
            
        };
        setLeaderboard();
    }, []);

    const handleBack = () => {
        navigate('/game')
    }
    return (
        <div className='leaderboard'>
            <div classname = "header">
                <button onClick = {handleBack}>Go back to the main menu?</button>
                <h1>Leaderboard</h1>
            </div>
            {data.map(item =><div className='leader-item'><div className='user'><h1>{item.username}</h1></div> <h2>Time spent: {item.time} seconds</h2> <h2>Score: {item.score}</h2> <h2> Number of Questions: {item.totalQuestions}</h2></div>)}
        </div>
    );
};
export default Leaderboard;