"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CopyCheck } from "lucide-react";
import toast from "react-hot-toast";

function UserData() {
  const { user } = useUser();

  const [copy, setCopy] = useState(false);

  const bookingLink = user ? `${location.origin}/book/${user?.id}` : "";

  function handleCopyLink() {
    window?.navigator.clipboard.writeText(bookingLink).then(() => {
      setCopy(true);
      toast.success("Link was copied!");
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    });
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.fullName}</CardTitle>
        </CardHeader>

        {/* TODO: latest updates */}
        {/* TODO add skeletons to all cards */}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your unique link</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex gap-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <p>{bookingLink}</p>
            </div>

            <Button size={"sm"} onClick={handleCopyLink}>
              {copy ? (
                <>
                  <CopyCheck className="text-green-400" />
                  Link Copied
                </>
              ) : (
                <>
                  <Copy /> Copy Link
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserData;
