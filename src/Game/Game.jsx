import React from "react";
import Header from "../components/Header/Header";
import Image from "../components/Image/Image";
import Options from "../components/Options/Options";
import './Game.css'

const Game = ({name, time, handleEnterPress, handleguess, onRestart,  onLeaderboard, gameOver, logo, options, score}) => {
    return (
        <div>
            <Header onEnter={handleEnterPress} name = {name}/> 
            <Image image={logo} /> 
            <Options options={options} handleguess={handleguess}/> 
            <h1>Your current score is {score}</h1>
                {gameOver && (
                <div className="ending">
                    <h1>The game is over. Good work</h1>
                    <button onClick={onRestart}>Restart?</button>
                    <button onClick={onLeaderboard}>Check out the leaderboard</button>
                </div>
                )}
            <h2 style = {{textAlign: 'center'}}>Time elapsed: {time}s</h2>
        </div>   
    );
};

export default Game;