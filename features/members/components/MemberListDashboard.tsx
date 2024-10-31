"use client";

import React, { Fragment } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { useWorksapceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMember } from "../api/use-get-member";
import MemberAvatar from "./MembersAvatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MemberListDashboard = () => {
  const workspaceId = useWorksapceId();
  const { data } = useGetMember({ workspaceId });

  return (
    <Card className="w-full mt-3 h-full border-none shadow-none">
      <CardHeader className="flex gap-x-4 p-6 space-y-1">
        <CardTitle className="flex items-start justify-start text-xl font-bold -mt-3">
          Members List &nbsp; ({data?.total})
        </CardTitle>
      </CardHeader>
      <Separator className="border border-gray-200" />
      <CardContent className="p-5">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-1">
          {data?.documents.map((item, index) => (
            <li key={index}>
              <Card className="flex flex-col gap-3 space-y-3 bg-white px-4 py-1 rounded-lg">
                <CardContent className="p-3 flex flex-col items-center gap-x-3">
                  <MemberAvatar
                    name={item.name}
                    fallbackString=" text-lg"
                    className="size-10 mb-1"
                  />
                  <div className="flex flex-col items-center gap-y-0 w-full">
                    <p className="text-md font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex items-center gap-x-2">
        <Button variant={"outline"} className="w-full">
          <Link href={`/workspaces/${workspaceId}/members`}>Show all</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberListDashboard;
