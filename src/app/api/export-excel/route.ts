import ExcelJS from 'exceljs';
import { NextResponse } from 'next/server';
import getAllTrackers from '@/lib/queries/getAllTrackers';
import { getAllTrackerType } from '@/lib/queries/getAllTrackerType';
import { getAllEmployee } from '@/lib/queries/getAllemployee';

function formatMinutesToHourText(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return '-';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const year = body.year ?? 2023;

    const alltracker = await getAllTrackers();
    const trackers = alltracker.filter((data) => {
      const trackerYear = new Date(data.trackersDate).getFullYear();
      return trackerYear === year;
    });

    const trackerTypes = await getAllTrackerType();
    const employees = await getAllEmployee();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employee Leave Tracker');

    // Define color scheme
    const colors = {
      headerBg: 'FF4F81AF', // Dark blue for headers
      subHeaderBg: 'FFDAEEF3', // Light blue for sub-headers
      totalBg: 'FFF0F8FF', // Very light blue for totals
      border: 'FF000000', // Black for borders
      accent: 'FF4682B4', // Medium blue for accents
    };

    // Style for headers
    const headerStyle = {
      font: { size: 16, bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerBg } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: colors.border } },
        left: { style: 'thin', color: { argb: colors.border } },
        bottom: { style: 'thin', color: { argb: colors.border } },
        right: { style: 'thin', color: { argb: colors.border } },
      },
    };

    const subHeaderStyle = {
      font: { size: 12, bold: true, color: { argb: 'FF000000' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.subHeaderBg } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: headerStyle.border,
    };

    const cellStyle = {
      font: { size: 11, color: { argb: 'FF000000' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: headerStyle.border,
    };

    const totalStyle = {
      font: { size: 12, bold: true, color: { argb: 'FF000000' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.totalBg } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: headerStyle.border,
    };

    // Title row
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Employee Leave Tracker';
    Object.assign(titleCell, headerStyle);
    worksheet.getRow(1).height = 30;

    // Year row
    worksheet.getCell('A2').value = 'Year';
    Object.assign(worksheet.getCell('A2'), subHeaderStyle);
    
    worksheet.getCell('B2').value = `${year}`;
    Object.assign(worksheet.getCell('B2'), subHeaderStyle);
    worksheet.getRow(2).height = 25;

    // Set column widths
    worksheet.getColumn('A').width = 25;
    for (let i = 1; i <= trackerTypes.length + 1; i++) {
      worksheet.getColumn(i + 1).width = 15;
    }

    const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    let alphabetCount = 0;

    // Employee names header
    const empHeader = worksheet.getCell(`${alphabet[alphabetCount]}4`);
    empHeader.value = 'Employee Names';
    Object.assign(empHeader, subHeaderStyle);

    // Employee names
    employees.forEach((emp, index) => {
      const cell = worksheet.getCell(`${alphabet[0]}${5 + index}`);
      cell.value = emp.name;
      Object.assign(cell, cellStyle);
    });

    const employeeTimeTotals: number[] = new Array(employees.length).fill(0);
    const trackerTypeTotals: number[] = new Array(trackerTypes.length).fill(0);

    // Tracker types columns
    for (let i = 0; i < trackerTypes.length; i++) {
      alphabetCount++;
      const col = alphabet[alphabetCount];
      const headerCell = worksheet.getCell(`${col}4`);
      headerCell.value = trackerTypes[i].name;
      Object.assign(headerCell, subHeaderStyle);

      employees.forEach((emp, empIndex) => {
        const matches = trackers.filter(
          (t) => t.name === emp.name && t.type === trackerTypes[i].name
        );

        let totalMinutes = 0;
        matches.forEach((match) => {
          const [startHour, startMin] = match.startTime.split(':').map(Number);
          const [endHour, endMin] = match.endTime.split(':').map(Number);

          const start = startHour * 60 + startMin;
          const end = endHour * 60 + endMin;
          const diff = end - start;

          totalMinutes += diff;
        });

        employeeTimeTotals[empIndex] += totalMinutes;
        trackerTypeTotals[i] += totalMinutes;

        const cell = worksheet.getCell(`${col}${5 + empIndex}`);
        cell.value = totalMinutes > 0 ? formatMinutesToHourText(totalMinutes) : '-';
        Object.assign(cell, cellStyle);
      });
    }

    // TOTAL column
    const totalCol = alphabet[alphabetCount + 1];
    const totalHeader = worksheet.getCell(`${totalCol}4`);
    totalHeader.value = 'TOTAL';
    Object.assign(totalHeader, subHeaderStyle);

    employees.forEach((emp, empIndex) => {
      const totalMinutes = employeeTimeTotals[empIndex];
      const cell = worksheet.getCell(`${totalCol}${5 + empIndex}`);
      cell.value = totalMinutes > 0 ? formatMinutesToHourText(totalMinutes) : '-';
      Object.assign(cell, totalStyle);
    });

    // Summary row
    const summaryRow = 5 + employees.length;
    const summaryHeader = worksheet.getCell(`A${summaryRow}`);
    summaryHeader.value = 'Total';
    Object.assign(summaryHeader, totalStyle);

    for (let i = 0; i < trackerTypes.length; i++) {
      const col = alphabet[i + 1];
      const totalMinutes = trackerTypeTotals[i];
      const cell = worksheet.getCell(`${col}${summaryRow}`);
      cell.value = totalMinutes > 0 ? formatMinutesToHourText(totalMinutes) : '-';
      Object.assign(cell, totalStyle);
    }

    const totalColSummary = alphabet[alphabetCount + 1];
    const totalAllMinutes = employeeTimeTotals.reduce((sum, mins) => sum + mins, 0);
    const totalSummaryCell = worksheet.getCell(`${totalColSummary}${summaryRow}`);
    totalSummaryCell.value = totalAllMinutes > 0 ? formatMinutesToHourText(totalAllMinutes) : '-';
    Object.assign(totalSummaryCell, totalStyle);

    // Auto-filter
    worksheet.autoFilter = {
      from: 'A4',
      to: `${totalCol}4`,
    };

    // Freeze header rows
    worksheet.views = [{ state: 'frozen', ySplit: 4 }];

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename=employee_leave_tracker_${year}.xlsx`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (err) {
    console.error('Excel Export Error:', err);
    return NextResponse.json({ error: 'Failed to export Excel' }, { status: 500 });
  }
}