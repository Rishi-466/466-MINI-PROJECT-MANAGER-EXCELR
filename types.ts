
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface User {
    id: string;
    username: string;
}

export interface UserWithPassword extends User {
    password: string; // This should only be used for storage/validation, not kept in state
}
