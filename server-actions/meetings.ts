"use server";

import { prismaDB } from "@/lib/prismaClient";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function getEventMettingsData(
  type: "upcoming" | "previous" = "upcoming",
  elements?: number
) {
  const { userId } = await auth();

  try {
    if (!userId) {
      throw new Error("User not found");
    }

    const now = new Date();
    const meetings = await prismaDB.meeting.findMany({
      where: {
        userClerkId: userId, //get meetings by user who created the event
        startTime: type === "upcoming" ? { gt: now } : { lte: now },
      },
      orderBy: {
        startTime: "asc",
      },
      take: elements,
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

export async function getBookedMeetingsData(
  type: "upcoming" | "previous" = "upcoming",
  elements?: number
) {
  const { userId } = await auth();

  try {
    if (!userId) {
      throw new Error("User not found");
    }
    const now = new Date();
    const meetings = await prismaDB.meeting.findMany({
      where: {
        bookedClerkId: userId, //get meetings by booked id
        startTime: type === "upcoming" ? { gt: now } : { lte: now },
      },
      orderBy: {
        startTime: "asc",
      },
      take: elements,
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

export async function deleteMeeting(
  meetingId: string,
  googleEventId: string,
  userClerkId: string
) {
  const { userId } = await auth();

  try {
    if (!userId) {
      throw new Error("User not found");
    }

    //Get Google OAuth access token
    const { data } = await (
      await clerkClient()
    ).users.getUserOauthAccessToken(userClerkId, "google");

    const token = data[0]?.token;

    // Set up Google OAuth Client

    const oAuth2Client = new google.auth.OAuth2();

    oAuth2Client.setCredentials({
      access_token: token,
    });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Delete from calendar event
    const resss = await calendar.events.delete({
      calendarId: "primary", //to get primary calendar of the logged user Based on OAuth Token retrieved from Clerk
      eventId: googleEventId,
      sendNotifications: true,
      sendUpdates: "all", //email address of users to notify about canceling the meet
    });

    // Delete from DB event
    const res = await prismaDB.meeting.delete({
      where: { id: meetingId, googleEventId, userClerkId: userClerkId },
    });
    console.log("🚀 ~ deleteMeeting ~ res:", res, "calendar=>>>>>>>", resss);

    return { error: false, data: "Meeting deleted successfully" };
  } catch (error) {
    console.log("ERROR delete meeting: ", error);
    return { error: true, data: null };
  }
}
