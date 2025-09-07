"use client";
import React, { useEffect, useState } from "react";
import { Event, Meeting } from "@/app/generated/prisma";
import { meetingSchema, type MeetingSchemaType } from "@/lib/zodSchemas";
import {
  bookAMeeting,
  BookAMeetingType,
  DataSlotsType,
} from "@/server-actions/booking";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import Link from "next/link";
type Props = {
  availableDays: DataSlotsType;
  error: boolean;
  event: Event;
};
export function BookingForm({ availableDays, event, error }: Props) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>();
  // const [selectTime, setSelectedTime] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookedData, setBookedData] = useState<Meeting>();

  if (error) {
    toast.error("Failed to load event. Please try again.");
  }

  useEffect(() => {
    // Filter slots according to Selected Day of the current Date
    if (selectedDay) {
      const filteredSlots = availableDays.filter((dayData) => {
        return dayData.date === format(selectedDay, "yyyy-MM-dd");
      });

      setSlots(filteredSlots[0]?.slots || []);
    }
  }, [selectedDay, availableDays]);

  const formMethods = useForm<MeetingSchemaType>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {},
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = formMethods;

  async function onSubmit(data: MeetingSchemaType) {
    setLoading(true);
    toast.loading("Booking a meeting...", { id: "booking" });

    const startTime = `${data.date}T${data.time}`;

    const endTime =
      new Date(startTime).getTime() + event.durationInMinutes * 60 * 1000;

    const bookData: BookAMeetingType = {
      additionalInfo: data.additionalInfo ? data.additionalInfo : "",
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      name: data.name,
      email: data.email,
      eventId: event.id,
      clerkUserId: event.userClerkId,
      userClerkEmail: event.userEmail,
      userClerkName: event.userFullName,
      duration: event.durationInMinutes,
    };

    const response = await bookAMeeting(bookData);

    if (response.error) {
      setLoading(false);
      toast.dismiss("booking");
      toast.error("Failed to book a meeting. Please try again.");
    }

    toast.success("Meeting booked successfully!");
    toast.dismiss("booking");
    setLoading(false);

    response.data && setBookedData(response.data);
  }

  function handleMonthChange(month: Date) {
    setSelectedMonth(month);
  }

  function handleSelectDay(day: Date | undefined) {
    reset();
    setSelectedDay(day);
  }

  function handleSelectTimeSlot(startTime: string) {
    if (selectedDay) {
      setValue("date", format(selectedDay, "yyyy-MM-dd"));
    }
    if (startTime) {
      setValue("time", startTime);
    }
  }

  function handleBookANewMeet() {
    reset();
    setBookedData(undefined);
  }

  if (bookedData) {
    return (
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="text-2xl font-bold">Meeting Booked!</p>
          <p className="text-lg">Thank you for booking a meeting with us.</p>
          <p className="text-lg">
            You will receive all informations on your email!
          </p>

          <div className="flex gap-2 items-center">
            <p>Join the meeting:</p>
            <Link
              href={bookedData.meetLink}
              target="_blank"
              title="Join Meeting"
            >
              <p className="text-green-600 underline">{bookedData.meetLink}</p>
            </Link>
          </div>
        </div>
        <Button onClick={handleBookANewMeet}>Book a new meeting</Button>
      </div>
    );
  }

  return (
    <div className="border-l border-gray-300 pl-6">
      <div className="flex gap-4  ">
        <div>
          <DayPicker
            onMonthChange={handleMonthChange}
            month={selectedMonth}
            onSelect={handleSelectDay}
            selected={selectedDay}
            defaultMonth={selectedMonth}
            className="rdp-day_button-[border:none]"
            disabled={[
              {
                before: new Date(),
                after: new Date(availableDays?.at(-1)?.date as string),
              },
            ]}
            animate
            mode="single"
            modifiers={{
              available: availableDays?.map((day) => new Date(day.date)), //inside modifiers : is as if defined a variable ('available' in this case) with which we can tell what cells to highlight. ITS added to a day when 'day' matches specific conditions.
              selected: selectedDay ? [selectedDay] : [],
            }}
            modifiersStyles={{
              available: {
                //and here related to value (defined in matchers) which represents this variable (available,selected) we can style it.
                color: "black",
                backgroundColor: "rgb(185, 237, 192)", //for each cell that are available in array 'availableDays' will add this style.
                borderRadius: "50%",
              },
              selected: {
                color: "white",
                backgroundColor: "rgb(33, 123, 46)",
                borderRadius: "100%",
              },
            }}
          />
        </div>

        <div className="flex gap-2 flex-wrap w-[200px] max-h-[340px] overflow-y-auto mt-4">
          {slots.length > 0 ? (
            slots.map((slot) => {
              return (
                <Button
                  onClick={() => handleSelectTimeSlot(slot)}
                  size={"lg"}
                  variant={"outline"}
                  className={cn(
                    watch("time") === slot &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                    "p-2 border-px border-muted-foreground"
                  )}
                  key={slot}
                >
                  {slot}
                </Button>
              );
            })
          ) : (
            <div>
              <p className="text-sm">No time available for this date</p>
            </div>
          )}
        </div>
      </div>
      {watch("time") && (
        <Form {...formMethods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-2 mt-4 "
          >
            <label htmlFor="name">Your Name*</label>
            <Input
              type="text"
              {...formMethods.register("name")}
              placeholder="Your Name"
            />
            {errors?.name?.message && (
              <p className="text-destructive text-xs">{errors.name?.message}</p>
            )}

            <label htmlFor="email">Your Email*</label>
            <Input
              type="email"
              {...formMethods.register("email")}
              placeholder="Your Email"
            />
            {errors?.email?.message && (
              <p className="text-destructive text-xs">
                {errors.email?.message}
              </p>
            )}

            <label htmlFor="additionalInfo">Additional Info</label>
            <Textarea
              {...formMethods.register("additionalInfo")}
              placeholder="Additional Info"
            />
            {errors?.additionalInfo?.message && (
              <p className="text-destructive text-xs">
                {errors.additionalInfo?.message}
              </p>
            )}

            <Button
              disabled={loading}
              size={"lg"}
              type="submit"
              className="w-full"
            >
              Book event
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
