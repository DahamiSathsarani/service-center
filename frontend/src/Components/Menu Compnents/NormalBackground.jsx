import React from "react";

export default function NormalBackground({
  title,
  componentName,
  type,
  data,
  button,
  vehicle_number,
  customer_id,
  onClickInBtn,
  onClickOutBtn,
  userRole,
  status,
}) {
  return (
    <div>
      <h1 className="font-bold text-center md:text-start text-black font-heading text-mobile_heading sm:text-tab_heading lg:text-heading mb-4 mt-5">
        {title}
      </h1>
      <div className="bg-white px-2 py-3 w-[97%] md:w-[100%] sm:p-6 shadow-md rounded-lg mb-2">
        {React.createElement(componentName, {
          type,
          data,
          button,
          vehicle_number,
          customer_id,
          onClickInBtn,
          onClickOutBtn,
          userRole,
          status,
        })}
      </div>
    </div>
  );
}
