"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Copy, CopyCheck, Video } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Meeting } from "@/app/generated/prisma";
import { formatUniqueBookingLink } from "@/lib/formatUniqueBookingLink";
import { parseIsoDateInLocalHoursAndMinutes } from "@/lib/formatDurationInMinutes";

function UserData({
  eventMeetingsData,
  bookedMeetingsData,
}: {
  eventMeetingsData: { data: Meeting[] | null; error: boolean };
  bookedMeetingsData: { data: Meeting[] | null; error: boolean };
}) {
  const { user } = useUser();

  const [copy, setCopy] = useState(false);

  if (eventMeetingsData.error || bookedMeetingsData.error) {
    return toast.error("Failed to get meeting data. Please try again.");
  }

  const bookingLink = formatUniqueBookingLink({
    fullName: user?.fullName,
    id: user?.id,
  });

  function handleCopyLink() {
    window?.navigator.clipboard.writeText(bookingLink).then(() => {
      setCopy(true);
      toast.success("Link was copied!");
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    });
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle className="text-2xl mb-4">
              Welcome, {user?.fullName}
            </CardTitle>

            <div>
              <CardTitle className="mb-2">
                <p className="text-lg">
                  Upcoming event meeting:{" "}
                  {eventMeetingsData.data?.[0]?.startTime ? (
                    eventMeetingsData.data?.[0]?.startTime
                      .toString()
                      .slice(0, 10)
                  ) : (
                    <span className="text-base font-light">
                      No event meeting was found.
                    </span>
                  )}
                </p>
              </CardTitle>

              {eventMeetingsData.data?.[0]?.startTime && (
                <div>
                  <div className="flex gap-3 items-center">
                    <Clock size={18} color="gray" />
                    <div className="flex items-center gap-1">
                      <p>
                        {parseIsoDateInLocalHoursAndMinutes(
                          eventMeetingsData.data?.[0]?.startTime.toISOString()
                        )}
                      </p>
                      <p>-</p>
                      <p>
                        {parseIsoDateInLocalHoursAndMinutes(
                          eventMeetingsData.data?.[0]?.endTime.toISOString()
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Video size={18} color="gray" />

                    <Link
                      href={eventMeetingsData.data?.[0]?.meetLink || ""}
                      target="_blank"
                    >
                      <p className="text-md text-green-500">Join Meeting</p>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div>
                <CardTitle className="mb-2 w-full">
                  <p className="text-lg">
                    Upcoming booked meeting:{" "}
                    {bookedMeetingsData.data?.[0]?.startTime ? (
                      bookedMeetingsData.data?.[0]?.startTime
                        .toString()
                        .slice(0, 10)
                    ) : (
                      <span className="text-base font-light">
                        No booked meeting was found.
                      </span>
                    )}
                  </p>
                </CardTitle>

                {bookedMeetingsData.data?.[0]?.startTime && (
                  <div>
                    <div className="flex gap-3 items-center">
                      <Clock size={18} color="gray" />
                      <div className="flex items-center gap-1">
                        <p>
                          {parseIsoDateInLocalHoursAndMinutes(
                            bookedMeetingsData.data?.[0]?.startTime.toISOString()
                          )}
                        </p>
                        <p>-</p>
                        <p>
                          {parseIsoDateInLocalHoursAndMinutes(
                            bookedMeetingsData.data?.[0]?.endTime.toISOString()
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Video size={18} color="gray" />
                      <Link
                        href={bookedMeetingsData.data?.[0]?.meetLink || ""}
                        target="_blank"
                      >
                        <p className="text-md text-green-500">Join Meeting</p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        {/* TODO: latest updates */}
        {/* TODO add skeletons to all cards */}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your unique booking link</CardTitle>
        </CardHeader>

        <CardContent className="overflow-hidden">
          <div className="flex gap-2 md:items-center md:justify-between md:flex-row flex-col items-start w-full">
            <div>
              <p>{bookingLink}</p>
            </div>

            <Button size={"sm"} onClick={handleCopyLink}>
              {copy ? (
                <>
                  <CopyCheck className="text-green-400" />
                  Link Copied
                </>
              ) : (
                <>
                  <Copy /> Copy Link
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserData;
