import GridContainer from "@/components/Grid/GridContainer";
import { EditEventForm } from "@/components/Pages/Events/EditEventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prismaClient";
import { RedirectToSignIn } from "@clerk/nextjs";
import React from "react";

async function EditEventPage({ params }: { params: { eventId: string } }) {
  const eventIdParam = await params.eventId;
  if (!eventIdParam) {
    return <RedirectToSignIn />;
  }
  const eventData = await prisma.event.findUnique({
    where: { id: eventIdParam },
  });
  if (!eventData) return <RedirectToSignIn />;
  // console.log("🚀 ~ EditEventPage ~ eventData:", eventData);
  return (
    <GridContainer>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          {/* FORM */}
          <EditEventForm eventData={eventData} />
        </CardContent>
      </Card>
    </GridContainer>
  );
}

export default EditEventPage;
