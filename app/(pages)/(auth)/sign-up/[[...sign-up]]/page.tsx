import { SignUp } from "@clerk/nextjs";
import React from "react";

function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-150px)] flex justify-center items-center flex-col">
      <SignUp forceRedirectUrl={"/dashboard"} />
    </div>
  );
}

export default SignUpPage;
