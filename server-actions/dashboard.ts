"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

// export async function updateUsername(username: string) {
//   const { userId } = await auth();
//
//   if (!userId) {
//     return { error: true, data: null };
//   }
//
//   try {
//     await clerkClient.users.updateUser(userId, { username });
//     return {
//       error: false,
//       data: { username },
//     };
//   } catch (error) {
//     console.log("error", error);
//     return { error: true, data: null };
//   }
// }
