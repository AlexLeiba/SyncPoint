"use client";
import { newEventSchema, NewEventSchemaType } from "@/lib/zodSchemas";
import React, { useState } from "react";
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
import { createEvent } from "@/server-actions/events";
import { redirect } from "next/navigation";

export function NewEventForm() {
  const [saving, setSaving] = useState(false);
  const formMethods = useForm<NewEventSchemaType>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      name: "",
      description: "",
      durationInMinutes: 30,
      isActive: true,
    },
  });

  async function onSubmit(data: NewEventSchemaType) {
    setSaving(true);
    const response = await createEvent(data);

    if (response.error) {
      formMethods.reset();
      setSaving(false);
      return toast.error("Failed to create event. Please try again.");
    }

    toast.success("Event created successfully!");
    formMethods.reset();

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

        <div className="flex justify-end gap-4">
          <Link href={"/events"}>
            <Button
              disabled={saving}
              size={"lg"}
              type="button"
              variant={"outline"}
            >
              Cancel
            </Button>
          </Link>
          <Button size={"lg"} type="submit" disabled={saving}>
            Create Event
          </Button>
        </div>
      </form>
    </Form>
  );
}
