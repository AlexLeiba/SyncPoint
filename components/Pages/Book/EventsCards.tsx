import { Event } from "@/app/generated/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
// import { CopyEventLink } from "../Events/CopyEventLink";
import { formatDurationInMinutes } from "@/lib/formatDurationInMinutes";
import Link from "next/link";

type Props = { events: Event[] };
export function EventsCards({ events }: Props) {
  if (events.length === 0) return <div>No events found</div>;
  return (
    <div className="grid grid-cols-3 gap-4">
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
              <CardFooter className="flex justify-end gap-2">
                {/* COPY EVENT LINK */}
                {/* <CopyEventLink
                eventId={event.id}
                userId={event.userClerkId}
                disabled={false}
              /> */}
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
