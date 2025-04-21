import React from "react";
import { useState } from "react";
const SearchBar = ({onEnter}) => {
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
            <input type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown} 
                placeholder="Enter your name" />
        </div>
    );
};

export default SearchBar;