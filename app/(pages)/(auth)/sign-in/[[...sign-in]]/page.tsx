import { SignIn } from "@clerk/nextjs";
import React from "react";

function signInPage() {
  return (
    <div className="min-h-[calc(100vh-150px)] flex justify-center items-center flex-col">
      <SignIn />
    </div>
  );
}

export default signInPage;
