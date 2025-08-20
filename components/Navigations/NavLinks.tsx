"use client";
import { LINKS } from "@/consts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function NavLinks() {
  const pathname = usePathname();

  function handleNavigate() {}
  return (
    <div>
      <div className="flex gap-8 flex-col ">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className=" flex items-center gap-2 hover:bg-green-200 p-2 overflow-x-hidden"
          >
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
          </Link>
        ))}
      </div>
    </div>
  );
}
