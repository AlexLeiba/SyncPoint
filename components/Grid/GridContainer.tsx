import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import React from "react";

const containerVariants = cva("w-full", {
  variants: {
    spacerY: {
      small: " my-2 md:my-4",
      medium: " my-6 md:my-10",
      large: " my-8 md:my-12",
      none: "my-0",
    },
    fluid: {
      true: "px-0",
      false: "max-w-5xl mx-auto px-4",
    },
  },
});

function GridContainer({
  children,
  fluid = false,
  spacerY = "medium",
}: {
  children: React.ReactNode;
  fluid?: boolean;
  spacerY?: "small" | "medium" | "large" | "none";
}) {
  return (
    <div className={cn(containerVariants({ fluid, spacerY }))}>{children}</div>
  );
}

export default GridContainer;
