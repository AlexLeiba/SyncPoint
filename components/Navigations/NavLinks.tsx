"use client";
import { LINKS } from "@/consts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <div>
      <div className="flex gap-6">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
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
