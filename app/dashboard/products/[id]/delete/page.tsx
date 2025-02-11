import { deleteProduct } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function DeleteRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Вы абсолютно уверены?</CardTitle>
          <CardDescription>
            Это действие будет невозможно отменить. Оно навсегда удалит записи
            из базы данных.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/products">Отменить</Link>
          </Button>
          <form action={deleteProduct}>
            <input type="hidden" name="productId" value={id} />
            <SubmitButton variant="destructive" text="Удалить Продукт" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
