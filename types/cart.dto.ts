export type CartItemDTO = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageString: string;
};

export interface CartDTO {
  userId: string;
  items: CartItemDTO[];
}

export interface CreateCartItemValues {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageString: string;
}
