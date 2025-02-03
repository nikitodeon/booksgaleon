"use client";

import { updateCategory } from "@/app/actions";
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
import { useState } from "react";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { toast } from "react-toastify";
import { transliterate as tr, slugify } from "transliteration";

interface CategoryData {
  id: string;
  title: string;
  slug: string;
}

export function EditForm({ data }: { data: CategoryData }) {
  const [lastResult, action] = useActionState<SubmissionResult<
    string[]
  > | null>(
    async (
      state: SubmissionResult<string[]> | null,
      formData?: FormData
    ): Promise<SubmissionResult<string[]> | null> => {
      if (!formData) return state;
      return updateCategory(state, formData, data.id);
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

  const [title, setTitle] = useState<string>(data.title || "");
  const [slug, setSlugValue] = useState<string>(data.slug || "");

  function handleSlugGeneration() {
    if (!title) {
      return toast.error("Please create a title first");
    }
    setSlugValue(slugify(tr(title)));
    return toast.success("Slug has been created");
  }

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/categories">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Edit Category</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Update your category details below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>Title</Label>
              <Input
                type="text"
                key={fields.title.key}
                name={fields.title.name}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
                placeholder="Category Title"
              />
              <p className="text-red-500">{fields.title.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Slug</Label>
              <Input
                key={fields.slug.key}
                name={fields.slug.name}
                value={slug}
                onChange={(e) => setSlugValue(e.target.value)}
                className="w-full"
                placeholder="Category Slug"
              />
              <Button
                onClick={handleSlugGeneration}
                className="w-fit"
                variant="secondary"
                type="button"
              >
                <Atom className="size-4 mr-2" /> Generate Slug
              </Button>
              <p className="text-red-500 text-sm">{fields.slug.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Update Category" />
        </CardFooter>
      </Card>
    </form>
  );
}
