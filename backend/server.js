const path = require('path');
const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');

const app = express();
app.use(cors());
app.use(express.json());

const EXCEL_FILE = path.join(__dirname, 'employees.xlsx');

// ---------------------------------------------------------
// 1. API Dashboard
// ---------------------------------------------------------
app.get('/api/dashboard', async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(EXCEL_FILE);
        const worksheet = workbook.getWorksheet(1);

        let total = 0;
        let checkedIn = 0;
        let missing = 0;

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            total++;
            const status = row.getCell(5).value;
            if (status === 'ลงชื่อแล้ว' || status === 'เข้างานแล้ว') {
                checkedIn++;
            } else {
                missing++;
            }
        });

        res.json({ total, checkedIn, missing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอ่านไฟล์ Excel' });
    }
});

// ---------------------------------------------------------
// 2. API Scan — เพิ่มการเช็คซ้ำก่อนบันทึก
// ---------------------------------------------------------
app.post('/api/scan', async (req, res) => {
    const { rfid } = req.body;

    if (!rfid) {
        return res.status(400).json({ success: false, message: 'กรุณาส่งรหัส RFID' });
    }

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(EXCEL_FILE);
        const worksheet = workbook.getWorksheet(1);

        let scannedName = null;
        let targetRowNumber = null;
        let currentStatus = null;

        // ค้นหาพนักงานจาก RFID
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const cellRfid = row.getCell(6).value;
            if (cellRfid && cellRfid.toString() === rfid.toString()) {
                targetRowNumber = rowNumber;
                const prefix = row.getCell(3).value || '';
                const name = row.getCell(2).value || '';
                scannedName = `${prefix}${name}`;
                currentStatus = row.getCell(5).value; // ดึงสถานะปัจจุบัน
            }
        });

        // ไม่พบ RFID ในระบบ
        if (!targetRowNumber) {
            return res.status(404).json({
                success: false,
                type: 'not_found',
                message: 'ไม่พบข้อมูล RFID นี้ในระบบ'
            });
        }

        // ✅ เช็คซ้ำ — ถ้าลงชื่อไปแล้วให้ reject ทันที
        const alreadyCheckedIn =
            currentStatus === 'ลงชื่อแล้ว' || currentStatus === 'เข้างานแล้ว';

        if (alreadyCheckedIn) {
            return res.json({
                success: false,
                type: 'duplicate',
                message: `${scannedName} ลงชื่อไปแล้ว!`,
                latestPerson: scannedName,
            });
        }

        // บันทึกการลงชื่อ
        const row = worksheet.getRow(targetRowNumber);
        const now = new Date();
        const timeString = now.toLocaleTimeString('th-TH');

        row.getCell(4).value = timeString;
        row.getCell(5).value = 'ลงชื่อแล้ว';
        row.commit();

        await workbook.xlsx.writeFile(EXCEL_FILE);

        res.json({
            success: true,
            type: 'checkin',
            message: 'ลงชื่อสำเร็จ',
            latestPerson: scannedName,
            scanType: 'checkin',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตไฟล์ Excel' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend Server กำลังทำงานที่ http://localhost:${PORT}`);
});