"use client";
import { cn } from "@/lib/utils";
import { ChevronRight, Settings } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Spacer } from "../ui/spacer";
import Link from "next/link";
import { LINKS } from "@/consts";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export function SideBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("click", handleCheckWhereWasClicked);

    function handleCheckWhereWasClicked(e: MouseEvent) {
      if (
        sidebarRef.current &&
        !(sidebarRef.current as HTMLDivElement).contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    return () => {
      document.removeEventListener("click", handleCheckWhereWasClicked);
    };
  }, [open]);
  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "pt-2 ",
        open ? "w-[250px]" : "w-[50px]",
        "fixed left-0 top-[61px] bottom-0 bg-secondary  z-10 transition-all ease-in-out duration-100 hidden md:block"
      )}
    >
      <Button
        variant={"ghost"}
        className=" absolute top-2 right-2 z-40"
        onClick={() => setOpen(!open)}
      >
        <ChevronRight
          className={cn(
            open ? "rotate-180" : "rotate-360",
            "size-6 transition-all "
          )}
        />
      </Button>

      <Spacer size={10} />

      <nav className="flex flex-col justify-between h-[calc(100%-100px)]">
        <ul className="flex gap-2 flex-col">
          {LINKS.map((link) => (
            <li key={link.href} title={link.label}>
              <Link
                href={link.href}
                className={cn(
                  pathname === link.href && "bg-green-100",
                  " flex items-center gap-2 hover:bg-gray-300 p-2 overflow-x-hidden"
                )}
              >
                <link.icon
                  className={cn(
                    "ml-1",

                    pathname === link.href
                      ? "text-gray-800 stroke-2"
                      : "text-gray-500"
                  )}
                />

                {open && (
                  <p
                    className={cn(
                      "text-foreground",
                      pathname === link.href ? "font-bold" : "",
                      "text-lg"
                    )}
                  >
                    {link.label}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2  p-3 ">
          <UserButton />
          {open && (
            <p
              className={cn(
                "text-foreground",

                "text-lg"
              )}
            >
              Settings
            </p>
          )}
        </div>
      </nav>
    </aside>
  );
}
