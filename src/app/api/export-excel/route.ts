import ExcelJS from 'exceljs';
import { NextResponse } from 'next/server';
import getAllTrackers from '@/lib/queries/getAllTrackers';
import { getAllTrackerType } from '@/lib/queries/getAllTrackerType';
import { getAllEmployee } from '@/lib/queries/getAllemployee';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const year = body.year ?? 2023;
    
        const alltracker = await getAllTrackers();
        const trackers = alltracker.filter((data) => {
          const trackerYear = new Date(data.date).getFullYear();
          return trackerYear === year;
        });
        
        const trackerTypes = await getAllTrackerType();
        const employees = await getAllEmployee();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Employee Leave Tracker');

        // Title
        worksheet.mergeCells('A1:H1');
        worksheet.getCell('A1').value = 'Employee Leave Tracker';
        worksheet.getCell('A1').font = { size: 16, bold: true };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        // Year section styled like the image
        worksheet.getCell('A2').value = 'Year';
        worksheet.getCell('A2').font = { bold: true };
        worksheet.getCell('A2').alignment = { horizontal: 'center' };
        worksheet.getCell('A2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDAEEF3' },
        };
        worksheet.getCell('A2').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        };

        worksheet.getCell('B2').value = `${year}`;
        worksheet.getCell('B2').font = { bold: true };
        worksheet.getCell('B2').alignment = { horizontal: 'center' };
        worksheet.getCell('B2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDAEEF3' },
        };
        worksheet.getCell('B2').border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
        };

        const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
        let alphabetCount = 0;

        worksheet.getCell(`${alphabet[alphabetCount]}4`).value = 'Employee Names';

        // Write employee names
        employees.forEach((emp, index) => {
        worksheet.getCell(`${alphabet[0]}${5 + index}`).value = emp.name;
        });

        // Tracker type columns with dashes and counts
        for (let i = 0; i < trackerTypes.length; i++) {
        alphabetCount++;
        const col = alphabet[alphabetCount];
        worksheet.getCell(`${col}4`).value = trackerTypes[i].name;

        employees.forEach((emp, empIndex) => {
            const matches = trackers.filter(
            (t) => t.name === emp.name && t.type === trackerTypes[i].name
            );

            const cellRef = worksheet.getCell(`${col}${5 + empIndex}`);
            const currentValue = cellRef.value ?? 0;
            const isNumeric = typeof currentValue === 'number' ? currentValue : 0;
            const updatedValue = isNumeric + matches.length;

            cellRef.value = updatedValue > 0 ? updatedValue : '-';
        });
        }

        // TOTAL column
        const totalCol = alphabet[alphabetCount + 1];
        worksheet.getCell(`${totalCol}4`).value = 'TOTAL';

        employees.forEach((emp, empIndex) => {
        let total = 0;
        for (let j = 1; j <= trackerTypes.length; j++) {
            const val = worksheet.getCell(`${alphabet[j]}${5 + empIndex}`).value;
            if (typeof val === 'number') total += val;
        }
        worksheet.getCell(`${totalCol}${5 + empIndex}`).value = total;
        });

        // Summary Total row
        const summaryRow = 5 + employees.length;
        worksheet.getCell(`A${summaryRow}`).value = 'Total';
        worksheet.getCell(`A${summaryRow}`).font = { bold: true };

        for (let j = 1; j <= trackerTypes.length; j++) {
        let columnSum = 0;
        for (let i = 0; i < employees.length; i++) {
            const val = worksheet.getCell(`${alphabet[j]}${5 + i}`).value;
            if (typeof val === 'number') columnSum += val;
        }
        worksheet.getCell(`${alphabet[j]}${summaryRow}`).value = columnSum;
        worksheet.getCell(`${alphabet[j]}${summaryRow}`).font = { bold: true };
        }

        // Set column widths
        worksheet.getColumn('A').width = 25;
        worksheet.getColumn('B').width = 15;
        for (let j = 2; j <= trackerTypes.length + 2; j++) {
        worksheet.getColumn(alphabet[j]).width = 15;
        }

        // Style Employee Name cells
        for (let i = 0; i < employees.length; i++) {
        const cell = worksheet.getCell(`A${5 + i}`);
        cell.font = { bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFAF3E0' },
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        }

        // Style Tracker Type cells
        for (let j = 1; j <= trackerTypes.length; j++) {
        for (let i = 0; i < employees.length; i++) {
            const cell = worksheet.getCell(`${alphabet[j]}${5 + i}`);
            const isDash = cell.value === '-';
            cell.font = isDash
            ? { color: { argb: 'FF888888' } }
            : { color: { argb: 'FF000000' } };
            cell.alignment = { horizontal: 'center' };
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEEF6FF' },
            };
            cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            };
        }
        }

        // Style TOTAL column
        for (let i = 0; i < employees.length; i++) {
        const cell = worksheet.getCell(`${totalCol}${5 + i}`);
        cell.font = { bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF0F8FF' },
        };
        cell.alignment = { horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        }

        // Style summary row
        for (let j = 0; j <= trackerTypes.length + 1; j++) {
        const cell = worksheet.getCell(`${alphabet[j]}${summaryRow}`);
        cell.font = { bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' },
        };
        cell.alignment = { horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        }

        // Style header row
        worksheet.getRow(4).eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFADD8E6' },
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
        });

        const buffer = await workbook.xlsx.writeBuffer();

        return new NextResponse(buffer, {
        status: 200,
        headers: {
            'Content-Disposition': `attachment; filename=employee_leave_tracker_${year}.xlsx`,
            'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        });
    } catch (err) {
        console.error('Excel Export Error:', err);
        return NextResponse.json({ error: 'Failed to export Excel' }, { status: 500 });
    }
}
