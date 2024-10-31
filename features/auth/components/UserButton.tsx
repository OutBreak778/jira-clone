"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useLogoutMutation } from "../api/use-logout";
import { useCurrent } from "../api/use-current";
import { Loader2, LogOutIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const {mutate: logout} = useLogoutMutation()
  if (!user) return null;

  const { name, email } = user;

  const avatarFallback = name.charAt(0).toUpperCase();

  if (isLoading) {
    <div className="size-10 rounded-full flex justify-center bg-neutral-700 border border-neutral-400">
      <Loader2 className="size-4 animate-spin text-muted-foreground" />
    </div>;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className="size-10 hover:scale-95 opacity-100 cursor-pointer transition-all border border-neutral-200">
          <AvatarFallback className="bg-neutral-100 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2py-4">
          <Avatar className="size-[52px] opacity-90 cursor-pointer transition border border-neutral-200">
            <AvatarFallback className="bg-neutral-100 text-xl font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center justify-center flex-col">
            <p className="text-sm font-medium text-neutral-900">
              {name || "User"}
            </p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
        <Separator className="my-2" />
        <DropdownMenuItem onClick={() => logout()} className="h-10 cursor-pointer transition-all ease-in-out flex items-center justify-center text-amber-700 font-medium">
            <LogOutIcon className="size-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
