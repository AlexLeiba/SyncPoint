"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Meeting } from "@/app/generated/prisma";
import { Calendar, Clock, Video } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteMeeting,
  getBookedMeetingsData,
} from "@/server-actions/meetings";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { parseIsoDateInLocalHoursAndMinutes } from "@/lib/formatDurationInMinutes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function MyBookedMeetingsList({
  meetingsData,
}: {
  meetingsData: Meeting[];
}) {
  const [tab, setTab] = useState("upcoming");
  const [meetData, setMeetData] = useState(meetingsData);

  async function handleTabs(tabType: "upcoming" | "previous") {
    setTab(tabType);

    const response = await getBookedMeetingsData(tabType);

    if (response.error) {
      return toast.error("Failed to get meeting data. Please try again.");
    }

    response.data && setMeetData(response.data);
  }

  async function handleCancelTheMeeting(
    eventId: string,
    googleEventId: string,
    userClerkId: string
  ) {
    const response = await deleteMeeting(eventId, googleEventId, userClerkId);

    if (response.error) {
      return toast.error("Failed to delete meeting. Please try again.");
    }

    const responseNewMeetingsData = await getBookedMeetingsData("upcoming");

    if (responseNewMeetingsData.error) {
      return toast.error("Failed to get meeting data. Please try again.");
    }

    toast.success("Meeting deleted successfully!");

    setMeetData(responseNewMeetingsData.data as Meeting[]);
  } //TODO delete meeting, using googleMeetId
  return (
    <div>
      <Tabs defaultValue="upcoming" className="w-[400px] py-4">
        <TabsList>
          <TabsTrigger
            defaultValue={tab}
            onClick={() => handleTabs("upcoming")}
            className="cursor-pointer"
            value="upcoming"
          >
            Upcoming
          </TabsTrigger>
          <TabsTrigger
            onClick={() => handleTabs("previous")}
            className="cursor-pointer"
            value="previous"
          >
            Previous
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 min-h-[300px]">
        {meetData.length > 0 ? (
          meetData.map((meet) => {
            return (
              <Card key={meet.id}>
                <CardHeader>
                  <CardTitle className="text-2xl">1:1 Discussion</CardTitle>
                  <CardDescription className="text-lg text-foreground line-clamp-1">
                    with {meet.userClerkName}
                  </CardDescription>
                  {meet.userClerkEmail && (
                    <CardDescription className="line-clamp-2">
                      {meet.userClerkEmail}
                    </CardDescription>
                  )}
                  {meet.additionalInfo && (
                    <CardDescription className="line-clamp-3">
                      {meet.additionalInfo}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 items-center">
                    <Calendar size={18} />
                    <p>{format(meet.startTime, "MMMM dd, yyyy")}</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Clock size={18} />
                    <div className="flex items-center gap-1">
                      <p>
                        {parseIsoDateInLocalHoursAndMinutes(
                          meet.startTime.toISOString()
                        )}
                      </p>
                      <p>-</p>
                      <p>
                        {parseIsoDateInLocalHoursAndMinutes(
                          meet.endTime.toISOString()
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Video size={18} />
                    <Link href={`${meet.meetLink}`} target="_blank">
                      <p className="text-md text-green-500">Join Meeting</p>
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="h-full">
                  <div className="flex justify-end items-end w-full h-full">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant={"destructive"}>Cancel Meeting</Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your meeting.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-700 hover:bg-red-500"
                            onClick={() =>
                              handleCancelTheMeeting(
                                meet.id,
                                meet.googleEventId,
                                meet.userClerkId
                              )
                            }
                          >
                            Cancel meeting
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div>No meetings was found.</div>
        )}
      </div>
    </div>
  );
}
