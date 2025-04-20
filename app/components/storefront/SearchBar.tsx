import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearching, startTransition] = useTransition();
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    if (!query.trim()) return; // Если query пустое, не выполняем поиск

    const delayDebounce = setTimeout(() => {
      startTransition(() => {
        router.push(`/search?query=${query}`);
      });
    }, 300); // Добавляем задержку, чтобы избежать частых запросов при вводе текста

    return () => clearTimeout(delayDebounce);
  }, [query, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      inputRef?.current?.blur();
    }
  };

  const handleSearchClick = () => {
    if (!query.trim()) return;

    startTransition(() => {
      router.push(`/search?query=${query}`);
    });
  };
  // const [placeholder, setPlaceholder] = useState(
  //   "Название, автор или описание книги..."
  // );

  // useEffect(() => {
  //   const updatePlaceholder = () => {
  //     setPlaceholder(
  //       window.innerWidth < 740
  //         ? "Поиск"
  //         : "Название, автор или описание книги..."
  //     );
  //   };

  //   updatePlaceholder(); // Устанавливаем сразу
  //   window.addEventListener("resize", updatePlaceholder);

  //   return () => window.removeEventListener("resize", updatePlaceholder);
  // }, []);
  return (
    <div className="relative w-full h-14 flex flex-col">
      <div className="relative h-14 z-10 rounded-md">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          className="absolute inset-0 h-full border-2 placeholder-custom "
          placeholder="Название, автор или описание книги..."
        />

        <Button
          size="sm"
          variant="outline"
          onClick={handleSearchClick} // Запуск поиска по клику на лупу
          className="absolute right-0 inset-y-0 h-full rounded-l-none text-black bg-[#B099D3] hover:bg-[#DCD1EB] hover:text-black "
        >
          {isSearching ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Search className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
