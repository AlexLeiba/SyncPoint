import React from "react";
import GridContainer from "../Grid/GridContainer";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <div className="bg-accent ">
      <GridContainer spacerY="small">
        <div className="flex justify-between items-center">
          <Logo />

          <p className="text-lg">Contact</p>
        </div>
      </GridContainer>
    </div>
  );
}
