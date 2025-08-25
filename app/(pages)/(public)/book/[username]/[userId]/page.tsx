import React from "react";
import GridContainer from "@/components/Grid/GridContainer";
import { EventsCards } from "@/components/Pages/Book/EventsCards";
import { UserData } from "@/components/Pages/Book/UserData";
import { Spacer } from "@/components/ui/spacer";
import { prismaDB } from "@/lib/prismaClient";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  return {
    title: `Book a meeting`,
    description: "Book a meeting",
  };
}

async function BookEventPage({
  params,
}: {
  params: Promise<{ username: string; userId: string }>;
}) {
  const userId = (await params).userId;

  // const { userId: clerkUserId } = await auth(); //check if user is authenticated

  if (!userId) {
    return notFound();
  }

  const eventsData = await prismaDB.event.findMany({
    where: {
      userClerkId: userId, //has to come from url because its public event
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          meetings: true,
        },
      },
    },
  });
  const userData = {
    userFullName: eventsData[0]?.userFullName,
    userImage: eventsData[0]?.userImage,
  };
  return (
    <GridContainer>
      <UserData userData={userData} />

      <Spacer size={8} />
      <EventsCards events={eventsData} />
    </GridContainer>
  );
}

export default BookEventPage;
