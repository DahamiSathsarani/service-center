import { useEffect, useState } from "react";
import { get_users_by_user_role } from "../../Api/UserAPI";
import { FaTimes } from "react-icons/fa";
import SignaturePad from "../Canvas/SignaturePad";
import { getHandoverDetails } from "../../Api/VehicleHandoverAPI";
import { useParams } from "react-router-dom";

export default function VehicleHandoverTable({ finalInspection, action }) {
  const [supervisors, setSupervisors] = useState([]);
  const [selectedWheelsInspector, setSelectedWheelsInspector] = useState("");
  const [selectedFinalChecker, setSelectedFinalChecker] = useState("");
  const [selectedWheelsInspectorSign, setSelectedWheelsInspectorSign] =
    useState("");
  const [selectedFinalCheckerSign, setSelectedFinalCheckerSign] = useState("");
  const [selectedWheelsInspectorTime, setSelectedWheelsInspectorTime] =
    useState("");
  const [sfinalInspection, setFinalInspection] = useState(false);
  const [selectedFinalCheckerTime, setSelectedFinalCheckerTime] = useState("");
  const [advisorSign, setAdvisorSign] = useState(false);
  const [signatureType, setSignatureType] = useState(null);
  const [inspect, setInspect] = useState(null);
  const { record_id } = useParams();

  const get_supervisor_users = async () => {
    try {
      const response = await get_users_by_user_role(2);
      if (response.status === 200) {
        setSupervisors(response.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getVehicleHandoverDetails = async () => {
    try {
      const response = await getHandoverDetails(record_id);
      if (response.status === 200) {
        response.data.record.map((element) => {
          if (element.checking_item === "wheels_inspect") {
            setSelectedWheelsInspector(element.name);
            setSelectedWheelsInspectorSign(element.signature);
            setSelectedWheelsInspectorTime(element.time);
          } else if (element.checking_item === "final_finishing") {
            setSelectedFinalChecker(element.name);
            setSelectedFinalCheckerSign(element.signature);
            setSelectedFinalCheckerTime(element.time);
          }
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    get_supervisor_users();
    getVehicleHandoverDetails();
  }, [record_id]);
  useEffect(() => {
    if (selectedFinalCheckerSign) {
      finalInspection(true);
    }
  }, [selectedFinalCheckerSign]);
  useEffect(() => {
    setInspect({
      selectedWheelsInspector: selectedWheelsInspector,
      selectedFinalChecker: selectedFinalChecker,
    });
  }, [selectedFinalChecker, selectedWheelsInspector]);
  return (
    <div className="bg-background">
      <div className="flex flex-col">
        <table className="w-full table-fixed border-collapse border border-black font-body">
          <thead className="w-full">
            <tr className="bg-gray-200 text-mobile_body_label lg:text-body_label sm:text-tab_body_label w-full">
              <th className="border w-[30%] border-black px-3 py-2 text-center">
                Checking Item
              </th>
              <th className="border w-[30%] border-black px-3 py-2 text-center">
                Name
              </th>
              <th className="border w-[30%] border-black px-3 py-2 text-center">
                Signature
              </th>
              <th className="border w-[30%] border-black px-3 py-2 text-center">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Wheels Inspect by */}
            <tr className="text-mobile_body lg:text-body sm:text-tab_body">
              <td className="border border-black px-3 py-2 text-center">
                Wheels Inspect by
              </td>
              <td className="border border-black px-3 py-2 text-center">
                <select
                  className="h-10 px-3 border rounded"
                  value={selectedWheelsInspector}
                  disabled={selectedWheelsInspector || action === "view"}
                  onChange={(e) => setSelectedWheelsInspector(e.target.value)}
                >
                  <option value="" disabled>
                    Select Advisor
                  </option>
                  {supervisors.map((user) => (
                    <option
                      key={user.id}
                      value={`${user.first_name} ${user.last_name}`}
                    >
                      {`${user.first_name} ${user.last_name}`}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-black px-3 py-2 text-center">
                {selectedWheelsInspectorSign ? (
                  <div className="border py-2 px-4 rounded flex bg-white justify-center">
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}/${selectedWheelsInspectorSign}`}
                      alt="advisor signature"
                      className="h-[2rem] w-[4rem]"
                    />
                  </div>
                ) : (
                  <button
                    className={`mobile_cancel-btn sm:tab_cancel-btn lg:cancel-btn  ${
                      !selectedWheelsInspector
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!selectedWheelsInspector}
                    onClick={() => {
                      setAdvisorSign(true);
                      setSignatureType("wheels_inspect");
                    }}
                  >
                    Advisor Signature
                  </button>
                )}
              </td>
              <td className="border border-black px-3 py-2 text-center">
                {selectedWheelsInspectorTime}
              </td>
            </tr>

            {/* Final Finishing Checked by */}
            <tr className="text-mobile_body lg:text-body sm:text-tab_body">
              <td className="border border-black px-3 py-2 text-center">
                Final Finishing Checked by
              </td>
              <td className="border border-black px-3 py-2 text-center">
                <select
                  disabled={selectedFinalChecker || action === "view"}
                  className="h-10 px-3 border rounded"
                  value={selectedFinalChecker}
                  onChange={(e) => setSelectedFinalChecker(e.target.value)}
                >
                  <option value="" disabled>
                    Select Advisor
                  </option>
                  {supervisors.map((user) => (
                    <option
                      key={user.id}
                      value={`${user.first_name} ${user.last_name}`}
                    >
                      {`${user.first_name} ${user.last_name}`}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-black px-3 py-2 text-center">
                {selectedFinalCheckerSign ? (
                  <div className="border py-2 px-4 flex bg-white justify-center rounded">
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}/${selectedFinalCheckerSign}`}
                      alt="advisor signature"
                      className="h-[2rem] w-[4rem]"
                    />
                  </div>
                ) : (
                  <button
                    className={`mobile_cancel-btn sm:tab_cancel-btn lg:cancel-btn  ${
                      !selectedWheelsInspector
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!selectedFinalChecker}
                    onClick={() => {
                      setAdvisorSign(true);
                      setSignatureType("final_finishing");
                    }}
                  >
                    Advisor Signature
                  </button>
                )}
              </td>
              <td className="border border-black px-3 py-2 text-center">
                {selectedFinalCheckerTime}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {advisorSign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[50%] md:w-[50%] h-[50%] p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-black"
              onClick={() => setAdvisorSign(false)} // Close modal
            >
              <FaTimes />
            </button>
            <div className="w-full h-full flex justify-center items-center">
              <SignaturePad type={signatureType} data={{ inspect: inspect }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
