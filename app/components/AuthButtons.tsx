"use client";

import { redirect, useRouter } from "next/navigation";
import { signInUser, signOutUser } from "../actions/authActions";
import { Button } from "@/components/ui/button";
import { Router } from "next/router";
import { use } from "react";

export function LogoutButton() {
  const handleSignOut = async () => {
    await signOutUser();
  };

  return <Button onClick={handleSignOut}>Logout</Button>;
}
export function LoginButton() {
  const handleSignInRedirect = async () => {
    return redirect("/login");
  };

  return <Button onClick={handleSignInRedirect}>Login</Button>;
}

export function RegisterButton() {
  const router = useRouter();
  const handleSignUpRedirect = async () => {
    router.push("/register");
  };

  return (
    <Button onClick={handleSignUpRedirect} className="custom-navbar ">
      Вход
    </Button>
  );
}
