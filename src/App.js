import React, {Suspense} from "react";
// import Wrapper from "./components/Wrapper";
// import Landing from "./components/Landing";
import "./App.css";

import Scene from "./components/Header"
import { Canvas } from "react-three-fiber";
import { useProgress, Html, OrbitControls } from "@react-three/drei";
import { Physics, useBox } from "use-cannon";
import { Link } from 'react-router-dom';
import { SiGithub } from 'react-icons/si';

function App() {


  function Loader() {
    const { progress } = useProgress();
    return (
      <Html center>
        <span style={{ color: '#FFFFFF' }}>{progress} % loaded</span>
      </Html>
    )
  }

  return (
    <div className="App">
    <Canvas concurrent shadowMap camera={{ position: [0, 0, 5], fov: 70 }}>
      <color attach="background" args={['#000']} />
      <Suspense fallback={<Loader />}>
        <Physics>
       <Scene />
       </Physics>
      </Suspense>
      <ambientLight intensity={2} />
     <OrbitControls maxDistance={26} minDistance={10}/>

    </Canvas>
    <div className="overlay">
    <div className="list">
    <Link className="item" to="https://www.aarondig.com">
      aarondig.com
      </Link>
      <Link className="item" to="https://www.github.com/aarondig">
    <SiGithub size={26}/>
      
      </Link>
      </div>
      
    </div>
    </div>
  )
  
  
}


export default App;
