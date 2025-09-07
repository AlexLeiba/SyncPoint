import { Event } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDurationInMinutes } from "@/lib/formatDurationInMinutes";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CopyEventLink } from "./CopyEventLink";
import { cn } from "@/lib/utils";

function EventCard({
  data: { title, description, durationInMinutes, id, userClerkId, isActive },
}: {
  data: Event;
}) {
  return (
    <Card className="flex flex-col h-64">
      <CardHeader>
        <CardTitle
          className={cn(
            !isActive && "text-foreground/50",
            "text-3xl line-clamp-1"
          )}
        >
          {title}
        </CardTitle>
        <CardDescription>
          {formatDurationInMinutes(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      {description && (
        <CardContent className={cn(!isActive && "text-foreground/50")}>
          <CardDescription className="text-foreground line-clamp-4">
            {description}
          </CardDescription>
        </CardContent>
      )}
      <CardFooter>
        <div className="flex  justify-end items-end  h-[80px] w-full">
          {/* COPY EVENT LINK */}
          <div className="flex gap-2">
            <CopyEventLink
              disabled={!isActive}
              eventId={id}
              userId={userClerkId}
            />

            {/* EDIT EVENT */}
            <Button variant={"ghost"} size={"lg"} asChild>
              <Link href={`/events/edit-event/${id}`} title="Edit Event">
                <SquarePen className="text-foreground size-5 " />
              </Link>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default EventCard;
