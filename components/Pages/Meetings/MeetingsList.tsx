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
import { getMettingsData } from "@/server-actions/meetings";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function MeetingsList({ meetingsData }: { meetingsData: Meeting[] }) {
  console.log("🚀 ~ MeetingsList ~ meetingsData:", meetingsData);
  const [tab, setTab] = useState("upcoming");
  const [meetData, setMeetData] = useState(meetingsData);

  async function handleTabs(tabType: "upcoming" | "previous") {
    setTab(tabType);

    const response = await getMettingsData(tabType);

    if (response.error) {
      return toast.error("Failed to get meeting data. Please try again.");
    }

    response.data && setMeetData(response.data);
  }

  function handleCancelTheMeeting(id: string) {} //TODO delete meeting, using googleMetId
  return (
    <div>
      <Tabs
        defaultValue="account"
        className="w-[400px] py-4"
        onSelect={(e) => {
          console.log("first");
        }}
      >
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

      <div className="grid grid-cols-2 gap-4 h-[450px]">
        {meetData.length > 0 ? (
          meetData.map((meet) => {
            return (
              <Card key={meet.id}>
                <CardHeader>
                  <CardTitle className="text-2xl">1:1 Discussion</CardTitle>
                  <CardDescription className="text-lg text-foreground">
                    with {meet.name}
                  </CardDescription>
                  {meet.additionalInfo && (
                    <CardDescription>{meet.additionalInfo}</CardDescription>
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
                      <p>{format(new Date(meet.startTime), "HH:mm a")}</p>
                      <p>-</p>
                      <p>{format(new Date(meet.startTime), "HH:mm a")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Video size={18} />
                    <Link href={`${meet.meetLink}`} target="_blank">
                      <p className="text-md text-green-500">Join Meeting</p>
                    </Link>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleCancelTheMeeting(meet.id)}
                    variant={"destructive"}
                  >
                    Cancel Meeting
                  </Button>
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
