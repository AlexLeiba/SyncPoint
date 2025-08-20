import React from "react";
import { Logo } from "./Logo";
import GridContainer from "../Grid/GridContainer";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { NavLinks } from "./NavLinks";
import { auth } from "@clerk/nextjs/server";
import { Button } from "../ui/button";

export async function Header() {
  const authData = await auth();
  return (
    <header>
      <nav className="w-full bg-accent fixed top-0 right-0 left-0 ">
        <GridContainer spacerY={"small"}>
          <div className="flex justify-between items-center text-foreground ">
            <Logo />

            {authData?.userId ? (
              <>
                <NavLinks />
                <UserButton
                  fallback={<div />}
                  // appearance={{
                  //   elements: { userButtonAvatarBox: "size-full" },
                  // }}
                />
              </>
            ) : (
              <Button asChild>
                <SignInButton />
              </Button>
            )}
          </div>
        </GridContainer>
      </nav>
    </header>
  );
}
