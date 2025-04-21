import React from "react";
import './Options.css'
const Options = ( {options, handleguess} ) => {
    return (
        <div className="item">
            {options.map((option, index) => (
                <button className = 'option' key={index} onClick={() => handleguess(option)}>
                    {option}
              </button>
            ))}
        </div>
    );
} 

export default Options;