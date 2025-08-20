"use server";

import { prismaDB } from "@/lib/prismaClient";
import { newEventSchema, NewEventSchemaType } from "@/lib/zodSchemas";
import { auth } from "@clerk/nextjs/server";

export async function createEvent(unsafeData: NewEventSchemaType) {
  const { userId } = await auth();

  const { data: safeData, success } = newEventSchema.safeParse(unsafeData);

  if (!success || !userId) {
    return { error: true, data: null };
  }

  const event = await prismaDB.event.create({
    data: {
      userClerkId: userId,
      title: safeData.title,
      description: safeData.description,
      durationInMinutes: safeData.durationInMinutes,
      isActive: safeData.isActive,
    },
  });

  if (event) {
    return { error: false, data: event };
  }

  return { error: true, data: null };
}

export async function editEvent(
  unsafeEventData: NewEventSchemaType,
  eventId: string
) {
  const { userId } = await auth();

  const { data: safeData, success } = newEventSchema.safeParse(unsafeEventData);

  if (!success || !userId) {
    return { error: true, data: null };
  }

  const event = await prismaDB.event.update({
    where: { id: eventId, userClerkId: userId },
    data: {
      userClerkId: userId,
      title: safeData.title,
      description: safeData.description,
      durationInMinutes: safeData.durationInMinutes,
      isActive: safeData.isActive,
    },
  });

  if (event) {
    return { error: false, data: event };
  }

  return { error: true, data: null };
}

export async function deleteEvent(eventId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: true, data: null };
  }

  const event = await prismaDB.event.delete({
    where: { id: eventId, userClerkId: userId },
  });

  if (event) {
    return { error: false, data: event };
  }

  return { error: true, data: null };
}
