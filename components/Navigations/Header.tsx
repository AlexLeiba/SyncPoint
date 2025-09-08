"use client";
import React, { useCallback, useState } from "react";
import { Logo } from "./Logo";
import GridContainer from "../Grid/GridContainer";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { UserMenuButton } from "./UserMenuButton";
import { BurgerMenu } from "./BurgerMenu";
import { Menu } from "lucide-react";

export function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const { isLoaded, user } = useUser();

  const handleCloseMenu = useCallback(() => {
    return setOpenMenu(false);
  }, [setOpenMenu]);

  return (
    <header>
      <nav className="w-full bg-accent fixed top-0 right-0 left-0 z-50 ">
        <GridContainer spacerY={"small"}>
          <div className="flex justify-between items-center text-foreground ">
            <Logo />

            {isLoaded && user?.id ? (
              <>
                {/* <NavLinks /> */}
                {openMenu && <BurgerMenu handleCloseMenu={handleCloseMenu} />}
                <div className="flex gap-4 items-center">
                  <Button
                    variant={"ghost"}
                    onClick={() => setOpenMenu(true)}
                    className="md:hidden"
                  >
                    <Menu />
                  </Button>
                  <UserMenuButton />
                </div>
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
