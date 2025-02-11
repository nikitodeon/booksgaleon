"use client";
/* eslint-disable */
import Link from "next/link";
import { useState, useEffect } from "react";
import { NavbarLinks } from "./NavbarLinks";

import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { RegisterButton } from "../AuthButtons";
import Image from "next/image";
import { Hero } from "./Hero";
import { ThemeToggle } from "../ThemeToggle";
import { useTheme } from "next-themes";
import { User } from "next-auth";
import SearchBar from "./SearchBar";
import { ShoppingBasket } from "lucide-react";

import { Cart } from "@/app/lib/interfaces";

// Тип данных для пользователя

interface NavbarProps {
  user: User | null; // Пропс для передачи данных о пользователе
  banners: { id: string; imageString: string; title: string }[]; // Пропс для баннеров
  cart: Cart | null;
}

export function Navbar({ user, banners, cart }: NavbarProps) {
  const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const {
    // theme,
    resolvedTheme,
  } = useTheme(); // Получаем текущую тему
  // const [themeLoaded, setThemeLoaded] = useState(false); // Состояние для отслеживания загрузки темы
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const preloadImages = ["/blacklogo.png", "/whitelogo.png"];
    preloadImages.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
    });
  }, []);
  //   if (theme) {
  //     setThemeLoaded(true); // Обновляем состояние, когда тема загружена
  //   }
  // }, [theme]);

  // Если тема не загружена, показываем индикатор загрузки
  // if (!themeLoaded) {
  //   return <div>Загрузка...</div>;
  // }

  // Логика для смены логотипа в зависимости от темы
  const logoPath =
    resolvedTheme === "dark" ? "/blacklogo.png" : "/whitelogo.png";

  return (
    <div>
      <nav className="w-full max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center">
          {/* <div className="navbar-links"> */}
          <NavbarLinks />
          {/* </div> */}
        </div>

        <div className="flex items-center ">
          {user ? (
            <>
              <div className=" ">
                <ThemeToggle />
              </div>
              <div className="mt-[50px] flex flex-col sm:flex sm:flex-row sm:mt-0">
                <div className=" ml-2 mt-2 sm:hidden  ">
                  <UserDropdown
                    email={user.email ?? ""}
                    name={user.name ?? ""}
                    userImage={"/1476975-200.png"}
                    // `https://avatar.vercel.sh/${user.name}`  }
                  />
                </div>
                <Link href="/bag" className="group p-2 flex items-center mr-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-[#B099D3]   hover:bg-[#DCD1EB] text-black "
                  >
                    <ShoppingBasket className="transform scale-150 mt-3 mb-2 ml-4   " />
                    <span className=" text-sm mb-3 mr-4 font-medium ">
                      {total}
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="hidden sm:flex">
                <UserDropdown
                  email={user.email ?? ""}
                  name={user.name ?? ""}
                  userImage={"/1476975-200.png"}
                  // `https://avatar.vercel.sh/${user.name}`  }
                />
              </div>
            </>
          ) : (
            <div className=" flex flex-1 items-center justify-end space-x-2 ">
              <div className="">
                <ThemeToggle />
              </div>
              {/* <LoginButton />
              <span className="h-6 w-px bg-gray-200"></span> */}
              <Button asChild>
                <RegisterButton />
              </Button>
            </div>
          )}
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Левый баннер */}
        {/* <div className="hidden md:flex w-1/4 h-64 bg-gray-100 items-center justify-center">
          <span className="text-gray-500">Левый баннер</span>
        </div> */}

        <div className="hidden md:flex w-1/4 min-h-41 ">
          <div className=" object-contain w-[250px] h-[250px] ml-10 mt-6">
            <Image
              src="/sale.jpg"
              alt="Logo"
              width={250}
              height={250}
              className="mx-auto rounded-lg"
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        </div>
        {/* Логотип */}
        <div className="flex flex-col items-center w-1/2">
          <Link href="/">
            <Image
              src={logoPath} // Логотип меняется в зависимости от темы
              alt="Logo"
              width={250}
              height={250}
              className="mx-auto"
            />
          </Link>
          {/* Описание */}
          <div className="mt-4 text-center text-md text-gray-600  custom-logo-description">
            Ветер в твоих парусах,
            <br /> открывай море историй!
          </div>
          {/* Поле поиска */}
          {/* <div className="mt-4 w-full max-w-md"> */}
          <div className="mx-auto w-full max-w-md  mt-4 hidden md:flex flex-col ">
            <SearchBar />
          </div>
        </div>
        {/* Правый баннер */}
        {/* from-violet-500 to-[#B099D3] bg-gradient-to-r */}
        <div
          className="sm:text-2xl text-center leading-tight text-transparent bg-clip-text  bg-black   text-md custom-top from-violet-500 to-[#B099D3] bg-gradient-to-r "
          style={{
            letterSpacing: "-0.5px",
            lineHeight: "1.1",
            animation: "fadeIn 1.5s ease-in-out",
          }}
        >
          Т<br />о<br />п<br />
          <br />м <br />е<br />с<br />я<br />ц<br />а
        </div>
        <div className="md:flex w-1/4 min-h-41">
          <div className="w-full h-full">
            <Hero banners={banners} />
          </div>
        </div>
      </div>
      <div className="md:hidden flex w-full max-w-md mx-auto mt-4">
        <SearchBar />
      </div>
    </div>
  );
}
