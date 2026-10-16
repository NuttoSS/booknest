export interface FeaturedBook {
  title: string;
  author: string;
}

/** หนังสือแนะนำที่แสดงบนหน้า Home ตอนยังไม่ได้ค้นหา */
export const FEATURED_BOOKS: FeaturedBook[] = [
  { title: 'The Martian', author: 'Andy Weir' },
  { title: 'Dune', author: 'Frank Herbert' },
  { title: 'Pride and Prejudice', author: 'Jane Austen' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien' },
  { title: '1984', author: 'George Orwell' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { title: 'Sapiens', author: 'Yuval Noah Harari' },
  { title: 'Atomic Habits', author: 'James Clear' },
  { title: 'The Alchemist', author: 'Paulo Coelho' },
  { title: 'The Midnight Library', author: 'Matt Haig' },
  { title: 'Educated', author: 'Tara Westover' },
  { title: "Harry Potter and the Philosopher's Stone", author: 'J.K. Rowling' },
  { title: 'Project Hail Mary', author: 'Andy Weir' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman' },
  { title: 'The Psychology of Money', author: 'Morgan Housel' },
  { title: 'Where the Crawdads Sing', author: 'Delia Owens' },
  { title: 'The Hunger Games', author: 'Suzanne Collins' },
  { title: 'Norwegian Wood', author: 'Haruki Murakami' },
  { title: 'The Little Prince', author: 'Antoine de Saint-Exupery' },
];

/** ปุ่มหมวดลัดใต้ช่องค้นหา (ต้องตรงกับ value ใน CATEGORIES) */
export const QUICK_GENRES = [
  'fiction',
  'fantasy',
  'science fiction',
  'mystery',
  'romance',
  'history',
  'self-help',
  'business',
  'psychology',
] as const;
