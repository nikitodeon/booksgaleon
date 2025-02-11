import { addItem } from "@/app/actions";
import {
  ShoppingBagButton,
  ToCartButton,
} from "@/app/components/SubmitButtons";

import ImageSlider from "@/app/components/storefront/ImageSlider";
import { prisma } from "@/app/utils/db";

import { StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getData(productId: string) {
  const ProductData = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      price: true,
      images: true,
      description: true,
      name: true,
      id: true,
    },
  });

  if (!ProductData) {
    return notFound();
  }

  return {
    ...ProductData,
    price: ProductData.price.toString(),
  };
}

export default async function ProductIdRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);
  const addProducttoShoppingCart = addItem.bind(null, data.id);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
        <ImageSlider images={data.images} />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {data.name}
          </h1>
          <p className="text-3xl mt-2 ">{data.price} BYN</p>
          <div className="mt-3 flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-xl mt-6 custom-big-description">
            {data.description}
          </p>

          <form action={addProducttoShoppingCart}>
            <span className="custom-big-button">
              <ShoppingBagButton />
            </span>
          </form>

          <span className="custom-big-button">
            <ToCartButton />
          </span>
        </div>
      </div>
    </>
  );
}
