"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  dob: z.date().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

/**
 * Renders a user account form with validation.
 *
 * Includes:
 * - Name input with min/max length validation
 * - Date of birth picker with disabled past/future limits
 * - Language select (defined in schema but not yet rendered)
 * - Submit handler displays data in a toast (mock behavior)
 *
 * Uses Zod for schema validation and React Hook Form for form state.
 *
 * @returns The account form UI component.
 */
import { updateAccountSettings } from "@/lib/db-actions";

export function AccountForm({
  profileIdForRoute,
  initial,
}: {
  profileIdForRoute: string;
  initial?: { name?: string; dob?: Date };
}) {
  const router = useRouter();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      dob: initial?.dob,
    },
  });

  async function onSubmit(data: AccountFormValues) {
    const res = await updateAccountSettings({
      name: data.name.trim(),
      birthday: data.dob ? data.dob.toISOString().slice(0, 10) : undefined,
    });

    if (res.success) {
      toast({ title: "Saved", description: "Your account settings were updated." });
    } else {
      toast({
        title: "Update failed",
        description: res.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in 
				emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date of birth */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
						{field.value ? (
							format(field.value, "PPP")
						) : (
							<span>Pick a date</span>
						)}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
				Your date of birth is used to calculate your age.
				</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            className="bg-red-300 text-primary-foreground hover:bg-red-300/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Update account"}

    if (res.success) {
      toast({ title: "Saved", description: "Your account settings were updated." });
    } else {
      toast({
        title: "Update failed",
        description: res.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in 
				emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date of birth */}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
						{field.value ? (
							format(field.value, "PPP")
						) : (
							<span>Pick a date</span>
						)}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
				Your date of birth is used to calculate your age.
				</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            className="bg-red-300 text-primary-foreground hover:bg-red-300/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Update account"}
          </Button>

          <Button
            type="button"
            className="bg-red-300 text-primary-foreground hover:bg-red-300/90"
            onClick={() => router.push(`/home/profile/${profileIdForRoute}`)}
          >
            ← Back to Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
