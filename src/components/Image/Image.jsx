import React from "react";
import './Image.css'
const Image = ({image}) => {
      return (
        <div className="image-container">     
          <img src={image.image} alt={image.name}  />
        </div>
      );
    
}

export default Image;