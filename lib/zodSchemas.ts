import { DAYS_OF_WEEK } from "@/consts";
import * as z from "zod";
export const newEventSchema = z.object({
  title: z.string().min(1, "Required").max(100),
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

export const usernameSchema = z.object({
  username: z
    .string()
    .min(1, "Required")
    .max(20)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});
export type UsernameSchemaType = z.infer<typeof usernameSchema>;
