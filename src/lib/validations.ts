import { z } from "zod";

export const rideFormSchema = z.object({
  title: z
    .string()
    // 5, not 3: the server's RideSchema requires 5 and would reject a shorter
    // title after the form had already accepted it.
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be under 100 characters"),
  type: z.string().min(1, "Please select a ride type"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a start time"),
  startPoint: z
    .string()
    .min(3, "Start point must be at least 3 characters")
    .max(200, "Start point must be under 200 characters"),
  destination: z
    .string()
    .min(3, "Destination must be at least 3 characters")
    .max(200, "Destination must be under 200 characters"),
  maxRiders: z
    .string()
    .refine((val) => !val || (parseInt(val) >= 2 && parseInt(val) <= 50), {
      message: "Max riders must be between 2 and 50",
    }),
  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .or(z.literal("")),
  role: z.string(),
  selectedRoute: z.string().optional().or(z.literal("")),
});

export type RideFormInput = z.infer<typeof rideFormSchema>;

export const validateRideForm = (data: Record<string, unknown>) => {
  const result = rideFormSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = issue.path[0] as string;
      if (!errors[key]) {
        errors[key] = issue.message;
      }
    });
    return { success: false as const, errors };
  }
  return { success: true as const, data: result.data };
};
