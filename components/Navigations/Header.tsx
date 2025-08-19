import React from "react";
import { Logo } from "./Logo";
import GridContainer from "../Grid/GridContainer";
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <div className="w-full bg-accent fixed top-0 right-0 left-0">
      <GridContainer spacerY={"small"}>
        <div className="flex justify-between items-center">
          <Logo />

          <UserButton />
        </div>
      </GridContainer>
    </div>
  );
}
