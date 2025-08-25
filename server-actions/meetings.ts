"use server";

import { prismaDB } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";

export async function getMettingsData(
  type: "upcoming" | "previous" = "upcoming"
) {
  const { userId } = await auth();

  try {
    if (!userId) {
      throw new Error("User not found");
    }

    const now = new Date();
    const meetings = await prismaDB.meeting.findMany({
      where: {
        userClerkId: userId,
        startTime: type === "upcoming" ? { gt: now } : { lte: now },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return {
      error: false,
      data: meetings,
    };
  } catch (error) {
    console.log("ERROR get meeting data: ", error);
    return {
      error: true,
      data: null,
    };
  }
}
