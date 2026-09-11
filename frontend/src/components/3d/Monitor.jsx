"use client";
import { Box, Cylinder } from './Primitives';
import InteractiveObject from './InteractiveObject';
import { HoverScreen } from './HoverDetails';
import Surface from './Surface';
import { ScreenProjects } from '../workspace/ObjectContent';
import { useContext } from 'react';
import { SurfaceContext } from './SurfaceContext';
export default function Monitor(props) {
  const { mobile } = useContext(SurfaceContext);
  const frameSize = mobile ? [1.6, 2.75, 0.12] : [2.75, 1.6, 0.12];
  const screenSize = mobile ? [1.38, 2.55] : [2.55, 1.38];
  const centerY = mobile ? 1.75 : 1.4;
  const webcamY = mobile ? 3.18 : 2.25;
  return <InteractiveObject {...props} id="projects" label="01 / Projects" position={[0, 0.2, -0.95]} labelPosition={[0, webcamY + 0.2, 0]}>
    <Box size={[0.8, 0.07, 0.5]} color="#323d3b" metalness={0.65} />
    <Cylinder args={[0.08, 0.11, 0.8, 16]} position={[0, 0.4, -0.07]} color="#444b46" />
    <Box size={frameSize} position={[0, centerY, 0]} color="#242b2b" metalness={0.5} />
    <HoverScreen size={screenSize} position={[0, centerY, 0.066]} color="#182927" />
    <Surface id="projects" size={screenSize} position={[0, centerY, 0.071]} tone="screen"><ScreenProjects /></Surface>
    <Box size={[0.43, 0.11, 0.13]} position={[0, webcamY, 0]} color="#262a27" />
    <mesh position={[0, webcamY, 0.07]}><sphereGeometry args={[0.033, 12, 12]} /><meshStandardMaterial color="#172025" metalness={0.8} roughness={0.1} /></mesh>
  </InteractiveObject>;
}
