// ✅ src/features/roadmap/types.ts

export interface Roadmap {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  upvotes?: number; // ✅ Make it optional (use ?)
}
