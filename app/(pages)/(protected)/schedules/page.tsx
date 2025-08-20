import GridContainer from "@/components/Grid/GridContainer";
import { SchedulesForm } from "@/components/Pages/Schedules/SchedulesForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import React from "react";

async function SchedulesPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const schedulesData = await prisma.schedule.findFirst({
    where: { userClerkId: userId },
    orderBy: {
      createdAt: "desc",
      //TODO sort by startTime from schedule
    },
  });
  console.log("🚀 ~ SchedulesPage ~ schedulesData:", schedulesData);
  return (
    <GridContainer>
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

export default SchedulesPage;
