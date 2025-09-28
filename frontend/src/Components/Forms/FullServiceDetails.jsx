
export default function FullServiceDetails({ data }) {
  return (
    <div className="bg-background py-6 px-5 sm:px-3 lg:px-8 xl::px-16">
      <div className="mt-3 flex flex-col">
        <div className="flex flex-col sm:flex-row w-full justify-between sm:mb-3">
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label ">Job No :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels  xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={data?.service_no}
            />
          </div>
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className=" text-tab_body_label lg:text-body_label">Service Advisor :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={`${data?.user?.first_name} ${data?.user?.last_name}`}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between sm:mb-3">
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Vehicle Type :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={data?.vehicle?.type}
            />
          </div>
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Package :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={
                data?.service_records_package?.[0]?.package?.job_type?.job_type
              }
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between sm:mb-3">
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Brand :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={data?.vehicle?.brand}
            />
          </div>
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Model :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={data?.vehicle?.model}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between sm:mb-3">
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Vehicle Number :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={data?.vehicle_number}
            />
          </div>
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Odometer :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={data?.odometer}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between sm:mb-3">
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Customer Name :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={`${data?.customer?.first_name} ${data?.customer?.last_name}`}
            />
          </div>
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Mobile Number :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={data?.customer?.mobile_number}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full justify-between sm:mb-3">
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Date :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={data?.date}
            />
          </div>
          <div className="div_between_inputs sm:sm_div_between_inputs mb-3 sm:mb-0">
            <label className="text-tab_body_label lg:text-body_label">Time :</label>
            <input
              className="input_labels sm:sm_input_labels md:md_input_labels lg:lg_input_labels xl:xl_input_labels text-tab_body_label lg:text-body_label"
              disabled
              value={data?.time}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
