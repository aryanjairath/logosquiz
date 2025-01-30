import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import './Leaderboard.css'
import axios from 'axios';
const Leaderboard  = () => {
    const [data, setData] = useState([])
    useEffect (() => {
        const setLeaderboard =  async () => {
            const response = await axios.get('http://localhost:5000/api/leaderboard')
            setData(response.data)
            
        };
        setLeaderboard();
    }, []);
    return (
        <div className='leaderboard'>
            <h1>Leaderboard</h1>
            {data.map(item =><div className='leader-item'><div className='user'><h1>{item.username}</h1></div> <h2>Time spent: {item.time} seconds</h2> <h2>Score: {item.score}</h2> <h2> Number of Questions: {item.totalQuestions}</h2></div>)}
        </div>
    );
};
export default Leaderboard;