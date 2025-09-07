"use client";
import { Button } from "@/components/ui/button";
import { Copy, CopyCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  eventId: string;
  userId: string;
  disabled: boolean;
};
export function CopyEventLink({ eventId, userId, disabled }: Props) {
  const [copied, setCopied] = useState("");

  function handleCopyLink() {
    window.navigator.clipboard
      .writeText(
        `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}/${userId}`
      )
      .then(() => {
        setCopied(eventId);
        toast.success("Event link copied!");
      })
      .catch(() => {
        toast.error("Failed to copy event link.");
      });
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopied("");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [copied]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCopied("");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [copied]);

  return (
    <Button
      disabled={disabled}
      variant={"outline"}
      size={"lg"}
      title="Copy Event Link"
      onClick={handleCopyLink}
    >
      {copied && eventId === copied ? (
        <>
          <CopyCheck className=" size-5 text-green-600 " />
        </>
      ) : (
        <Copy className="text-foreground size-5 " />
      )}
    </Button>
  );
}
