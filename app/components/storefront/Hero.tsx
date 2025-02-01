// Hero.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Тип данных для баннера
interface Banner {
  id: string;
  imageString: string;
  title: string;
}

function getMedalColor(title: string) {
  switch (title) {
    case "1":
      return "bg-[#FFD700]"; // Золотая медаль
    case "2":
      return "bg-[#C0C0C0]"; // Серебряная медаль
    case "3":
      return "bg-[#CD7F32]"; // Бронзовая медаль
    default:
      return "bg-gray-400"; // Серый, если не 1, 2 или 3
  }
}

interface HeroProps {
  banners: Banner[]; // Получаем баннеры через пропс
}

export function Hero({ banners }: HeroProps) {
  return (
    <Carousel>
      <CarouselContent>
        {banners.map((item) => (
          <CarouselItem key={item.id}>
            <div className=" h-[17rem] relative">
              <Image
                alt="Banner Image"
                src={item.imageString}
                fill
                className="object-contain w-full h-full rounded-xl"
              />
              <div
                className={`absolute bottom-6 left-9  flex items-center justify-center ${getMedalColor(
                  item.title
                )} text-[#070247] w-[3rem] h-[3rem] rounded-full shadow-lg border-4 border-[#d4af37]transition-transform hover:scale-105`}
              >
                <h1 className="text-[1.7rem] font-bold  font-moondance">
                  {item.title}
                </h1>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-16" />
      <CarouselNext className="mr-16" />
    </Carousel>
  );
}
