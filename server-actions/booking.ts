"use server";
import { Meeting } from "@/app/generated/prisma";
import { prismaDB } from "@/lib/prismaClient";
import { auth } from "@clerk/nextjs/server";
import type { Event as PrismaEvent } from "@/app/generated/prisma";
import { DayOfWeekUpperCase } from "@/consts";
import {
  addDays,
  addMinutes,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";
import { google } from "googleapis";
import { clerkClient } from "@clerk/nextjs/server";

export type DataSlotsType = {
  date: string;
  slots: string[];
}[];

export async function getEventAvailability(
  eventId: string,
  eventOwnerId: string
): Promise<{
  error: boolean;
  data: { slots: DataSlotsType | null; event: PrismaEvent } | null;
}> {
  const { userId } = await auth();

  if (!eventOwnerId || !eventId || !userId) {
    console.log("ERROR", "No user or event id ");
    return {
      error: true,
      data: null,
    };
  }

  const eventData = await prismaDB.event.findUnique({
    where: {
      id: eventId,
      userClerkId: eventOwnerId, //to get the event on which a user wants to make the booking
    },
  });

  const availability = await prismaDB.availability.findMany({
    where: {
      userClerkId: eventOwnerId,
    },
    include: {
      days: true,
    },
  });

  //   To get the initial state of the booking if this exists as (when starts and when ends)
  const bookings = await prismaDB.meeting.findMany({
    where: {
      eventId: eventId,
      userClerkId: eventOwnerId,
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  if (!eventData) {
    console.log("ERROR", "No event or availability");

    return {
      error: true,
      data: null,
    };
  }

  //   CALC USER SLOTS WITH AVAILABLE TIME ON EACH SELECTED SLOT
  const startDate = startOfDay(new Date()); // the 00:00 of today in local timezone TODO: check why returns 21:00
  const endDate = addDays(startDate, 30); // adds 30 days to the start date

  const availableDays: DataSlotsType = [];

  //   Creating day slots for 30 days
  // Will iterate until the current date reaches 30 days
  for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
    const dayOfWeek = format(date, "EEEE").toUpperCase() as DayOfWeekUpperCase;
    const dayAvailable = availability[0]?.days.find(
      (day) => day.day === dayOfWeek
    ); //User is available on that day
    // Generate all time slots on calendar where user is available with from to hours on each day slot

    if (dayAvailable) {
      //create slot only on available day SET by owner in AVAILABILITY
      const startDateString = format(date, "yyyy-MM-dd");
      const slots = generateAvailableTimeSlots({
        startTime: dayAvailable.startTime,
        endTime: dayAvailable.endTime,
        duration: eventData.durationInMinutes,
        bookings,
        startDateString,
        timeGap: availability[0].timeGap,
      });

      availableDays.push({
        date: startDateString,
        slots,
      });

      //   availableDays.push(dateString, generateAvailableSlots());
    }
  }

  return {
    error: false,
    data: { slots: availableDays, event: eventData },
  };
}

function generateAvailableTimeSlots({
  startTime,
  endTime,
  duration,
  bookings,
  startDateString,
  timeGap = 0,
}: {
  startTime: Date;
  endTime: Date;
  duration: number;
  bookings: Pick<Meeting, "startTime" | "endTime">[];
  startDateString: string;
  timeGap: number;
}) {
  const slots = [];
  let currentTimeOfAvailableDay = parseISO(
    `${startDateString}T${startTime.toISOString().slice(11)}`
  );
  const endTimeOfAvailableDay = parseISO(
    `${startDateString}T${endTime.toISOString().slice(11)}`
  );

  //   only show slots after current time / not before
  // check if the slot is from current day / then check if start hour from slot is behind current hour
  const now = new Date();
  if (format(now, "yyyy-MM-dd") === startDateString) {
    //if the slot is in the current day
    // currentTimeOfAvailableDay.setMinutes(now.getMinutes());

    const currentTime = isBefore(currentTimeOfAvailableDay, now);

    if (currentTime) {
      currentTimeOfAvailableDay = addMinutes(now, timeGap);
    }

    // .setMinutes(now.getMinutes() + timeGap); //add additional minutes
  }

  // Now after we formatted the time available slots, will iterate through the same day slot (by iterating from start hour to end hour of the same day availavility) to  check if there is a booking already or if not at a particular time.

  while (
    currentTimeOfAvailableDay.getTime() < endTimeOfAvailableDay.getTime() //while the day hasn ended yet.
  ) {
    const currentBookingEnd = new Date(
      currentTimeOfAvailableDay.getTime() + duration * (60 * 1000) //convert duration in minutes to milliseconds/
      // This is the time when each book of current day will end + duration/ if the booking was at 17:00 and duration 30min then result will be 17:30
    );

    const isSlotAlreadyTakenForAParticularTime = bookings.some((book) => {
      // Check if the booking of the current time is already booked.
      const bookStart = new Date(book.startTime).getTime();
      const bookEnd = new Date(book.endTime).getTime();

      return (
        (currentTimeOfAvailableDay.getTime() >= bookStart &&
          currentTimeOfAvailableDay.getTime() < bookEnd) ||
        (currentBookingEnd.getTime() > bookStart &&
          currentBookingEnd.getTime() <= bookEnd) ||
        (currentTimeOfAvailableDay.getTime() <= bookStart &&
          currentBookingEnd.getTime() >= bookEnd)
      );
    });

    if (!isSlotAlreadyTakenForAParticularTime) {
      // if slot is not taken then push this free slot
      slots.push(format(currentTimeOfAvailableDay, "HH:mm"));
    }

    currentTimeOfAvailableDay.setMinutes(
      currentBookingEnd.getMinutes() + timeGap
    );

    currentTimeOfAvailableDay = currentBookingEnd;
    //TODO ASK chat how works.
  }

  return slots;

  //   Compare if the current time is available/ is wasnt taken in bookings
}

export type BookAMeetingType = {
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  additionalInfo: string;
  eventId: string;
  clerkUserId: string;
};
export async function bookAMeeting(bookData: BookAMeetingType) {
  const { userId } = await auth(); //for userClerkId

  const { data } = await (
    await clerkClient()
  ).users.getUserOauthAccessToken(bookData.clerkUserId, "google");

  const token = data[0]?.token;

  try {
    if (!userId || !token) {
      throw new Error("User not found");
    }

    const event = await prismaDB.event.findUnique({
      where: { id: bookData.eventId }, //the event user wants to make a book
    });

    if (!event) {
      throw new Error("Event not found");
    }

    // use google calenday api to generate meet link and add to calendar

    const oAuthClientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

    if (!oAuthClientSecret) {
      throw new Error("Client secret not found");
    }

    // Set up Google OAuth Client
    const oAuth2Client = new google.auth.OAuth2();

    oAuth2Client.setCredentials({
      access_token: token,
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const meetResponse = await calendar.events.insert({
      auth: oAuth2Client,
      calendarId: "primary",
      conferenceDataVersion: 1,

      requestBody: {
        //the body of the event saved in goole calendar
        summary: `${bookData.name} - ${event.title}`,
        description: bookData.additionalInfo,
        start: {
          dateTime: bookData.startTime,
        },
        end: {
          dateTime: bookData.endTime,
        },
        attendees: [
          {
            email: bookData.email,
          },
          {
            email: event.userEmail,
          },
        ],
        conferenceData: {
          //required for generating ID of the event
          createRequest: {
            requestId: `${event.id}-${bookData.startTime}-${bookData.endTime}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    const meetLink = meetResponse.data.hangoutLink;
    const googleEventId = meetResponse.data.id;

    if (!meetLink || !googleEventId) {
      throw new Error("Failed to book a meeting. Please try again.");
    }

    const response = await prismaDB.meeting.create({
      data: {
        startTime: bookData.startTime,
        endTime: bookData.endTime,
        userClerkId: bookData.clerkUserId, //user who created the booking
        name: bookData.name,
        email: bookData.email,
        additionalInfo: bookData.additionalInfo ? bookData.additionalInfo : "",
        eventId: bookData.eventId,
        meetLink: meetLink, //to get the meeting when is
        googleEventId: googleEventId,
      },
    });

    if (!response) {
      throw new Error("Failed to book a meeting. Please try again.");
    }

    return { error: false, data: response };
  } catch (error) {
    console.log("ERROR booking a meet", error);
    return { error: true, data: null };
  }
}
