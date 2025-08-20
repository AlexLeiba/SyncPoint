import GridContainer from "@/components/Grid/GridContainer";
import { NewEventForm } from "@/components/Pages/Events/NewEventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

function NewEventPage() {
  return (
    <GridContainer>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">New Event</CardTitle>
        </CardHeader>
        <CardContent>
          {/* FORM */}
          <NewEventForm />
        </CardContent>
      </Card>
    </GridContainer>
  );
}

export default NewEventPage;
