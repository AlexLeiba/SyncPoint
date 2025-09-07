"use client";
import React from "react";
import { CalendarHeart } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export function Logo() {
  const { user } = useUser();

  return (
    <div className="flex items-center">
      <Link href={user?.id ? "/dashboard" : "/"}>
        <p className="text-xl">
          <b>Sync</b>P
          <span>
            <CalendarHeart className="inline-block" size={15} />
          </span>
          int.
        </p>
      </Link>
    </div>
  );
}
