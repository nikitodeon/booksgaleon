import { Decimal } from "@prisma/client/runtime/library";
import { ProductCard } from "../components/storefront/ProductCard";
import { prisma } from "../utils/db";

async function getData() {
  const data = await prisma.product.findMany({
    select: {
      name: true,
      images: true,
      price: true,
      id: true,
      description: true,
    },
    where: {
      status: "published",
    },
  });

  return {
    title: "Все жанры",
    data: data.map((product) => ({
      ...product,
      price:
        product.price instanceof Decimal
          ? product.price.toFixed(2)
          : String(product.price),
    })),
  };
}

export default async function IndexPage() {
  const { data, title } = await getData();
  return (
    <section>
      <h1 className="font-semibold text-3xl my-5 custom">{title}</h1>
      <div className="grid grid-cols-3  md:grid-cols-4 lg:grid-cols-6 gap-5">
        {data.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  );
}
