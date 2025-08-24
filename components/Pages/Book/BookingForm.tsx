"use client";
import React, { useEffect, useState } from "react";
import { Event } from "@/app/generated/prisma";
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
type Props = {
  availableDays: DataSlotsType;
  error: boolean;
  event: Event;
};
export function BookingForm({ availableDays, event, error }: Props) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>();
  const [selectTime, setSelectedTime] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);

  console.log("🚀 ~ EventDetails ~ availableDays:", availableDays);

  if (error) {
    toast.error("Failed to load event. Please try again.");
  }

  const formMethods = useForm<MeetingSchemaType>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = formMethods;

  async function onSubmit(data: MeetingSchemaType) {
    console.log("data", data);

    const startTime = `${data.date}T${data.time}:00.000Z`;
    const endTime = `${data.date}T${data.time}:00.000Z`;

    const bookData: BookAMeetingType = {
      additionalInfo: data.additionalInfo ? data.additionalInfo : "",
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      name: data.name,
      email: data.email,
      eventId: event.id,
    };
    console.log("🚀 ~ onSubmit ~ bookData:", bookData);
    //     const response = await bookAMeeting(bookData);
    //
    //     if (response.error) {
    //       toast.error("Failed to book a meeting. Please try again.");
    //     }

    //    const startTime =;
    // const endTime = ;
  }

  function handleMonthChange(month: Date) {
    setSelectedMonth(month);
  }

  function handleSelectDay(day: Date | undefined) {
    reset();
    setSelectedDay(day);
  }

  useEffect(() => {
    if (selectedDay) {
      const filteredSlots = availableDays.filter((day) => {
        return day.date === format(selectedDay, "yyyy-MM-dd");
      });
      console.log("🚀 ~ BookingForm ~ filteredSlots:", filteredSlots);

      setSlots(filteredSlots[0]?.slots || []);
    }
  }, [selectedDay]);

  function handleSelectTimeSlot(startTime: string) {
    if (selectedDay) {
      setValue("date", format(selectedDay, "yyyy-MM-dd"));
    }
    if (startTime) {
      setValue("time", startTime);
      setSelectedTime(startTime);
    }
  }

  return (
    <div>
      <div className="flex gap-4 ">
        <div>
          {" "}
          <DayPicker
            disabled={[
              {
                before: new Date(),
                after: new Date(availableDays?.at(-1)?.date as string),
              },
            ]}
            animate
            defaultMonth={selectedMonth}
            month={selectedMonth}
            onMonthChange={handleMonthChange}
            mode="single"
            selected={selectedDay}
            onSelect={handleSelectDay}
            modifiers={{
              available: availableDays?.map((day) => new Date(day.date)),
            }}
            modifiersStyles={{
              available: {
                color: "black",
                backgroundColor: "lightgray",
                borderRadius: "50%",
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
            className="w-full flex flex-col gap-2 mt-4"
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

            <Button size={"lg"} type="submit" className="w-full">
              Book event
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
