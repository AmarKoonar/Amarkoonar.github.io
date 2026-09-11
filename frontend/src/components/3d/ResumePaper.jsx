"use client";
import { Box, Label } from './Primitives';
import InteractiveObject from './InteractiveObject';
import Surface from './Surface';
import { HoverMotion } from './HoverDetails';
import { PaperResume } from '../workspace/ObjectContent';

export default function ResumePaper(props) {
  return <InteractiveObject {...props} id="resume" label="04 / Resume" position={[2.8, 0.15, -0.5]} rotation={[0, -0.16, 0]} labelPosition={[0, 0.7, 0]}>
    <HoverMotion position={[0,0,-.825]} turn={[-.035,0,0]}><group position={[0,0,.825]}>
    <Box size={[1.275, 0.012, 1.65]} color="#f6f3e9" radius={0.003} />
    <Label text="AMAR KOONAR" subtitle="Resume" size={[1.24, 0.64]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, -0.3]} background="#f6f3e9" color="#364139" />
    <Surface id="resume" size={[1.275, 1.65]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} tone="resume"><PaperResume /></Surface>
    </group></HoverMotion>
  </InteractiveObject>;
}
