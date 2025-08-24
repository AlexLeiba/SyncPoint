import GridContainer from "@/components/Grid/GridContainer";
import { AvailabilityForm } from "@/components/Pages/Availability/AvailabilityForm";
import { Button } from "@/components/ui/button";
import { getAvailability } from "@/server-actions/availability";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

async function AvailabilityPage() {
  const availabilityData = await getAvailability();

  return (
    <GridContainer>
      <div className="flex justify-between">
        <h2 className="gradient-title">Availability</h2>
        <Button asChild size={"lg"}>
          <Link href="/events/new-event">
            <CalendarPlus /> New Event
          </Link>
        </Button>
      </div>
      <div className="w-full h-px bg-muted-foreground my-8"></div>

      {availabilityData.data && <AvailabilityForm {...availabilityData.data} />}
    </GridContainer>
  );
}

export default AvailabilityPage;
