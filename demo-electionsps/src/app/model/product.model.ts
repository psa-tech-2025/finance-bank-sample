export interface Product {
  id?: string;          // Firestore doc id
  productId: string;    // human/business id (SKU)
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  imagePath?: string;   // path stored in Firebase Storage e.g. Uploads/products/...
  createdAt?: any;      // timestamp
  updatedAt?: any;
}
