import React, { useState } from 'react';
import './Header.css'
import SearchBar from '../SearchBar/SearchBar';
const Header = ({onEnter, name}) => {
    return (
        <div>
            <div className="welcome">
                <h1>Welcome to the Logos Quiz!</h1>
                <h2>The objective of this game is to guess as many logos correctly as you can.</h2>
                {!name && <SearchBar onEnter = {onEnter} />}
            </div>
        </div>
    );
}
export default Header