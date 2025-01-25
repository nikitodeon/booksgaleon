"use client";

import { signOutUser } from "../actions/authActions";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const handleSignOut = async () => {
    await signOutUser();
  };

  return <Button onClick={handleSignOut}>Logout</Button>;
}
