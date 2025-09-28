import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import { create_damage_images } from "../../Api/DamagesAPI";

const CameraCapture = () => {
    const navigate = useNavigate();
    const { service_no } = useParams();
    const webcamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [saving, setSaving] = useState(false);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
    };

    const saveImage = async () => {
        if (!capturedImage) return;

        setSaving(true);
        
        try {
            const formData = new FormData();
            formData.append("damage_image", dataURLtoFile(capturedImage, "captured.jpg"));
            formData.append("service_no", service_no);

            const response = await create_damage_images(formData);
            if (response.status === 200) {
                toast.success("Image saved successfully!");
                navigate(0);
            }
        } catch (error) {
            console.error("Error saving image:", error);
            alert("Failed to save image");
        } finally {
            setSaving(false);
        }
    };

    const dataURLtoFile = (dataUrl, filename) => {
        let arr = dataUrl.split(","), 
            mime = arr[0].match(/:(.*?);/)[1], 
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);

        while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    };

    return (
        <div className="w-[100%] h-[35rem] flex flex-col items-center justify-center bg-gray-200">
            {!capturedImage ? (
                <>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-100 h-72 rounded-lg border border-gray-400"
                />
                </>
            ) : (
                <>
                <img src={capturedImage} alt="Captured" className="w-80 h-60 rounded-lg border border-gray-400" />
                </>
            )}

            <div className="w-full flex flex-col sm:flex-row sm:justify-end px-10 mb-2">
                {capturedImage ? (
                <button
                    onClick={() => setCapturedImage(null)}
                    className="mobile_cancel-btn md:tab_cancel-btn lg:cancel-btn mr-3 w-full sm:w-auto mb-2 sm:mb-0"
                >
                    Retake
                </button>
                ) : null}

                {!capturedImage && (
                <button
                    className="mobile_submit-btn md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
                    type="submit"
                    onClick={capture}
                >
                    Take Photo
                </button>
                )}

                {capturedImage && (
                <button
                    onClick={saveImage}
                    className="bmobile_submit-btn md:tab_submit-btn lg:submit-btn w-full sm:w-auto"
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Image"}
                </button>
                )}
            </div>
            </div>

    );
};

export default CameraCapture;
