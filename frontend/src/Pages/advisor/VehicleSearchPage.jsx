import React, { useRef, useState } from "react";
import { vehicle_search } from "../../Api/VehicleAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tesseract from "tesseract.js";

const VehicleSearchPage = () => {
    const navigate = useNavigate();
    const [vehicle_number, setVehicleNumber] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleChange = (e) => {
        setVehicleNumber(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await vehicle_search(vehicle_number, "vehicle_number");
            console.log("Response:", response.data);

            if (response.status === 200) {
                navigate(`/advisor/vehicle/${vehicle_number}/view`, { state: { vehicle: response.data.vehicle } });
            }
        } catch (error) {
            console.log("Error:", error);

            if (error.response?.status === 404) {
                toast.error(error.response?.data?.message || "Vehicle not found!");
                navigate(`/advisor/customer/search`, { state: { type: 'view' } });
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    };

    const openCamera = async () => {
        setShowCamera(true);
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        if(videoRef.current){
            videoRef.current.srcObject = stream;
        }
    };

    const captureAndExtractText = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
    
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            let avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            pixels[i] = avg;
            pixels[i + 1] = avg;
            pixels[i + 2] = avg;
        }
        context.putImageData(imageData, 0, 0);
    
        Tesseract.recognize(canvas.toDataURL("image/png"), "eng", {
            tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-",
        })
            .then(({ data: { text } }) => {
                console.log("Extracted text:", text);
    
                const plateMatch = text.match(/\b[A-Z]{2,3}-\d{4}\b/);
    
                if (plateMatch) {
                    setVehicleNumber(plateMatch[0]);
                } else {
                    toast.error("Could not recognize a valid vehicle number.");
                }
    
                setShowCamera(false);
                video.srcObject.getTracks().forEach(track => track.stop());
            })
            .catch((error) => {
                console.error("OCR Error:", error);
                toast.error("Failed to extract text. Try again!");
            });
    };
    

    return (
        <div className="flex justify-center items-center h-[80vh] w-full bg-background">
            <div className="bg-[#ffff] rounded-lg shadow-lg w-[18rem] sm:w-[30rem] md:w-[40rem] lg:w-[50rem] px-[2rem] sm:px-[4rem] pt-[2rem] pb-[3rem] ">
                <h1 className="text-heading text-center mb-[2rem]">Search Vehicle</h1>
                <form className="md:flex justify-center " onSubmit={handleSearch}>
                    <div className="flex flex-col">
                        <div className="w-full md:flex md:h-[3rem] md:w-[28rem] lg:w-[38rem] items-center justify-between">
                            <input
                                className="bg-[#F9F9F9] w-full  h-[2.5rem] sm:h-[3.5rem] pl-[1rem] rounded-md mb-6 md:mb-0 md:mr-6 text-mobile_body_label sm:text-tab_body_label lg:text-body_label"
                                placeholder="Vehicle Number"
                                id="vehicle_number"
                                name="vehicle_number"
                                value={vehicle_number}
                                onChange={handleChange}
                                type="text"
                            />
                            <button
                                type="submit"
                                className="w-full  md:mt-0 md:w-[8rem] mobile_submit-btn sm:tab_submit-btn lg:submit-btn">
                                Search
                            </button>
                        </div>
                        <div className="w-full md:flex md:h-[3rem] md:w-[28rem] lg:w-[38rem] items-center justify-center">
                            <button
                                type="button"
                                onClick={openCamera}
                                className="w-full  md:mt-20 md:w-[16rem] mobile_cancel-btn sm:tab_cancel-btn lg:cancel-btn">
                                Scan the number
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {showCamera && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-md">
                        <video ref={videoRef} autoPlay className="w-full h-auto"></video>
                        <canvas ref={canvasRef} width="640" height="480" className="hidden"></canvas>
                        <div className="flex justify-between mt-4">
                            <button onClick={captureAndExtractText} className="px-4 py-2 bg-blue-500 text-white rounded">
                                Capture
                            </button>
                            <button onClick={() => setShowCamera(false)} className="px-4 py-2 bg-red-500 text-white rounded">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VehicleSearchPage
