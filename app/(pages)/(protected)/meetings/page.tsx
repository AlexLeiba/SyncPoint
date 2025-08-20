import GridContainer from "@/components/Grid/GridContainer";
import { SchedulesForm } from "@/components/Pages/Schedules/SchedulesForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prismaDB } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

async function MeetingsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const schedulesData = await prismaDB.meeting.findFirst({
    where: { userClerkId: userId },
    orderBy: {
      createdAt: "desc",
      //TODO sort by startTime from schedule
    },
  });
  console.log("🚀 ~ MeetingsPage ~ schedulesData:", schedulesData);
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
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {/* FORM */}
          <SchedulesForm />
        </CardContent>
      </Card>
    </GridContainer>
  );
}

export default MeetingsPage;
