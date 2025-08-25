import GridContainer from "@/components/Grid/GridContainer";
import { MeetingsList } from "@/components/Pages/Meetings/MeetingsList";
import { Button } from "@/components/ui/button";
import { prismaDB } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "SyncPoint - Meetings",
  description:
    "SyncPoint is a Calendly clone built with Next.js, Clerk, Prisma and Tailwind CSS.",
};

async function MeetingsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const meetingsData = await prismaDB.meeting.findMany({
    where: { userClerkId: userId },
    orderBy: {
      startTime: "asc",
      //TODO sort by startTime from schedule
    },
  });

  return (
    <GridContainer>
      <div className="flex justify-between">
        <h2 className="gradient-title">Meetings</h2>
        <Button asChild size={"lg"}>
          <Link href="/events/new-event">
            <CalendarPlus /> New Event
          </Link>
        </Button>
      </div>
      <div className="w-full h-px bg-muted-foreground my-4"></div>

      <MeetingsList meetingsData={meetingsData} />
    </GridContainer>
  );
}

export default MeetingsPage;
