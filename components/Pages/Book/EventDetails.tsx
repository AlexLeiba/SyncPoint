"use client";
import { Event } from "@/app/generated/prisma";
import { formatDurationInMinutes } from "@/lib/formatDurationInMinutes";
import { DataSlotsType } from "@/server-actions/booking";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = {
  availableDays: DataSlotsType;
  error: boolean;
  event: Event;
};
export function EventDetails({ availableDays, event, error }: Props) {
  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <h4>{event.title}</h4>

        <div className="flex items-center gap-2 mt-2">
          {event?.userImage && (
            <div className="relative size-24 overflow-hidden rounded-full">
              <Image src={event?.userImage} alt="avatar" fill />
            </div>
          )}

          <div>
            <p className="text-xl">{event?.userFullName} </p>
            <p className="text-muted-foreground">{event.userEmail}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-col mt-4">
          <div className="flex gap-2 items-center">
            <Clock />
            <p>{formatDurationInMinutes(event.durationInMinutes)}</p>
          </div>

          <div className="flex gap-2 items-center">
            <Calendar />
            <p>Google Meet</p>
          </div>
        </div>

        {event.description && (
          <p className="mt-6 text-muted-foreground">{event.description}</p>
        )}
      </div>
    </div>
  );
}
