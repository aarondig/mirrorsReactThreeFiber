import React, { useRef, useState, useEffect, useMemo, Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useResource } from "react-three-fiber";
import { Physics, useBox } from "use-cannon";
import {
  Text,
  Box,
  useMatcapTexture,
  Octahedron,
  OrbitControls,
  useProgress,
  Html,
} from "@react-three/drei";
import { mirrorsData } from "./mirrorsData";
import font from "../../../src/fonts/Metropolis-ExtraBold.otf";
import { ThinFilmFresnelMap } from './ThinFilmFresnelMap.js'
import "./style.css";
import {useSpring, a, animated} from "react-spring"


function Title({ layers = undefined, titlePosi, ...props }) {
  const group = useRef();
  const [event, setEvent] = useState(false);
  const x = window.matchMedia("(max-width: 650px)");
  x.addListener(setEvent);

  useEffect(() => {
    group.current.lookAt(0, 0, 0);
  }, []);
  const textProps = {
    fontSize: 0.8,
    anchorX: "center",
    font: font,
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
        material-color="#FFFFFF"
        position={[x.matches ? 0.5 : 0, 0, titlePosi]}
        maxWidth={x.matches ? 6 : 12}
        textAlign={x.matches ? "left" : "center"}
        {...textProps}
        layers={layers}
      >
        AARON DIGGDON
      </AnimatedText>
    </group>
  );
}

function TitleCopies({ layers }) {
  const vertices = useMemo(() => {
    const y = new THREE.IcosahedronGeometry(6);
    return y.vertices;
  }, []);
  const AnimatedTitle = animated(Title);
  return (
    <group name="titleCopies">
      {vertices.map((vertex, i) => (
        <Title name={"titleCopy-" + i} position={vertex} layers={layers} />
      ))}
    </group>
  );
}

function Mirror({ sideMaterial, reflectionMaterial, args, ...props }) {
  const ref = useRef();
  useFrame(() => {
    // ref.current.rotation.y += (props.position[2] / 10000);
    ref.current.rotation.y += 0.001;
    ref.current.rotation.z += 0.01;
  });

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
        // map={thinFilmFresnelMap}
        // color={0xaaaaa}
        // color={"#C0C0C0"}
      />
      <meshLambertMaterial
        ref={reflectionMaterial}
        // map={thinFilmFresnelMap}
        // color={0xd5555}
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

function Scene({ titlePosi }) {
  const group = useRef();
  const [cubeCamera, renderTarget] = useRenderTarget();
  const [ref, api] = useBox(() => ({ args: 0.01, mass: 50 }));

  useFrame((state) => {
    if (Math.sign(state.mouse.y) == -1) {
      ref.current.rotation.set(
        (Math.abs(state.mouse.y) * state.viewport.height) / 100,
        (state.mouse.x * state.viewport.width) / 100,
        0
      );
    }
    if (Math.sign(state.mouse.y) == 1) {
      ref.current.rotation.set(
        (-Math.abs(state.mouse.y) * state.viewport.height) / 100,
        (state.mouse.x * state.viewport.width) / 100,
        0
      );
    }
    if (Math.sign(state.mouse.y) == 0) {
      ref.current.rotation.set(
        (state.mouse.y * state.viewport.height) / 100,
        (state.mouse.x * state.viewport.width) / 100,
        0
      );
    }
  });
  const AnimatedTitle = animated(Title);
  return (
    <group ref={ref}>
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
      <AnimatedTitle native name="title" titlePosi={titlePosi} />
      <TitleCopies layers={[11]} />
      <Mirrors layers={[0, 11]} envMap={renderTarget.texture} />
    </group>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <span style={{ color: "#FFFFFF" }}>{progress}% loaded</span>
    </Html>
  );
}

function Header({ blur, blurValue, titlePosi }) {
  const style = {
    filter: "blur(" + blurValue + ")",
  };
  
  return (
    <div id="header" style={style}>
      <Canvas concurrent shadowMap camera={{ position: [0, 0, 3], fov: 70 }}>
        {/* <color attach="background" args={["#fff"]} /> */}
        <ambientLight intensity={0.2} />
        <Suspense fallback={<Loader />}>
          <pointLight position={[0, 10, 20]} intensity={2}  />
          {/* <OrbitControls /> */}
          <Physics>
            <Scene titlePosi={titlePosi} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Header;
