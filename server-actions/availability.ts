"use server";

import {
  DayOfWeekUpperCase,
  DAYS_OF_WEEK,
  DEFAULT_AVAILABILITY,
} from "@/consts";
import { prismaDB } from "@/lib/prismaClient";
import { availabilitySchema, AvailabilitySchemaType } from "@/lib/zodSchemas";
import { auth } from "@clerk/nextjs/server";

export async function getAvailability() {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: "User not found",
      data: null,
    };
  }

  const availabilityResponse = await prismaDB.availability.findMany({
    where: {
      userClerkId: userId,
    },
    include: {
      days: true,
    },
  });
  console.log(
    "🚀 ~ getAvailability SERVER   availabilityResponse:\n\n ",
    availabilityResponse
  );

  if (availabilityResponse.length === 0) {
    return {
      error: "",
      data: {
        ...DEFAULT_AVAILABILITY,
        timeGap: 0,
      },
    };
  }

  //   If avaliability exists, make sure all days are included
  const availabilityData: AvailabilitySchemaType = {
    ...DEFAULT_AVAILABILITY,
  };

  DAYS_OF_WEEK.forEach((dayOfWeek) => {
    const dayAvailable = availabilityResponse[0].days.find(
      (d) => d.day === dayOfWeek.toUpperCase()
    );

    availabilityData[dayOfWeek] = {
      isAvailable: !!dayAvailable, //if exists is True Else is false
      startTime: dayAvailable?.startTime.toISOString().slice(11, 16) || "09:00",
      endTime: dayAvailable?.endTime.toISOString().slice(11, 16) || "17:00",
    };
  });

  return {
    error: "",
    data: { ...availabilityData, timeGap: availabilityResponse[0].timeGap },
  };
}

export async function updateAvailability(data: AvailabilitySchemaType) {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: true,
      data: null,
    };
  }

  const safeData = availabilitySchema.safeParse(data);

  if (safeData.error) {
    return {
      error: true,
      data: null,
    };
  }

  const currentDateString = new Date().toISOString().split("T")[0];

  const availabilityData = Object.entries(safeData.data).flatMap((data) => {
    if (
      typeof data[1] === "object" &&
      data[1] !== null &&
      typeof data[1].isAvailable === "boolean" &&
      data[1].isAvailable
    ) {
      return [
        {
          day: data[0].toUpperCase() as DayOfWeekUpperCase,
          //THIS IS DEFAULT DATE,  when users will book a meeting, we will just update the start time and end time to what date user selected
          startTime: `${currentDateString}T${data[1].startTime}:00.000Z`, //
          endTime: `${currentDateString}T${data[1].endTime}:00.000Z`,
        },
      ];
    } else {
      return [];
    }
  });

  const availabilityResponseData = await prismaDB.availability.findMany({
    where: {
      userClerkId: userId,
    },
    select: {
      id: true,
    },
  });

  if (availabilityResponseData.length === 0) {
    const response = await prismaDB.availability.create({
      data: {
        userClerkId: userId,
        timeGap: safeData.data.timeGap,
        days: {
          create: availabilityData,
        },
      },
    });

    return {
      error: false,
      data: response,
    };
  } else {
    const response = await prismaDB.availability.update({
      where: {
        id: availabilityResponseData[0].id,
        userClerkId: userId,
      },
      data: {
        timeGap: safeData.data.timeGap,
        days: {
          deleteMany: {}, //delete previous availabilities/ and add new
          create: availabilityData,
        },
      },
    });

    return {
      error: false,
      data: response,
    };
  }
}
