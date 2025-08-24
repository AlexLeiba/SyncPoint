"use client";

import Image from "next/image";
import React from "react";

export function UserData({
  userData: { userImage, userFullName },
}: {
  userData: { userImage: string; userFullName: string };
}) {
  if (!userFullName && !userImage)
    return (
      <div className="flex items-center flex-col">
        <div className="rounded-full relative size-32 overflow-hidden bg-accent"></div>

        <div className="mt-2 w-32 h-4 bg-accent" />

        <div className="mt-2 h-6 w-64 bg-accent"></div>
      </div>
    );

  return (
    <div className="flex justify-center">
      <div className="flex items-center flex-col">
        {userImage && (
          <div className="rounded-full relative size-32 overflow-hidden">
            <Image src={userImage} alt="avatar" fill />
          </div>
        )}

        <h4>{userFullName}</h4>

        <p className="text-xl text-muted-foreground">
          Welcome to my bookings page, Please select an event below to book a
          call
        </p>
      </div>
    </div>
  );
}
