import React, {useState} from "react";
import "./style.css";
import { motion, useViewportScroll } from "framer-motion"


function About({progress}) {
  
  const style = {
    pointerEvents: progress > .5 ? "auto" : "none",
    opacity: progress
  };

    return <div id="About" style={style}>
      <div id="background">FADE COMPLETE</div>
      <div className="container">
        <div className="grid">
          
        </div>
      </div>
    </div>;
  }
  
  export default About;
  