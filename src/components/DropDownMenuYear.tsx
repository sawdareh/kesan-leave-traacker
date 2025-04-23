'use client';

import { useState,useEffect,ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { FileDown,LoaderCircle } from 'lucide-react';
type Props={
  children:ReactNode,
  uniqueYears:number[]
}

export default function ExportDropdown({ children,uniqueYears}:Props) {
  const [downloading, setDownloading] = useState(false);
  const router=useRouter();

  // ✅ Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
       router.refresh();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (year: number) => {
    setDownloading(true);
    try {
      const res = await fetch('/api/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year }),
      });

      if (!res.ok) {
        alert('Failed to download file.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kesan_employee_leave_tracker_${year}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('An error occurred while downloading.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex justify-start items-center gap-3' >
          <FileDown className="w-4 h-4" />
          {children}
        </div>

      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Export summary by Year</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {uniqueYears.length > 0 ? (
          uniqueYears.map((year) => (
            <DropdownMenuItem
              key={year}
              onClick={() => handleDownload(year)}
            >
              {year}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            No data and Leave Tracker
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
      {downloading && (
        <div className="fixed inset-0 z-50 bg-background/80">
            <div className="w-full h-dvh grid place-content-center">
                <LoaderCircle className="h-48 w-48 animate-spin text-foreground/20"></LoaderCircle>
            </div>
        </div>
      )}
    </DropdownMenu>
  );
}
