import React from "react";
import { Title } from "./Title";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  endAdornment?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const WhiteBlock: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  endAdornment,
  className,
  contentClassName,
  children,
}) => {
  return (
    <div className={cn("bg-[#B099D3] rounded-3xl", className)}>
      {title && (
        <div className="flex items-center justify-between p-5 px-7  border-gray-100">
          <Title
            text={title}
            size="sm"
            className="font-bold custom text-4xl "
          />
          {endAdornment}
        </div>
      )}

      <div className={cn("px-5 py-4", contentClassName)}>{children}</div>
    </div>
  );
};
