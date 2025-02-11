"use client";

import { createCategory } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Atom, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useForm, SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { categorySchema } from "@/app/lib/zodSchemas";
import { useState, useEffect } from "react";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { toast } from "react-toastify";
import { transliterate as tr, slugify } from "transliteration";

export default function CategoryCreateRoute() {
  const [lastResult, action] = useActionState<SubmissionResult<
    string[]
  > | null>(
    async (
      state: SubmissionResult<string[]> | null
    ): Promise<SubmissionResult<string[]> | null> => {
      const formElement = document.getElementById(form.id) as HTMLFormElement;
      if (!formElement) return null;

      const formData = new FormData(formElement);
      return createCategory(state, formData);
    },
    null
  );

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }: { formData: FormData }) {
      return parseWithZod(formData, { schema: categorySchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [title, setTitle] = useState<string>(fields.title.initialValue || "");
  const [slug, setSlugValue] = useState<string | undefined>(undefined);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);

  useEffect(() => {
    if (titleError) setTitleError(null);
  }, [title]);

  useEffect(() => {
    if (slugError) setSlugError(null);
  }, [slug]);

  useEffect(() => {
    if (lastResult?.error?.title) {
      setTitleError(lastResult.error.title[0]);
    } else {
      setTitleError(null);
    }
    if (lastResult?.error?.slug) {
      setSlugError(lastResult.error.slug[0]);
    } else {
      setSlugError(null);
    }
  }, [lastResult]);

  function handleSlugGeneration() {
    if (!title) {
      return toast.error("Сначала создайте название");
    }
    setSlugValue(slugify(tr(title)));
    return toast.success("Slug сгенерирован!");
  }

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/categories">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">
          Новая категория
        </h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Детали Категории</CardTitle>
          <CardDescription>Здесь вы можете создавать категории</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>Название</Label>
              <Input
                type="text"
                key={fields.title.key}
                name={fields.title.name}
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
                placeholder="Название категории"
              />
              {titleError && (
                <p className="text-red-500 text-sm">{titleError}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Label>Slug (URL Идентификатор)</Label>
              <Input
                key={fields.slug.key}
                name={fields.slug.name}
                defaultValue={fields.slug.initialValue}
                placeholder="Поисковой идентификатор (латинские буквы)"
                onChange={(e) => setSlugValue(e.target.value)}
                value={slug}
              />
              <Button
                onClick={handleSlugGeneration}
                className="w-fit"
                variant="secondary"
                type="button"
              >
                <Atom className="size-4 mr-2" /> Сгенерировать Slug
              </Button>
              {slugError && <p className="text-red-500 text-sm">{slugError}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton
            text="Создать Категорию"
            disabled={!!titleError || !!slugError}
          />
        </CardFooter>
      </Card>
    </form>
  );
}
