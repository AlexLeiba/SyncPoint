"use server";

import {
  DayOfWeekUpperCase,
  DAYS_OF_WEEK,
  DEFAULT_AVAILABILITY,
} from "@/consts";
import { parseIsoDateInLocalHoursAndMinutes } from "@/lib/formatDurationInMinutes";
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

    const startTime = parseIsoDateInLocalHoursAndMinutes(
      dayAvailable?.startTime.toISOString()
    );
    const endTime = parseIsoDateInLocalHoursAndMinutes(
      dayAvailable?.endTime.toISOString()
    );

    availabilityData[dayOfWeek] = {
      isAvailable: !!dayAvailable,
      startTime: startTime || "09:00",
      endTime: endTime || "17:00",
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

  const currentDateStringWithoutTime = new Date().toISOString().split("T")[0]; //to save date in UTC on DB

  const availabilityData = Object.entries(safeData.data).flatMap(
    (dataArray) => {
      if (
        typeof dataArray[1] === "object" &&
        dataArray[1] !== null &&
        typeof dataArray[1].isAvailable === "boolean" &&
        dataArray[1].isAvailable //if object with startTime endTime is available (is checked), is object, is not null then add it to Request
      ) {
        const startTimeString = `${currentDateStringWithoutTime}T${dataArray[1].startTime}`;
        const endTimeString = `${currentDateStringWithoutTime}T${dataArray[1].endTime}`;

        const startTimeToUTC = new Date(startTimeString).toISOString();
        const endTimeToUTC = new Date(endTimeString).toISOString();
        //parse to ISO string before to send to DB , to store it as UTC
        return [
          {
            day: dataArray[0].toUpperCase() as DayOfWeekUpperCase,
            //THIS IS DEFAULT DATE,  when users will book a meeting, we will just update the start time and end time to what date user selected
            startTime: `${startTimeToUTC}`, //
            endTime: `${endTimeToUTC}`,
          },
        ];
      } else {
        return [];
      }
    }
  );

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
