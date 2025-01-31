import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ShoppingBagIcon } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
// import {
//   LoginLink,
//   RegisterLink,
// } from "@kinde-oss/kinde-auth-nextjs/components";
// import { redis } from "@/app/lib/redis";
// import { Cart } from "@/app/lib/interfaces";
import { auth } from "@/auth";
import { LoginButton, RegisterButton } from "../AuthButtons";
import Image from "next/image";
import { Hero } from "./Hero";
export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  //   const cart: Cart | null = await redis.get(`cart-${user?.id}`);

  //   const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Левый баннер */}
        <div className="hidden md:flex w-1/4 h-24 bg-gray-100 items-center justify-center">
          <span className="text-gray-500">Левый баннер</span>
        </div>

        {/* Логотип */}
        <div className="flex flex-col items-center w-1/2">
          <Link href="/">
            <Image
              src="/endlogo.png" // Путь к вашему логотипу
              alt="Logo"
              width={250}
              height={250}
              className="mx-auto"
            />
          </Link>
          {/* Описание */}
          <p className="mt-4 text-center text-md text-gray-600 font-moondance">
            Ветер в твоих парусах,
            <br /> открывай море историй!
          </p>
          {/* Поле поиска */}
          <div className="mt-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Найти книги..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Правый баннер */}
        <div className=" md:flex w-1/4 min-h-41    ">
          <div className="w-full h-full">
            <Hero />
          </div>
        </div>
      </div>
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center">
          <NavbarLinks />
        </div>

        <div className="flex items-center">
          {user ? (
            <>
              <Link href="/bag" className="group p-2 flex items-center mr-2">
                <ShoppingBagIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                  {/* {total} */}
                </span>
              </Link>

              <UserDropdown
                email={user.email as string}
                name={user.name as string}
                userImage={`https://avatar.vercel.sh/${user.name}`}
              />
            </>
          ) : (
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-2">
              <LoginButton />
              <span className="h-6 w-px bg-gray-200"></span>
              <Button variant="ghost" asChild>
                <RegisterButton />
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
