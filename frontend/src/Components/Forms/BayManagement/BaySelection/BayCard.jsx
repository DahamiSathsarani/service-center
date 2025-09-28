import { useNavigate } from "react-router-dom";
import { icon } from "../../../../assets/Icons/icons";

export default function BayCard({
  status,
  img_url,
  img_description,
  bay_name,
  url
}) {
  const navigate=useNavigate();
  return (
    <div className="flex flex-col items-center mb-5 lg:mb-0 ">
      <div
      onClick={()=>{navigate(url)}}
        className={`${
          status === "COMPLETED"
            ? "relative flex justify-center  items-center w-[6rem] h-[6rem] sm:h-[7rem] sm:w-[7rem] md:h-[8rem] md:w-[8rem] border border-1 border-black rounded-[1rem] hover:cursor-pointer"
            : "hidden"
        }`}
      >
        <img
          className="absolute  h-[4rem] w-[4rem] sm:h-[5rem] sm:w-[5rem] opacity-5 "
          src={img_url}
          alt={img_description}
        />
        <div className="absolute flex flex-col w-full justify-center h-[90%] items-center">
          <img
            className=" inset-0 w-1/2 h-1/2 mx-auto my-auto z-10"
            src={icon.CompletedIcon}
            alt="Completed"
          />
          <span className="text-mobile_body_label sm:text-tab_body_label lg:text-body_label">
            Completed
          </span>
        </div>
      </div>
      <div
         onClick={()=>{navigate(url)}}
        className={`${
            status === "ONGOING"
              ? "relative flex justify-center  items-center w-[6rem] h-[6rem] sm:h-[7rem] sm:w-[7rem] md:h-[8rem] md:w-[8rem] border border-1 border-black rounded-[1rem] hover:cursor-pointer"
              : "hidden"
          }`}
      >
        <img
          className="absolute  h-[4rem] w-[4rem] sm:h-[5rem] sm:w-[5rem] opacity-5 "
          src={img_url}
          alt={img_description}
        />
         <div className="absolute flex flex-col w-full justify-center h-[90%] items-center">
          <img
            className=" inset-0 w-1/2 h-1/2 mx-auto my-auto z-10"
            src={icon.OnGoingIcon}
            alt="Ongoing"
          />
          <span className="text-mobile_body_label sm:text-tab_body_label lg:text-body_label">
            Ongoing
          </span>
        </div>
      </div>
      <div
         onClick={()=>{navigate(url)}}
        className={`${
          status === "not_started"
            ? "flex justify-center items-center w-[6rem] h-[6rem] sm:h-[7rem] sm:w-[7rem] md:h-[8rem] md:w-[8rem] border border-1 border-black rounded-[1rem] hover:cursor-pointer"
            : "hidden"
        }`}
      >
        <img
          className="h-[4rem] w-[4rem] sm:h-[5rem] sm:w-[5rem]"
          src={img_url}
          alt={img_description}
        />
      </div>
      <label className=" text-mobile_heading sm:text-tab_heading lg:text-heading">
        {bay_name}
      </label>
    </div>
  );
}
