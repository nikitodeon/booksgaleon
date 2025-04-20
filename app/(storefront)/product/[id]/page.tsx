import { addItem } from "@/app/actions";
import {
  ShoppingBagButton,
  ToCartButton,
} from "@/app/components/SubmitButtons";
import ImageSlider from "@/app/components/storefront/ImageSlider";
import { prisma } from "@/app/utils/db";
import { StarIcon } from "lucide-react";
import { notFound } from "next/navigation";

interface ProductData {
  id: string;
  name: string;
  price: string;
  description: string;
  images: string[];
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function fetchProduct(productId: string): Promise<ProductData> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  return {
    ...product,
    price: product.price.toString(),
  };
}

function RatingStars() {
  return (
    <div className="mt-3 flex items-center gap-1" aria-label="Product rating">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      ))}
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);

  const addToCartAction = addItem.bind(null, product.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
      <ImageSlider images={product.images} />

      <div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {product.name}
          </h1>
          <p className="text-3xl">{product.price} BYN</p>
          <RatingStars />
        </div>

        <p className="text-xl mt-6 custom-big-description">
          {product.description}
        </p>

        <div className="mt-8 space-y-4">
          <form action={addToCartAction}>
            <span className="custom-big-button">
              <ShoppingBagButton />
            </span>
          </form>
          <span className="custom-big-button">
            <ToCartButton />
          </span>
        </div>
      </div>
    </div>
  );
}
