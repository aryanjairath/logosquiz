import React from "react";
import Header from "../Header/Header";
import Options from "../Options/Options";

const Welcome = ({name, handleEnterPress, questions, handlequestion}) => {
    return (
        <div>
            <Header onEnter={handleEnterPress} name = {name}/> 
            {name && <h2 style = {{textAlign:'center'}}>How many problems would you like?</h2>}
            {name && <Options options={questions} handleguess = {handlequestion} />}
        </div>
    );
};

export default Welcome;