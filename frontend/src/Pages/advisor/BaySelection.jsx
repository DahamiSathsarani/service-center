import { useEffect } from "react";
import BayHome from "../../Components/Forms/BayManagement/BaySelection/BayHome";
import NormalBackground from "../../Components/Menu Compnents/NormalBackground";
import { useParams } from "react-router-dom";

export default function BaySelection() {
  return <NormalBackground title={"Vehicle No :"} componentName={BayHome} />;
}
