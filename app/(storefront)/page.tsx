import { ProductCard } from "@/app/components/storefront/ProductCard";
import { prisma } from "@/app/utils/db";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
}

interface PageData {
  title: string;
  products: ProductData[];
}

async function fetchAllProducts(): Promise<PageData> {
  const products = await prisma.product.findMany({
    where: { status: "published" },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: true,
    },
  });

  return {
    title: "Все жанры",
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

export default async function AllProductsPage() {
  const { title, products } = await fetchAllProducts();

  return (
    <section>
      <h1 className="font-semibold text-3xl my-5 custom">{title}</h1>
      <ProductsGrid products={products} />
    </section>
  );
}
