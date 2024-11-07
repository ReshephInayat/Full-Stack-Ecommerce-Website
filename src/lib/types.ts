export type Product = {
  _id: string;
  _type: "product";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: { current: string };
  image?: { asset?: { _ref: string } };
  stock?: number;
  price?: number;
  description?: [];
};
