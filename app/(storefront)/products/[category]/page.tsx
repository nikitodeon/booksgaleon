import { ProductCard } from "@/app/components/storefront/ProductCard";
import { prisma } from "@/app/utils/db";
import { notFound, redirect } from "next/navigation";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
}

interface CategoryPageData {
  title: string;
  products: ProductData[];
}

async function fetchCategoryProducts(
  categorySlug: string
): Promise<CategoryPageData> {
  if (categorySlug === "vse-zhanry") {
    redirect("/");
  }

  if (categorySlug === "bestsellery") {
    const products = await prisma.product.findMany({
      where: { status: "published", isFeatured: true },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
      },
    });

    return {
      title: "Бестселлеры",
      products: products.map((p) => ({ ...p, price: p.price.toString() })),
    };
  }

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { id: true, title: true },
  });

  if (!category) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      status: "published",
      categoryId: category.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: true,
    },
  });

  return {
    title: category.title,
    products: products.map((p) => ({ ...p, price: p.price.toString() })),
  };
}

function ProductsGrid({ products }: { products: ProductData[] }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-5 gap-x-2">
      {products.map((product) => (
        <ProductCard key={product.id} item={product} />
      ))}
    </div>
  );
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const { title, products } = await fetchCategoryProducts(category);

  return (
    <section>
      <h1 className="font-semibold text-3xl my-5 custom">{title}</h1>
      <ProductsGrid products={products} />
    </section>
  );
}
