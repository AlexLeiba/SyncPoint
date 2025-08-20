"use client";
import { UserButton } from "@clerk/nextjs";
import { Calendar, CalendarPlus } from "lucide-react";
import React from "react";

export function UserMenuButton() {
  return (
    <UserButton fallback={<div />}>
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Events"
          labelIcon={<Calendar size={15} />}
          href="/events"
        />
      </UserButton.MenuItems>
      <UserButton.MenuItems>
        <UserButton.Link
          label="Create Event"
          labelIcon={<CalendarPlus size={15} />}
          href="/events/new-event"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
