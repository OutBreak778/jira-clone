"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { LoginSchema } from "../Schema";
import { useLoginMutation } from "../api/use-login";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

const SignInCard = () => {

  const { mutate, isPending } = useLoginMutation()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    mutate({
      json: values
    })
  };

  return (
    <Card className="w-full h-full md:w-[520px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-6">
        <CardTitle className="text-3xl">
          Sign-In to{" "}
          <span className="tracking-wider underline underline-offset-2">
            Outbreak
          </span>
          !
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button disabled={isPending} size="lg" className={cn("w-full")}>
              {isPending ? <div className="flex items-center"><Loader2Icon className="size-4 animate-spin mr-2" />Loading</div> : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardContent className="text-sm flex items-center justify-center  ">
            <p>Don't have an account ?&nbsp;</p>
            <Link className="text-sky-700 hover:underline" href="/sign-up"
            >   
            Sign-up here
            </Link>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
