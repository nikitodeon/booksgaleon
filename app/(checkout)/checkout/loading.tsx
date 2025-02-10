import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-y-10">
      <div className="max-w-7xl mx-auto mt-10">
        {/* Заголовок */}
        <Skeleton className="h-10 w-1/3 mb-8" />

        {/* Кнопка назад */}
        <Skeleton className="h-10 w-24 mb-6" />

        {/* Первый ряд */}
        <div className="flex gap-10">
          {/* Левая часть (сдвинута вправо на 48px) */}
          <div className="flex flex-col gap-10 flex-1 ml-12">
            <Skeleton className="h-80 w-[700px]" />
          </div>

          {/* Правая часть */}
          <div className="flex flex-col gap-10 flex-1">
            <Skeleton className="h-80 w-[350px]" />
          </div>
        </div>

        {/* Второй ряд с увеличенным расстоянием и без правой части */}
        <div className="flex gap-10 mt-40">
          {/* Левая часть второго ряда */}
          <div className="flex flex-col gap-10 flex-1 ml-12">
            <Skeleton className="h-80 w-[700px]" />
          </div>

          {/* Правая часть второго ряда удалена */}
        </div>

        {/* Правая панель (разделена на 2 блока) */}
        <div className="w-[450px] h-[300px] relative mt-10">
          <div className="flex justify-between">
            <Skeleton className="h-full w-[45%]" />
            <Skeleton className="h-full w-[45%]" />
          </div>
        </div>
      </div>
    </div>
  );
}
