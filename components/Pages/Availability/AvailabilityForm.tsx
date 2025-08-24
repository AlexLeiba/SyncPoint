"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { DAYS_OF_WEEK } from "@/consts";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { availabilitySchema, AvailabilitySchemaType } from "@/lib/zodSchemas";
import { StartEndInputs } from "./StartEndInputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAvailability } from "@/server-actions/availability";
import toast from "react-hot-toast";

export function AvailabilityForm(initialData: AvailabilitySchemaType) {
  console.log("🚀 ~ AvailabilityForm ~ initialData:", initialData);
  const formMethods = useForm<AvailabilitySchemaType>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });

  async function onSubmit(data: AvailabilitySchemaType) {
    toast.loading("Updating availability...", { id: "availability" });

    console.log("🚀 ~ onSubmit ~ data:", data);

    const response = await updateAvailability(data);

    if (response?.error) {
      toast.dismiss("availability");
      return toast.error("Failed to update availability. Please try again.");
    }

    toast.dismiss("availability");
    toast.success("Availability updated successfully!");
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...formMethods}>
        <form
          action=""
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {DAYS_OF_WEEK.map((day) => {
            return (
              <div key={day} className="flex gap-12 items-center h-full">
                <div className="flex items-center gap-4">
                  <FormField
                    control={formMethods.control}
                    name={`${day}.isAvailable`}
                    render={({ field }) => {
                      return (
                        <FormItem key={day}>
                          <FormControl>
                            <Checkbox
                              className="cursor-pointer size-5"
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <label htmlFor={day}>
                    <p className="text-xl">
                      {day.at(0)?.toUpperCase() + day.slice(1)}
                    </p>
                  </label>
                </div>

                <FormProvider {...formMethods}>
                  <StartEndInputs day={day} />
                </FormProvider>
              </div>
            );
          })}

          <div className="flex flex-col w-1/2 gap-2 mt-8">
            <p>Minimum gap before booking new meeting (minutes)</p>

            <FormField
              control={formMethods.control}
              name={"timeGap"}
              render={({ field }) => {
                return (
                  <Input
                    type="number"
                    value={field.value as unknown as string}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                    }}
                  />
                );
              }}
            />
            <p className="text-destructive text-xs">
              {formMethods.formState.errors?.timeGap?.message}
            </p>

            <Button type="submit">Update Availability</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
