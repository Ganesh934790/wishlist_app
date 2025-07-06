export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  addedBy: string;
  createdAt: string;
  updatedAt?: string;
  reactions: Reaction[];
  comments: Comment[];
}

export interface Reaction {
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  collaborators: string[];
  products: Product[];
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}