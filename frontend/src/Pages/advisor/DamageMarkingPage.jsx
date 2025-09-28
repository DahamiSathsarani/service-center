import React from "react";
import { useParams } from "react-router-dom";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import CanvasComponent from "../../Components/Canvas/CanvasComponent";

export default function DamageMarkingPage() {
    const { service_no } = useParams();

  return (
    <div>
        <NormalBackground
            title="Mark Damages"
            componentName={CanvasComponent}
            service_no={service_no}
        />
    </div>
  );
}
