import GridContainer from "@/components/Grid/GridContainer";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const authData = await auth();

  if (authData.userId) {
    redirect("/events");
  }
  return (
    <GridContainer>
      <div className="grid md:grid-cols-2 grid-cols-1 items-center">
        <div className="flex  flex-col gap-4">
          <h1 className=" gradient-title ">Welcome to SyncPoint</h1>
          <p className="text-lg">Your all-in-one google scheduling solution.</p>
          <p>
            Create events, set your availability, and let others book meetings
            with you.
          </p>

          <div className="flex gap-4">
            <Button size={"lg"} asChild variant={"primary"}>
              <div>
                <SignInButton>Get started</SignInButton>
                <ArrowRight />
              </div>
            </Button>
            <Button asChild size={"lg"} variant={"outline"}>
              <SignUpButton />
            </Button>
          </div>
        </div>

        <div>
          <Image
            src={"/sync-point-landing-illustration.webp"}
            alt=""
            width={500}
            height={500}
          />
        </div>
      </div>
    </GridContainer>
  );
}
