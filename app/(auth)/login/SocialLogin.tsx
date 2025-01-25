import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SocialLogin() {
  const providers = [
    {
      name: "google",
      icon: <FcGoogle size={20} />,
      text: "Google",
    },
    {
      name: "github",
      icon: <FaGithub size={20} />,
      text: "GitHub",
    },
  ];

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex items-center w-full gap-2">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          size="lg"
          className="w-full"
          onClick={() => onClick(provider.name as "google" | "github")}
        >
          {provider.icon}
        </Button>
      ))}
    </div>
  );
}
