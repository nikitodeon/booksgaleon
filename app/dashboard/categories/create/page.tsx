"use client";

import { createCategory } from "@/app/actions";
// import { UploadDropzone } from "@/app/lib/uploadthing";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, XIcon } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { categorySchema, productSchema } from "@/app/lib/zodSchemas";
import { useState, useEffect } from "react";

import Image from "next/image";
// import { categories } from "@/app/lib/categories";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Category } from "@prisma/client";

export default function ProductCreateRoute() {
  //   const [categories, setCategories] = useState<Category[]>([]);
  //   const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [lastResult, action] = useActionState(createCategory, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: categorySchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  //   useEffect(() => {
  //     async function fetchCategories() {
  //       try {
  //         const response = await fetch("/api/categories");
  //         if (!response.ok) throw new Error("Ошибка загрузки категорий");
  //         const data: Category[] = await response.json();
  //         setCategories(data);
  //       } catch (error) {
  //         console.error(error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }

  //     fetchCategories();
  //   }, []);

  //   const handleDelete = (index: number) => {
  //     setImages(images.filter((_, i) => i !== index));
  //   };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/products">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Category</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            In this form you can create your category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>Title</Label>
              <Input
                type="text"
                key={fields.title.key}
                name={fields.title.name}
                defaultValue={fields.title.initialValue}
                className="w-full"
                placeholder="Category Title"
              />

              <p className="text-red-500">{fields.title.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Create Category" />
        </CardFooter>
      </Card>
    </form>
  );
}
