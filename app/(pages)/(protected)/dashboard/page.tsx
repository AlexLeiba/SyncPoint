import GridContainer from "@/components/Grid/GridContainer";
import UserData from "@/components/Pages/Dashboard/UserData";
import { Button } from "@/components/ui/button";
import {
  getEventMettingsData,
  getBookedMeetingsData,
} from "@/server-actions/meetings";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "SyncPoint - Dashboard",
  description:
    "SyncPoint is a Calendly clone built with Next.js, Clerk, Prisma and Tailwind CSS.",
};

async function DashboardPage() {
  const eventMeetingsData = await getEventMettingsData("upcoming", 1);
  const bookedMeetingsData = await getBookedMeetingsData("upcoming", 1);
  return (
    <GridContainer>
      <div className="flex justify-between">
        <h2 className="gradient-title">Dashboard</h2>
        <Button asChild size={"lg"} variant={"primary"}>
          <Link href="/events/new-event">
            <CalendarPlus /> New Event
          </Link>
        </Button>
      </div>
      <div className="w-full h-px bg-muted-foreground my-8"></div>

      <UserData
        eventMeetingsData={eventMeetingsData}
        bookedMeetingsData={bookedMeetingsData}
      />
    </GridContainer>
  );
}

export default DashboardPage;
