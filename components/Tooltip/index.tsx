import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import "./styles.css";

interface TooltipDemoProps {
  content: string;
  children?: React.ReactNode;
  delayDuration?: number;
}

export const TooltipComponent = ({
  content,
  children,
  delayDuration = 300,
}: TooltipDemoProps) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-pointer">
            {children || <Info className="h-4 w-4 text-[#807872]" />}
          </span>
        </TooltipTrigger>
        <TooltipContent sideOffset={5} className="tooltip-content">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
