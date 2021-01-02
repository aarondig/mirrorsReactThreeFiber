import { useEffect, useState } from "react";
import {
  motion,
  useViewportScroll,
  useSpring,
  useTransform
} from "framer-motion";
import "./style.css";

function Progress({progress}) {
  const { scrollYProgress } = useViewportScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
    return <div id="progressBarContainer">
        {/* <div id="progressBar" style={{transform: `scale(${progress}, 1)`, opacity: `${progress}`}}/> */}
        <svg className="progress" viewBox="0 0 400 500">
        <motion.path
          fill="none"
          strokeWidth="5"
          stroke="white"
          d="M0,0 V323"
          style={{
            pathLength,
            // rotate: 90,
            translateX: 0,
            translateY: 0,
          }}
        />
        </svg>
      </div>
    ;
  }
  
  export default Progress;
  