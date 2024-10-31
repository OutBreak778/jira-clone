"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";
import { useJoinWorkspaceMutation } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorksapceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
  const { mutate, isPending } = useJoinWorkspaceMutation();
  const inviteCode = useInviteCode();
  const workspaceId = useWorksapceId();

  const router = useRouter();

  const handleSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-5">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You've been invited to join <strong>{initialValues.name}</strong>
        </CardDescription>
      </CardHeader>
      <Separator className="border border-gray-200 my-3" />
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-y-3 lg:flex-row flex-col">
          <Button
            variant={"default"}
            asChild
            type="button"
            className="w-full mr-2"
            disabled={isPending}
          >
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full ml-2"
            size="lg"
            variant={"tertiary"}
            disabled={isPending}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinWorkspaceForm;
