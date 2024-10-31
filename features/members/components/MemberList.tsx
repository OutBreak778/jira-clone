"use client";

import React, { Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ArrowLeft, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useGetMember } from "../api/use-get-member";
import MemberAvatar from "./MembersAvatar";
import { useDeleteMemberMutation } from "../api/use-delete-member";
import { useUpdateMemberMutation } from "../api/use-update-member";
import { MemberRole } from "../types";
import { useConfirm } from "@/hooks/use-confirm";

const MemberList = () => {
  const workspaceId = useWorksapceId();
  const { data } = useGetMember({ workspaceId });

  const { mutate: deleteMember, isPending: isDeleteMember } =
    useDeleteMemberMutation();
  const { mutate: updateMember, isPending: isUpdateMember } =
    useUpdateMemberMutation();
    
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove Member",
    "This actions is irreversible",
    "destructive"
  );

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    if (!memberId) {
      console.error("Member ID is missing in handleUpdateMember");
      return;
    }
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!memberId) {
      console.error("Member ID is missing in handleDeleteMember");
      return;
    }
    const ok = await confirm();
    if (!ok) {
      return;
    }

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-6 space-y-1">
        <Button
          variant={"outline"}
          size={"icon"}
          className="mr-4 mb-2 absolute"
        >
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold pl-14 -mt-2">
          Members List
        </CardTitle>
      </CardHeader>
      <Separator className="border border-gray-200 my-3" />
      <CardContent className="p-5">
        {data?.documents.map((item, index) => (
          <Fragment key={index}>
            <div className="flex items-center gap-3">
              <MemberAvatar
                name={item.name}
                fallbackString=" text-lg"
                className="size-10 mb-3"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"sm"} className="ml-auto">
                    <MoreVerticalIcon className="size-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium cursor-pointer"
                    onClick={() =>
                      handleUpdateMember(item.$id, MemberRole.ADMIN)
                    }
                    disabled={isUpdateMember}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium cursor-pointer"
                    onClick={() =>
                      handleUpdateMember(item.$id, MemberRole.MEMBER)
                    }
                    disabled={isUpdateMember}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium cursor-pointer text-destructive"
                    onClick={() => handleDeleteMember(item.$id)}
                    disabled={isDeleteMember}
                  >
                    Remove {item.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="border border-gray-200/70 my-3" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default MemberList;
