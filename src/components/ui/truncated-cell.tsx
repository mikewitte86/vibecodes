import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRef, useState, useEffect } from "react";

interface TruncatedCellProps {
  text: string;
  maxWidth?: string;
  className?: string;
}

export function TruncatedCell({ text, maxWidth = "max-w-[200px]", className }: TruncatedCellProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [text]);

  const content = (
    <span ref={textRef} className={`truncate block ${maxWidth} ${className || ''}`}>
      {text}
    </span>
  );

  if (!isTruncated) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 