import React from "react";
import './Options.css'
const Options = ( {options, handleGuess} ) => {
    return (
        <div className="item">
            {options.map((option, index) => (
                <button className = 'option' key={index} onClick={() => handleGuess(option)}>
                    {option}
              </button>
            ))}
        </div>
    );
} 

export default Options;