import GridContainer from "@/components/Grid/GridContainer";
import UserData from "@/components/Pages/Dashboard/UserData";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

async function DashboardPage() {
  return (
    <GridContainer>
      <div className="flex justify-between">
        <h2 className="gradient-title">Dashboard</h2>
        <Button asChild size={"lg"} variant={"primary"}>
          <Link href="/events/new-event">
            <CalendarPlus /> New Event
          </Link>
        </Button>
      </div>
      <div className="w-full h-px bg-muted-foreground my-8"></div>

      <UserData />
    </GridContainer>
  );
}

export default DashboardPage;
