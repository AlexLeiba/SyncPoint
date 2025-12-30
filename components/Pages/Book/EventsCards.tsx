import { Event } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { formatDurationInMinutes } from "@/lib/formatDurationInMinutes";
import Link from "next/link";

type Props = { events: Event[] };
export function EventsCards({ events }: Props) {
  if (events.length === 0) return <div>No events found</div>;
  return (
    <div className="grid md:grid-cols-3 grid-cols-1  gap-4">
      {events.map((event) => {
        return (
          <Link
            href={`/event/${event.id}/${event.userClerkId}`}
            key={event.id}
            target="_blank"
          >
            <Card className="flex flex-col h-42">
              <CardHeader>
                <CardTitle className={"text-2xl line-clamp-1"}>
                  {event.title}
                </CardTitle>
                <div className="flex justify-between">
                  <CardDescription>
                    {formatDurationInMinutes(event.durationInMinutes)}
                  </CardDescription>
                  <CardDescription>
                    {/* @ts-ignore */}
                    {event._count.meetings} Bookings
                  </CardDescription>
                </div>
              </CardHeader>
              {event.description && (
                <CardContent>
                  <CardDescription className="text-foreground line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
