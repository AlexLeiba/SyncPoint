import GridContainer from "@/components/Grid/GridContainer";
import { BookingForm } from "@/components/Pages/Book/BookingForm";
import { EventDetails } from "@/components/Pages/Book/EventDetails";
import { prismaDB } from "@/lib/prismaClient";
import { getEventAvailability } from "@/server-actions/booking";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { userId } = await auth();

  const eventId = (await params).eventId;

  if (!userId || !eventId) return notFound();

  const eventData = await prismaDB.event.findUnique({
    where: {
      id: eventId,
      userClerkId: userId,
    },
  });

  return {
    title: eventData?.title || "Event",
    description: eventData?.description || "Event",
  };
}

async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string; eventOwnerId: string }>;
}) {
  const { userId } = await auth();

  const eventId = (await params).eventId;
  const eventOwnerId = (await params).eventOwnerId;

  if (!userId || !eventId || !eventOwnerId) {
    return notFound();
  }

  const { data, error } = await getEventAvailability(eventId, eventOwnerId);

  if (!data?.event) {
    return notFound();
  }

  return (
    <GridContainer>
      <div className="flex justify-between bg-muted py-4 px-6">
        <EventDetails
          availableDays={data.slots || []}
          error={error}
          event={data.event}
        />

        <BookingForm
          availableDays={data.slots || []}
          error={error}
          event={data.event}
        />
      </div>
    </GridContainer>
  );
}

export default EventPage;
