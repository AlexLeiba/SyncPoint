import React from "react";
import { CalendarHeart } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <div className="flex items-center">
      <Link href={"/dashboard"}>
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
