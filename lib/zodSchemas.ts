import { DAYS_OF_WEEK } from "@/consts";
import * as z from "zod";
export const newEventSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  durationInMinutes: z
    .number()
    .int()
    .positive("Duration must be greater than 0")
    .min(1)
    .max(
      60 * 12,
      `Duration must be less than 12 hours or (${60 * 12} minutes)`
    ),
});

export type NewEventSchemaType = z.infer<typeof newEventSchema>;

export const newScheduleSchema = z
  .object({
    timezone: z.string().min(1, "Required"),
    availabilities: z.array(
      z.object({
        startTime: z.string().min(1, "Required"),
        endTime: z.string().min(1, "Required"),
        dayOfWeek: z.enum(DAYS_OF_WEEK),
      })
    ),
  })
  .superRefine(({ availabilities }, ctx) => {
    availabilities.forEach((element) => {
      if (element.startTime > element.endTime) {
        ctx.addIssue({
          code: "custom",
          message: "Start time must be before end time",
        });
      }
    });
  });

export type NewScheduleSchemaType = z.infer<typeof newScheduleSchema>;
