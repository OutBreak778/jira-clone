"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { registerSchema } from "../Schema";
import { useRegisterMutation } from "../api/use-register";


const SignUpCard = () => {

  const { mutate } = useRegisterMutation()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    console.log({values})
    mutate({json: values})
  }

  return (
    <Card className="w-full h-full md:w-[520px] border-none shadow-none mb-12">
      <CardHeader className="flex items-center justify-center text-center p-6">
        <CardTitle className="text-3xl">
          Sign-Up to{" "}
          <span className="tracking-wider underline underline-offset-2">
            Outbreak
          </span>
          !
        </CardTitle>
        <CardDescription>
          By signing-up, you agree to out{" "}
          <Link href="/privacy">
            <span className="text-sky-700 hover:underline tracking-tight">
              Privacy Policy
            </span>
          </Link>{" "}
          and{" "}
          <Link href="/terms">
            <span className="text-sky-700 hover:underline tracking-tight">
              Terms of Service
            </span>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Username</Label>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your Full name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <Button disabled={false} size="lg" className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardContent className="text-sm flex items-center justify-center  ">
            <p>Already have an account ?&nbsp;</p>
            <Link className="text-sky-700 hover:underline" href="/sign-in"
            >   
            Sign-in here
            </Link>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
