import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "./constants";
import { createSessionMiddleware } from "@/lib/appwrite";

export const getCurrent = async () => {
  try {
    // const { account } = await createSessionMiddleware()
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);

    if (!session || !session.value) {
      throw new Error("Unauthorized");
    }

    client.setSession(session.value);

    const account = new Account(client);

    return await account.get();
  } catch (error) {
    console.log(error, "features/auth/actions");
    return null;
  }
};
