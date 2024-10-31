import { Query } from "node-appwrite";
import { Database_ID, Members_ID, Workspace_ID } from "@/config";
import { getMember } from "../members/utilts";
import { Workspace } from "./type";
import { createSessionMiddleware } from "@/lib/appwrite";

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionMiddleware()

    const user = await account.get();

    const member = await databases.listDocuments(Database_ID, Members_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (!member.documents) {
      return { documents: [], total: 0 };
    }

    const workspaceIds = member.documents.map((item) => item.workspaceId);

    const workspaces = await databases.listDocuments(
      Database_ID,
      Workspace_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return workspaces;
  } catch (error) {
    console.log(error, "features/auth/actions");
    return { documents: [], total: 0 };
  }
};

interface getWorkspaceProps {
  workspaceId: string
}

export const getWorkspace = async ({workspaceId}: getWorkspaceProps) => {
  try {
    const { account, databases } = await createSessionMiddleware()
    
    const user = await account.get();
    
    const member = await getMember(({
      databases,
      userId: user.$id,
      workspaceId
    }))

    if(!member) return null

    const workspaces = await databases.getDocument<Workspace>(
      Database_ID,
      Workspace_ID,
      workspaceId
    );

    return workspaces;
  } catch (error) {
    console.log(error, "features/auth/actions");
    return null
  }
};

interface getWorkspaceInfoProps {
  workspaceId: string
}

export const getWorkspaceInfo = async ({workspaceId}: getWorkspaceInfoProps) => {
  try {
    const { databases } = await createSessionMiddleware()
    

    const workspaces = await databases.getDocument<Workspace>(
      Database_ID,
      Workspace_ID,
      workspaceId
    );

    return {name: workspaces.name};
  } catch (error) {
    console.log(error, "features/auth/actions");
    return null
  }
};
