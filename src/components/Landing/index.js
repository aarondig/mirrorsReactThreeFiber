import React, {useState} from "react";
import About from "../About";
import Header from "../Header"
import ProgressBar from "../ProgressBar"
import "./style.css";
import { motion, useViewportScroll } from "framer-motion"
import {useSpring, a, animated} from "react-spring"

function Landing() {
  // const { scrollYProgress } = useViewportScroll()
  // const [progress, setProgress] = useState(0);
  // scrollYProgress.onChange(e => setProgress(e));
  // const progress = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });
  // const blurValue = (progress * 10) + "px";

  // const blurValue = 0;

  // const num = progress * -6;
  // const titlePosi = -6 + (Math.pow(num, 3));
  // const [scroll, setScroll] = useState(false);
 
  


  // window.addEventListener('wheel', (e)=>{
    
  // })
  // useLayoutEffect(()=> {
  //   setScroll(progress);
  // })

  // const props = useSpring({ number: titlePosi, from: { number: 0 } })
  
{/* <animated.span>{props.number}</animated.span> */}
    return <div id="landing">
      
      <Header />
      {/* <Header blurValue={blurValue} titlePosi={props.number} /> */}
      
      {/* {progress > .2 ? <About progress={progress}/> : <div id="prompt"></div> } */}
      {/* <ProgressBar progress={progress}/> */}
    </div>;
  }
  
  export default Landing;
  