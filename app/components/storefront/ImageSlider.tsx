"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface iAppProps {
  images: string[];
}

export default function ImageSlider({ images }: iAppProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  function handlePreviousClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }

  function handleNextClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }

  function handleImageClick(index: number) {
    setMainImageIndex(index);
  }

  return (
    <div className="grid gap-6 md:gap-3 items-start">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          width={600}
          height={600}
          src={images[mainImageIndex]}
          alt="Product image"
          className="object-contain w-[600px] h-[600px]"
        />

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button onClick={handlePreviousClick} variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button onClick={handleNextClick} variant="ghost" size="icon">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                index === mainImageIndex
                  ? "border-2 border-primary"
                  : "border border-gray-200",
                "relative overflow-hidden rounded-lg cursor-pointer shrink-0 w-[100px] h-[100px]"
              )}
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image}
                alt="Product Image"
                width={100}
                height={100}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
