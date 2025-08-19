import React from "react";
import { CalendarHeart } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <div className="flex items-center">
      <Link href={"/"}>
        <p className="text-xl">
          <b>Sync</b>P
          <span>
            <CalendarHeart className="inline-block" />
          </span>
          int.
        </p>
      </Link>
    </div>
  );
}
