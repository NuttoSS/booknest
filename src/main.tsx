import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { ApiError } from './api/googleBooks';
import { router } from './router';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry อัตโนมัติ 2 ครั้ง (ยกเว้น 404 ที่ลองใหม่ก็ไม่เจอ และ 429 ที่ลองซ้ำจะยิ่งโดนจำกัด)
      retry: (failureCount, error) => {
        if (error instanceof ApiError && (error.status === 404 || error.status === 429)) return false;
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
