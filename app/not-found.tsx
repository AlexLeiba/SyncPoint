import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

function NotFoundPage() {
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <h1>404 - Page Not Found</h1>
      <Link href="/">
        <Button>
          Go back home <ArrowRight />
        </Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
