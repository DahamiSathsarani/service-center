import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { images } from "../../assets/Images/images.js";
import { damage_image_upload } from "../../Api/ServiceRecordAPI.js";

export default function CanvasComponent() {
  const navigate = useNavigate();
  const { service_no } = useParams();

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [canvasSize, setCanvasSize] = useState({ width: 1300, height: 800 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (window.innerWidth < 447) {
        setCanvasSize({ width: 200, height: 200 });
      } else if (window.innerWidth < 495) {
        setCanvasSize({ width: 300, height: 200 });
      } else if (window.innerWidth < 600) {
        setCanvasSize({ width: 350, height: 250 });
      } else if (window.innerWidth < 700) {
        setCanvasSize({ width: 450, height: 280 });
      } else if (window.innerWidth < 870) {
        setCanvasSize({ width: 500, height: 300 });
      } else if (window.innerWidth < 923) {
        setCanvasSize({ width: 600, height: 320 });
      } else if (window.innerWidth < 1023) {
        setCanvasSize({ width: 650, height: 350 });
      } else if (window.innerWidth < 1100) {
        setCanvasSize({ width: 600, height: 320 });
      } else if (window.innerWidth < 1200) {
        setCanvasSize({ width: 650, height: 350 });
      } else if (window.innerWidth < 1300) {
        setCanvasSize({ width: 750, height: 370 });
      } else if (window.innerWidth < 1400) {
        setCanvasSize({ width: 750, height: 370 });
      } else if (window.innerWidth < 1500) {
        setCanvasSize({ width: 750, height: 370 });
      } else {
        setCanvasSize({ width: 750, height: 370 });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const img = new Image();
    img.src = images.VehicleSketch;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      saveCanvasState();
    };
  }, []);

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    setHistory((prev) => [...prev, canvas.toDataURL()]);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      history.pop();
      const img = new Image();
      img.src = history[history.length - 1];
      img.onload = () => {
        ctxRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        ctxRef.current.drawImage(
          img,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      };
    }
  };

  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.strokeStyle = "red";
    ctxRef.current.lineWidth = 3;
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      ctxRef.current.closePath();
      setIsDrawing(false);
      saveCanvasState();
    }
  };

  const handleSave = async () => {
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL("image/png");

      const blob = dataURItoBlob(imageData);
      const file = new File([blob], "damage_image.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("damage_image", file);
      formData.append("service_no", service_no);

      const response = await damage_image_upload(formData);
      console.log("damage response", response);

      if (response.status === 201) {
        toast.success(response.data.message || "Damages Marked successfully");
        navigate(`/advisor/${service_no}/vehicleinventory/create`);
      } else toast.error(response.data.message || "Something went wrong!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error uploading damage image:", error);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="w-[100%] h-[35rem] flex flex-col items-center justify-center bg-gray-200">
      <div className="flex justify-end items-center w-full h-[20%] ">
        <button
          className="mobile_cancel-btn md:tab_cancel-btn lg:cancel-btn mr-3 w-full h-[50px] sm:w-auto mb-2 sm:mb-0"
          onClick={async () => {
            try {
              navigate(`/advisor/service-record/${service_no}/take-photo`);
            } catch (error) {
              toast.error(error.response.data.message || "Internal Error");
            }
          }}
        >
          Take a Photo
        </button>
      </div>

      <div className="w-[80%] h-[80%] flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            border: "2px solid black",
            cursor: "crosshair",
            backgroundColor: "white",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      <div className="w-full flex flex-col sm:flex-row sm:justify-between  px-10 mb-2">
        <div>
          <button
            className="mobile_cancel-btn  md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
            type="button"
            onClick={() => {
              navigate("/advisor/dashboard");
            }}
          >
            Cancel
          </button>
          <button
            className="mobile_cancel-btn  md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </button>
        </div>

        <div>
          <button
            className="mobile_cancel-btn md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
            type="button"
            onClick={handleUndo}
          >
            Undo
          </button>
          <button
            className="mobile_submit-btn md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
            type="submit"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
