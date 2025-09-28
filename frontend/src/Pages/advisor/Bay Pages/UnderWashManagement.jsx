import { useCallback, useEffect, useState } from "react";
import BayNumberLandingPage from "../../../Components/Forms/BayManagement/BayNumberSelection/BayNumberLandingPage";
import NormalBackground from "../../../Components/Menu Compnents/NormalBackground";
import {
  createBayRecord,
  getAllBayDetails,
  getAllBayTypeDetails,
  updateBayRecord,
} from "../../../Api/BayManagementAPI";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
export default function UnderWashManagement() {
  const navigate = useNavigate();
  const [allDetails, setAllDetails] = useState(null);
  const [serviceTimeRecord, setServiceTimeRecord] = useState(null);
  const { record_id } = useParams();
  const clickedInBtn = async (data) => {
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
    const setData = {
      bay_id: data,
      in_time: formattedTime,
      service_no: record_id,
    };
    console.log("hi", setData);
    try {
      const response = await createBayRecord(setData, "under_wash");
      if (response.status === 200) {
        toast.success("Record Add Successfully");
        navigate(0);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };
  const clickedOutBtn = async () => {
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
    const setData = {
      out_time: formattedTime,
      service_no: record_id,
    };
    console.log("hi", setData);
    try {
      const response = await updateBayRecord(setData, "under_wash");
      if (response.status === 200) {
        toast.success("Record Add Successfully");
        navigate(0);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const getRecordTimeDetails = useCallback(async () => {
    try {
      const response = await getAllBayTypeDetails("under_wash", {
        record_id: record_id,
      });
      if (response.status === 200) {
        console.log("res", response);
        setServiceTimeRecord(response.data.record);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }, [record_id]);
  const getBayDetails = useCallback(async () => {
    try {
      const response = await getAllBayDetails("under_wash");
      if (response.status === 200) {
        setAllDetails(response.data.all_bays);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    getBayDetails();
    getRecordTimeDetails();
  }, [getBayDetails, getRecordTimeDetails]);
  return (
    <NormalBackground
      title={"Vehicle No :"}
      componentName={BayNumberLandingPage}
      data={{ allDetails, serviceTimeRecord }}
      onClickInBtn={clickedInBtn}
      onClickOutBtn={clickedOutBtn}
    />
  );
}
