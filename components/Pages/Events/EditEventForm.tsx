"use client";
import { newEventSchema, NewEventSchemaType } from "@/lib/zodSchemas";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Link from "next/link";
import { deleteEvent, editEvent } from "@/server-actions/events";
import { redirect } from "next/navigation";
import { Event } from "@/app/generated/prisma";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { set } from "zod";
import { X } from "lucide-react";

type Props = {
  eventData: Event | null;
};
export function EditEventForm({ eventData }: Props) {
  const [loading, setLoading] = useState(false);
  const formMethods = useForm<NewEventSchemaType>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      name: eventData?.name || "",
      description: eventData?.description || "",
      durationInMinutes: eventData?.durationInMinutes || 30,
      isActive: eventData?.isActive || true,
    },
  });

  useEffect(() => {
    if (eventData) {
      formMethods.setValue("isActive", eventData.isActive);
    }
  }, [eventData, formMethods]);

  if (!eventData?.id) return redirect("/events");

  async function onSubmit(data: NewEventSchemaType) {
    setLoading(true);
    const response = await editEvent(data, eventData?.id || "");

    if (response.error) {
      formMethods.reset();
      setLoading(false);
      return toast.error("Failed to edit event. Please try again.");
    }

    toast.success("Event edited successfully!");
    formMethods.reset();
    redirect("/events");
  }

  async function handleDelete() {
    setLoading(true);
    if (!eventData?.id) return;

    const response = await deleteEvent(eventData.id);

    if (response.error) {
      setLoading(false);
      return toast.error("Failed to delete event. Please try again.");
    }

    toast.success("Event deleted successfully!");
    redirect("/events");
  }

  return (
    <Form {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={formMethods.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  The name users will see when booking this event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={formMethods.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  The description users will see when booking this event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={formMethods.control}
            name="durationInMinutes"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Duration (in minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    The duration of the event in minutes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={formMethods.control}
            name="isActive"
            render={({ field: { onChange, value } }) => {
              return (
                <FormItem>
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch checked={value} onCheckedChange={onChange} />
                  </FormControl>
                  <FormDescription>
                    If active is enabled, the event will be visible to users.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"lg"} variant={"destructive"}>
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="mb-4">
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogCancel className="absolute top-4 right-4 flex justify-center items-center">
                  <X />
                </AlertDialogCancel>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button disabled={loading} variant={"outline"}>
                    Cancel
                  </Button>
                </AlertDialogCancel>
                <Button
                  disabled={loading}
                  variant={"destructive"}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="flex gap-4">
            <Link href={"/events"}>
              <Button
                size={"lg"}
                type="button"
                variant={"outline"}
                disabled={loading}
              >
                Cancel
              </Button>
            </Link>
            <Button size={"lg"} type="submit" disabled={loading}>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
