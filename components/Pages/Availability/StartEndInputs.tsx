import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form";
import { TIME_SLOTS } from "@/consts";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
export function StartEndInputs({ day }: { day: string }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const watchCheckedDay = useWatch({
    name: `${day}.isAvailable`,
  });

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          !!watchCheckedDay ? "flex" : "hidden",
          " gap-4 items-center"
        )}
      >
        <FormField
          control={control}
          name={`${day}.startTime`}
          render={({ field }) => {
            return (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as unknown as string}
              >
                <SelectTrigger className="w-[120px] cursor-pointer">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Fruits</SelectLabel> */}
                    {TIME_SLOTS.map((slot) => {
                      return (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }}
        />
        to
        <FormField
          control={control}
          name={`${day}.endTime`}
          render={({ field }) => {
            return (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as unknown as string}
              >
                <SelectTrigger
                  className={cn(
                    "w-[120px] cursor-pointer",
                    (errors["endTime" + "-" + day]?.message as string) &&
                      "border-2 border-red-600"
                  )}
                >
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Fruits</SelectLabel> */}
                    {TIME_SLOTS.map((slot) => {
                      return (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }}
        />
      </div>
      <p className="text-destructive text-xs">
        {/* @ts-ignore */}
        {errors[`${day}`]?.startTime?.message as string}
      </p>
    </div>
  );
}
