import GridContainer from "@/components/Grid/GridContainer";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const authData = await auth();

  if (authData.userId) {
    redirect("/events");
  }
  return (
    <GridContainer>
      <div className="flex place-items-center flex-col gap-4">
        <h1>Welcome to SyncPoint</h1>
        <p className="text-lg">Your all-in-one google scheduling solution.</p>

        <div className="flex gap-4">
          <Button size={"lg"} asChild>
            <SignInButton />
          </Button>
          <Button asChild size={"lg"} variant={"outline"}>
            <SignUpButton />
          </Button>
        </div>
      </div>
    </GridContainer>
  );
}
