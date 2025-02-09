import { prisma } from "@/app/utils/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getData() {
  const data = await prisma.order.findMany({
    select: {
      totalAmount: true,
      id: true,
      user: {
        select: {
          name: true,
          profileImage: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });

  return data;
}

export async function RecentSales() {
  const data = await getData();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent sales</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {data.map((item) => (
          <div className="flex items-center gap-4" key={item.id}>
            <Avatar className="hidden sm:flex h-9 w-9">
              <AvatarImage src={item.user?.profileImage} alt="Avatar Image" />
              <AvatarFallback>{item.user?.name?.slice(0, 3)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium">{item.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.user?.email}
              </p>
            </div>
            <p className="ml-auto font-medium">
              +{new Intl.NumberFormat("en-US").format(item.totalAmount)} BYN
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
