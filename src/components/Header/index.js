import React, { useRef, useState, useEffect, useMemo, Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import { useFrame, useResource, useThree } from "react-three-fiber";

import {
  Text,
  Box,
  Octahedron,
} from "@react-three/drei";
import { mirrorsData } from "./mirrorsData";
import font from "../../../src/fonts/Metropolis-ExtraBold.otf";
import { ThinFilmFresnelMap } from './ThinFilmFresnelMap.js'
import "./style.css";
// import {useSpring, a, animated} from "react-spring"

import { useSpring, animated } from "react-spring"


function Title({ layers = undefined, titlePosi, ...props }) {
  const group = useRef();
  const [event, setEvent] = useState(false);
  const x = window.matchMedia("(max-width: 650px)");
  x.addListener(setEvent);

  useEffect(() => {
    group.current.lookAt(0, 0, 0);
  }, []);
  const textProps = {
    fontSize: 2.8,
    anchorX: "center",
    font: font,
    fontWeight: 100,
    // font: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200&display=swap",
    // font: "https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff",
    // "https://fonts.gstatic.com/s/syncopate/v12/pe0pMIuPIYBCpEV5eFdKvtKqBP5p.woff",
    // font: "https://fonts.gstatic.com/s/kanit/v7/nKKU-Go6G5tXcr4WPBWnVac.woff",
  };

const AnimatedText = animated(Text)
  return (
    <group {...props} ref={group}>
      <AnimatedText
        native
        name="title-text"
        depthTest={false}
        material-toneMapped={false}
        material-color="#f4f4f4"
        position={[x.matches ? 0.5 : 0, 0, -6]}
        // maxWidth={x.matches ? 6 : 12}
        // textAlign={x.matches ? "left" : "center"}
        {...textProps}
        layers={layers}
      >
       mirrors.
      </AnimatedText>
    </group>
  );
}

function TitleCopies({ layers }) {
  const vertices = useMemo(() => {
    const y = new THREE.IcosahedronGeometry(6);
    return y.vertices;
  }, []);
  return (
    <group name="titleCopies">
      {vertices.map((vertex, i) => (
        <Title name={"titleCopy-" + i} position={vertex} layers={layers} key={i} />
      ))}
    </group>
  );
}

function Mirror({ sideMaterial, reflectionMaterial, args, ...props }) {
  const ref = useRef();
 useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001
      ref.current.rotation.z += 0.01
    }
  })

  return (
    <Box
      {...props}
      ref={ref}
      args={args}
      material={[
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        reflectionMaterial,
        reflectionMaterial,
      ]}
    />
  );
}

function Mirrors({ envMap }) {
  const sideMaterial = useResource();
  const reflectionMaterial = useResource();
  const [thinFilmFresnelMap] = useState(new ThinFilmFresnelMap())
  return (
    <>
      <meshLambertMaterial
        ref={sideMaterial}
        map={thinFilmFresnelMap}
        color={0xaaaaa}
        // color={"#C0C0C0"}
      />
      <meshLambertMaterial
        ref={reflectionMaterial}
        map={thinFilmFresnelMap}
        color={0xd5550}
        // color={"#808080"}
        envMap={envMap}
      />
      {mirrorsData.mirrors.map((mirror, index) => (
        <Mirror
          key={`mirror-${index}`}
          {...mirror}
          sideMaterial={sideMaterial.current}
          reflectionMaterial={reflectionMaterial.current}
        />
      ))}
    </>
  );
}

function useRenderTarget() {
  const cubeCamera = useRef();
  const [renderTarget] = useState(
    new THREE.WebGLCubeRenderTarget(1024, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
    })
  );

  useFrame(({ gl, scene }) => {
    cubeCamera.current.update(gl, scene);
  });
  return [cubeCamera, renderTarget];
}

function Scene() {
  const group = useRef();
  const [cubeCamera, renderTarget] = useRenderTarget();
  // const [ref, api] = useBox(() => ({ args: 0.01, mass: 50 }));
  const rotationEuler = new THREE.Euler(0, 0, 0);
  const rotationQuaternion = new THREE.Quaternion(0, 0, 0, 0);
  const { viewport } = useThree();

  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 100;
    const y = (mouse.y * viewport.height) / 100;

    rotationEuler.set(y, x, 0);
    rotationQuaternion.setFromEuler(rotationEuler);

    group.current.quaternion.slerp(rotationQuaternion, 0.1);
    group.current.position.z = 6;
  });
  const AnimatedTitle = animated(Title);

  return (
    <group ref={group}>
      <Octahedron
        layers={[1]}
        name="background"
        args={[20, 4, 4]}
        position={[0, 0, -5]}
      >
        <meshMatcapMaterial
          side={THREE.BackSide}
          transparent
          opacity={0.3}
          color="#FFF"
        />
      </Octahedron>
      <cubeCamera
        layers={[11]}
        name="cubeCamera"
        ref={cubeCamera}
        args={[0.1, 100, renderTarget]}
        position={[0, 0, 5]}
      />
      <AnimatedTitle native name="title" />
  
      <TitleCopies layers={[11]} />
      <Mirrors layers={[0, 11]} envMap={renderTarget.texture} />
    </group>
  );
}

// function Header({ blur, blurValue, titlePosi }) {
//   // const Headerstyle = {
//   //   filter: "blur(" + blurValue + ")",
//   // };
//   // style={Headerstyle}
//   return (
//     <div id="header" >
//       <Canvas concurrent shadowMap camera={{ position: [0, 0, 3], fov: 70 }}>
//         {/* <color attach="background" args={["#fff"]} /> */}
//         <ambientLight intensity={0.2} />
        
//           <pointLight position={[0, 10, 20]} intensity={2}  />
//           {/* <OrbitControls /> */}
//           <Physics>
//             <Scene />
//             {/* <Scene titlePosi={titlePosi} /> */}
//           </Physics>

//       </Canvas>
//     </div>
//   );
// }

export default Scene;
