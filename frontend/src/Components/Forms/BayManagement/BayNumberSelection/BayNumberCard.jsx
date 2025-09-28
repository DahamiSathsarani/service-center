export default function BayNumberCard({
  bay,
  lubeServiceTimeRecord,
  isSelected,
  onSelect,
  isDisabled,
  isEnabled
}) {
  return (
    <button
      className={`border-[3px] border-black w-[6rem] h-[6rem] sm:w-[7rem] sm:h-[7rem] lg:w-[8rem] lg:h-[8rem] 
        flex flex-col justify-center items-center rounded-[10px] mx-5 my-2 sm:my-0
        transition-colors duration-300 ease-in-out 
        ${
          isSelected &&
          !(isDisabled || (bay.is_busy && lubeServiceTimeRecord === null))
            ? "bg-yellow-400"
            : "bg-white"
        } 
        ${
          isDisabled || (bay.is_busy && lubeServiceTimeRecord === null)
            ? "opacity-30 cursor-not-allowed"
            : "hover:cursor-pointer"
        } ${isEnabled ? "bg-yellow-400" : ""}`}
      onClick={onSelect}
    >
      <span className="text-heading">Bay</span>
      <span className="text-heading">{bay.bay_id}</span>
    </button>
  );
}
