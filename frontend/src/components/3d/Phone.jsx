"use client";
import { Box } from './Primitives';
import InteractiveObject from './InteractiveObject';
import { HoverScreen } from './HoverDetails';
import Surface from './Surface';
import { PhoneContacts } from '../workspace/ObjectContent';
export default function Phone(props) {
  return <InteractiveObject {...props} id="contact" label="05 / Contact" position={[2.05, 0.17, 1.55]} rotation={[0, -0.2, 0]} labelPosition={[0, 0.6, 0]}>
    <Box size={[0.62, 0.09, 1.18]} color="#747e76" radius={0.04} metalness={0.85} />
    <Box size={[0.56, 0.009, 1.1]} position={[0, 0.046, 0]} color="#101b1b" radius={0.004} />
    <HoverScreen size={[0.51, 0.99]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.052, 0]} color="#1c302c" litColor="#799886" />
    <Surface id="contact" size={[0.51, 0.99]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.054, 0]} tone="phone"><PhoneContacts /></Surface>
  </InteractiveObject>;
}
