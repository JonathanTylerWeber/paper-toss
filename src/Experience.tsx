// import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ball from "./Ball";
import TrashCan from "./TrashCan";
import WindZone from "./WindZone";
import { ContactShadows } from "@react-three/drei";
import ThrowPad from "./ThrowPad";
import Environment from "./Environment";

export default function Experience() {
  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      <Physics
      // debug
      >
        <WindZone />
        <ContactShadows frames={1} blur={4} width={0.25} />

        <Environment />
        <Ball />
        <TrashCan />
        <ThrowPad />
      </Physics>
    </>
  );
}
