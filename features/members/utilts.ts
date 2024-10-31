import { Database_ID, Members_ID } from "@/config";
import { Query, type Databases } from "node-appwrite";

interface GetWorkspaceProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export const getMember = async ({
  databases,
  userId,
  workspaceId,
}: GetWorkspaceProps) => {
  const member = await databases.listDocuments(Database_ID, Members_ID, [
    Query.equal("workspaceId", workspaceId),
    Query.equal("userId", userId),
  ]);

  return member.documents[0];
};
