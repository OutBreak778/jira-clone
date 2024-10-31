import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../utilts";
import { Database_ID, Members_ID } from "../../../config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ errro: "Unauthorized access" }, 401);
      }

      const members = await databases.listDocuments(Database_ID, Members_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      const populateMember = await Promise.all(
        members.documents.map(async (item) => {
          const user = await users.get(item.userId);

          return {
            ...user,
            name: user.name,
            email: user.email,
          };
        })
      );

      return c.json({
        data: {
          ...members,
          documents: populateMember,
        },
      });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      Database_ID,
      Members_ID,
      memberId
    );

    const allMembers = await databases.listDocuments(Database_ID, Members_ID, [
      Query.equal("workspaceId", memberToDelete.workspaceId),
    ]);

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized access" }, 401);
    }

    if (allMembers.total === 1) {
      return c.json({ error: "Cannot delete the only user" }, 400);
    }

    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized access" }, 401);
    }

    await databases.deleteDocument(Database_ID, Members_ID, memberId);

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        role: z.nativeEnum(MemberRole),
      })
    ),
    async (c) => {
      const { memberId } = c.req.param();
      const user = c.get("user");
      const databases = c.get("databases");
      const { role } = c.req.valid("json");
      console.log("Updating member with ID:", memberId);

      const memberToUpdate = await databases.getDocument(
        Database_ID,
        Members_ID,
        memberId
      );

      console.log("memeber updated: ",memberToUpdate)
      if (!memberToUpdate) {
        return c.json({ error: "Member not found" }, 404);
      }
      const allMembers = await databases.listDocuments(
        Database_ID,
        Members_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized access" }, 401);
      }

      if (allMembers.total === 1) {
        return c.json({ error: "Cannot downgrade the only user" }, 400);
      }

      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized access" }, 401);
      }

      await databases.updateDocument(Database_ID, Members_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;
