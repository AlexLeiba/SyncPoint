"use client";
import React from "react";
import { LINKS } from "@/consts";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "../ui/button";

export function BurgerMenu({
  handleCloseMenu,
}: {
  handleCloseMenu: () => void;
}) {
  const pathname = usePathname();
  const navigate = useRouter();

  function handleNavigate(url: string) {
    navigate.push(url);
    handleCloseMenu();
  }
  return (
    <div className="h-screen w-full fixed inset-0 z-50 flex items-center justify-center bg-background md:hidden">
      <Button
        size={"lg"}
        onClick={handleCloseMenu}
        variant={"ghost"}
        className="absolute top-2 right-2"
      >
        <X className="size-6" />
      </Button>
      <div className="flex gap-8 flex-col ">
        {LINKS.map((link) => (
          <Button
            size={"lg"}
            variant={"ghost"}
            key={link.href}
            onClick={() => handleNavigate(link.href)}
          >
            <div className=" flex items-center gap-2  p-2 overflow-x-hidden">
              <link.icon />
              <p
                className={cn(
                  "text-foreground",
                  pathname === link.href ? "font-bold" : "",
                  "text-lg"
                )}
              >
                {link.label}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
