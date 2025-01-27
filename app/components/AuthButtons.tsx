"use client";

import { redirect } from "next/navigation";
import { signInUser, signOutUser } from "../actions/authActions";
import { Button } from "@/components/ui/button";

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

  return <Button onClick={handleSignInRedirect}>Logout</Button>;
}

export function RegisterButton() {
  const handleSignUpRedirect = async () => {
    return redirect("/register");
  };

  return <Button onClick={handleSignUpRedirect}>Logout</Button>;
}
