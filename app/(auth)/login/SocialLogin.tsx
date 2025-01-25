import { socialSignIn } from "@/app/actions/authActions";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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

  const handleSignIn = async (provider: "google" | "github") => {
    await socialSignIn(provider);
  };

  return (
    <div className="flex flex-col gap-2">
      {providers.map((provider) => (
        <button
          key={provider.name}
          className="flex items-center gap-2 justify-center w-full px-4 py-2 bg-gray-100 rounded-md text-sm font-medium shadow-sm hover:bg-gray-200"
          onClick={() => handleSignIn(provider.name as "google" | "github")}
        >
          {provider.icon}
          {provider.text}
        </button>
      ))}
    </div>
  );
}
