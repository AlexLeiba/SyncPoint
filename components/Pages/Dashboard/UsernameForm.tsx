"use client";
import { Input } from "@/components/ui/input";
import { usernameSchema, UsernameSchemaType } from "@/lib/zodSchemas";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export function UsernameForm() {
  const { user } = useUser();

  const formMethods = useForm<UsernameSchemaType>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  //   async function onSubmit(data: UsernameSchemaType) {
  //     console.log("first", data);
  //
  //     const dataa = await updateUsername(data.username);
  //     console.log("🚀 ~ onSubmit ~ dataa:", dataa);
  //   }

  useEffect(() => {
    formMethods.setValue("username", user?.username || "");
  }, [user, formMethods]);

  return (
    <div className="flex gap-2 items-center">
      <p>{window.location.origin}</p>
      <div className="flex flex-col gap-1 w-full">
        <Input placeholder="Username" {...formMethods.register("username")} />
        <p className="text-destructive text-xs">
          {formMethods.formState.errors.username?.message}
        </p>
      </div>
    </div>
  );
}
