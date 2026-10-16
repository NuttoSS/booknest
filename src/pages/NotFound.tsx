import { BookX } from 'lucide-react';
import { Link } from 'react-router';
import { EmptyState } from '../components/QueryStates';

export default function NotFound() {
  return (
    <EmptyState
      icon={<BookX className="size-10" />}
      title="Page not found"
      description="ไม่พบหน้าที่คุณต้องการ อาจถูกย้ายหรือพิมพ์ URL ผิด"
      action={
        <Link to="/" className="btn btn-primary btn-sm">
          Back to Home
        </Link>
      }
    />
  );
}
