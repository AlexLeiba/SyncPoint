import GridContainer from "@/components/Grid/GridContainer";
import EventCard from "@/components/Pages/Events/EventCard";
import { Button } from "@/components/ui/button";
import { prismaDB } from "@/lib/prismaClient";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";

import React from "react";

export const metadata = {
  title: "SyncPoint - Events",
  description:
    "SyncPoint is a Calendly clone built with Next.js, Clerk, Prisma and Tailwind CSS.",
};

async function EventsPage() {
  const userData = await auth();

  if (userData.userId === null) {
    return <RedirectToSignIn />;
  }
  const events = await prismaDB.event.findMany({
    where: {
      userClerkId: userData.userId,
      // isActive: true, TODO check where to keep all events which arent active
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <GridContainer>
      <div className="flex justify-between">
        <h2 className="gradient-title">Events</h2>
        <Button asChild size={"lg"} variant={"primary"}>
          <Link href="/events/new-event">
            <CalendarPlus /> New Event
          </Link>
        </Button>
      </div>

      <div className="w-full h-px bg-muted-foreground my-4"></div>

      <div>
        {events.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {events.map((event) => (
              <EventCard data={event} key={event.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-lg">Hey looks like you have no events yet.</p>
            <p className="font-medium">Why not create one to get started?</p>
            <Button variant={"outline"} asChild size={"lg"}>
              <Link href="/events/new-event">
                <CalendarPlus /> New Event
              </Link>
            </Button>
          </div>
        )}
      </div>
    </GridContainer>
  );
}

export default EventsPage;
