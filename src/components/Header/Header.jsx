import React, { useState } from 'react';
import './Header.css'
const Header = ({onEnter}) => {
    const [inputValue, setInputValue] = useState("");

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            onEnter(inputValue)
        }
  };

    return (
        <div>
            <div className="welcome">
                <h1>Welcome to the Logos Quiz!</h1>
                <h2>The objective of this game is to guess as many logos correctly as you can.</h2>
                <input type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} 
                    placeholder="Type something and press Enter..." 
                    style = {{scale: '1.5'}}/>
            </div>
        </div>
    );
}
export default Header