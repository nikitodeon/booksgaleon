import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoadingRoute() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
      {/* Левая часть - изображения */}
      <div>
        <div className="flex justify-center">
          <Skeleton className="w-[370px] h-[590px] rounded-xl" />
        </div>
        <div className="flex-justify-center   ">
          <div className="flex  justify-center gap-4 mt-6">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-[100px] h-[100px] rounded-md"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Правая часть - информация о продукте */}
      <div>
        <Skeleton className="w-2/3 h-10 rounded-lg" /> {/* Название */}
        <Skeleton className="w-32 h-8 mt-4 rounded-md" /> {/* Цена */}
        {/* Рейтинг (звезды) */}
        <div className="mt-3 flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-6 rounded-full" />
          ))}
        </div>
        <Skeleton className="mt-4 w-full h-[600px] rounded-md" />{" "}
        {/* Описание */}
        {/* Кнопка "Добавить в корзину" */}
        <Skeleton className="w-full h-12 mt-6 rounded-lg" />
      </div>
    </div>
  );
}
