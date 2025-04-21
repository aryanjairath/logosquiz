import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Leaderboard.css'
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
const Leaderboard  = ({setName, setShouldRestart}) => {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [user, setUser] = useState('')
    useEffect (() => {
        const setLeaderboard =  async () => {
            var response = ''
            if(user ==""){
                response = await axios.get('http://localhost:5000/api/leaderboard')
            }else{
                response = await axios.get(`http://localhost:5000/api/leaderboard/${user}`)
            }
            setData(response.data)
            
        };
        setLeaderboard();
    }, [user]);
    const onEnter = (text) => {
        setUser(text);
    }
    const handleBack =  () => {
        navigate('/')
        setName('')
        setShouldRestart(true);

    }
    return (
        <div className='leaderboard'>
            <button onClick = {handleBack}>Back to start</button>
            <h2 style ={{fontStyle:'italic'}}>If you want to see all scores for specific person, type in name below</h2>
            <SearchBar onEnter={onEnter}/>
            <h1>Leaderboard</h1>
            {data.map(item =><div className='leader-item'><div className='user'><h1>{item.username}</h1></div> <h2>Time spent: {item.time} seconds</h2> <h2>Score: {item.score}</h2> <h2> Number of Questions: {item.totalQuestions}</h2></div>)}
        </div>
    );
};
export default Leaderboard;