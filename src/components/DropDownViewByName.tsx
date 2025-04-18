'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmployeeSearchResultsType } from '@/lib/queries/getEmployeeSearchResults';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Eye, LoaderCircle } from 'lucide-react';

type Props = {
  employee: EmployeeSearchResultsType;
};

export default function DropdownViewByName({ employee }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewSummary = async (employeeId: number) => {
    try {
      setLoading(true);
      router.push(`/summary?employeeId=${employeeId}`);
    } catch (error) {
      console.error('Failed to view summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={loading}>
            <Eye className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>View Tracker summary by Person</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {employee.length > 0 ? (
            employee.map((data) => (
              <DropdownMenuItem
                key={data.id}
                onClick={() => handleViewSummary(data.id)}
              >
                {data.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              No employee to view tracker summary
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {loading && (
        <div className="fixed inset-0 z-50 bg-background/80">
          <div className="w-full h-dvh grid place-content-center">
            <LoaderCircle className="h-48 w-48 animate-spin text-foreground/20" />
          </div>
        </div>
      )}
    </>
  );
}
