import GridContainer from "@/components/Grid/GridContainer";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

function AvailabilityPage() {
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
    </GridContainer>
  );
}

export default AvailabilityPage;
