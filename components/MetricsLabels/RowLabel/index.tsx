import { TooltipComponent as Tooltip } from "@/components/Tooltip";

interface RowLabelProps {
  label: string;
  tooltipText?: string;
  className?: string;
}

export const RowLabel = ({ label, tooltipText, className }: RowLabelProps) => {
  return (
    <div
      className={`w-full flex items-center gap-x-1 md:gap-x-2 border-b border-gray-200 px-3 md:px-4 py-4 md:py-6 h-[60px] md:h-[70px] ${className}`}
    >
      <span className="text-xs md:text-base md:text-md font-[500] text-[#232323] leading-[16px] md:leading-[18px]">
        {label}
      </span>
      {tooltipText && <Tooltip content={tooltipText} />}
    </div>
  );
};
