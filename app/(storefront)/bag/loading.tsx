// app/cart/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto  min-h-[55vh]">
      {/* Заголовок */}
      <Skeleton className="h-8 w-1/3 mb-6 mx-auto" />

      {/* Скелетон для товаров */}
      <div className="flex flex-col gap-y-10 ">
        {[...Array(1)].map((_, i) => (
          <div key={i} className="flex">
            {/* Изображение товара */}
            <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-md" />
            <div className="ml-5 flex justify-between w-full font-medium">
              {/* Название товара */}
              <Skeleton className="h-6 w-2/5" />
              <div className="flex flex-col items-center justify-between gap-y-4 h-full">
                {/* Цена */}
                <Skeleton className="h-5 w-16" />
                {/* Количество */}
                <Skeleton className="h-8 w-20" />
                {/* Кнопка удаления */}
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Итоговая цена */}
      <div className="mt-10 flex items-center justify-between font-medium">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>

      {/* Кнопка оформления */}
      <div className="mt-4 flex justify-center">
        <Skeleton className="h-12 w-48 rounded-md" />
      </div>
    </div>
  );
}
