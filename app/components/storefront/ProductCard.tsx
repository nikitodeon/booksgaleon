"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import Image from "next/image";
import Link from "next/link";
// import { useEffect, useState } from "react";

interface iAppProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: string;
    images: string[];
  };
}

interface iAppPropsTwo {
  category?: { id: string; title: string; createdAt: Date; slug: string }; // Сделано опциональным
  item: {
    id: string;
    name: string;
    description: string;
    status: ProductStatus;
    price: Decimal;
    images: string[];
    isFeatured: boolean;
    createdAt: Date;
    categoryId: string;
  };
}

export function ProductCard({ item }: iAppProps | iAppPropsTwo) {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 3000); // 3 секунды задержки
  // }, []);
  return (
    <div className="rounded-lg ">
      <Carousel className="w-full  mx-auto h-[240px] sm:h-[330px]">
        <CarouselContent>
          {item.images.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[270px] sm:h-[330px]">
                <Image
                  src={item}
                  alt="Product Image"
                  fill
                  className="object-contain w-full  rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious small className="ml-16" />
        <CarouselNext small className="mr-16" />
      </Carousel>

      <div className="flex justify-between items-center sm:mt-2 ">
        <h1 className="font-semibold  text-xs sm:text-xl customline-clamp-2   sm:customline-clamp-3 custom">
          <Link href={`/product/${item.id}`}>{item.name}</Link>
        </h1>
        <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 sm:text-xs text-xxs font-medium text-primary ring-1 ring-inset ring-primary/10">
          {item.price.toString()} BYN
        </h3>
      </div>
      <p className="text-gray-600      text-xxs sm:text-sm mt-2 customline-clamp-2 custom-description">
        <Link href={`/product/${item.id}`}>{item.description}</Link>
      </p>

      <Button
        asChild
        className="w-full mt-5  bg-[#B099D3]   hover:bg-[#DCD1EB]  text-black "
      >
        <Link className="   " href={`/product/${item.id}`}>
          <span className="small-custom-button sm:custom-button">
            Подробнее
          </span>
        </Link>
      </Button>
    </div>
  );
}

export function LoadingProductCard() {
  return (
    <div className="rounded-lg">
      {/* Карусель изображений */}
      <div className="w-full mx-auto">
        <div className="relative h-[280px]">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      </div>

      {/* Заголовок и цена */}
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-6 w-3/4" /> {/* Заголовок */}
        <Skeleton className="h-6 w-20" /> {/* Цена */}
      </div>

      {/* Описание */}
      <Skeleton className="w-full h-6 mt-2" />

      {/* Кнопка "Подробнее" */}
      <Skeleton className="w-full h-10 mt-5 rounded-md" />
    </div>
  );
}
