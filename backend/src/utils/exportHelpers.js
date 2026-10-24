import PDFDocument from 'pdfkit';

/**
 * Convert array of objects to standard CSV string
 */
export const generateCSV = (headers, rows) => {
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = headers.map(h => escapeCell(h.label || h)).join(',');
  const dataRows = rows.map(row => {
    return headers.map(h => {
      const key = h.key || h;
      return escapeCell(row[key]);
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Generate Executive PDF Report with charts/tables using PDFKit
 */
export const generatePDFReport = ({ title, subtitle, metrics = [], tables = [] }, res) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  // Stream directly to response
  doc.pipe(res);

  // Header Banner
  doc.rect(40, 40, doc.page.width - 80, 50).fill('#59289E');
  doc.fillColor('#FFFFFF')
     .fontSize(18)
     .font('Helvetica-Bold')
     .text('WELLNESSATWORK — EXECUTIVE ANALYTICS', 55, 52);
  doc.fontSize(10)
     .font('Helvetica')
     .text('Case Study 72 • Corporate Employee Health & Vitality Audit', 55, 72);

  doc.moveDown(3);

  // Title and subtitle
  doc.fillColor('#292235')
     .fontSize(16)
     .font('Helvetica-Bold')
     .text(title, 40, 110);

  doc.fontSize(10)
     .font('Helvetica')
     .fillColor('#6F6878')
     .text(`${subtitle} • Generated: ${new Date().toLocaleString()}`, 40, 130);

  doc.moveDown(1.5);

  let currentY = 160;

  // Key Metrics Grid
  if (metrics.length > 0) {
    doc.fillColor('#292235')
       .fontSize(12)
       .font('Helvetica-Bold')
       .text('KEY EXECUTIVE METRICS', 40, currentY);

    currentY += 20;

    const boxWidth = (doc.page.width - 80 - ((metrics.length - 1) * 10)) / Math.min(metrics.length, 3);
    metrics.slice(0, 3).forEach((m, idx) => {
      const x = 40 + (idx * (boxWidth + 10));
      doc.rect(x, currentY, boxWidth, 55).fillAndStroke('#FAF5FF', '#D8B9FF');
      doc.fillColor('#6F6878').fontSize(9).font('Helvetica').text(m.label, x + 8, currentY + 8);
      doc.fillColor('#59289E').fontSize(16).font('Helvetica-Bold').text(String(m.value), x + 8, currentY + 24);
      if (m.trend) {
        doc.fillColor('#15803D').fontSize(8).font('Helvetica').text(m.trend, x + 8, currentY + 42);
      }
    });

    currentY += 75;
  }

  // Data Tables
  tables.forEach((table) => {
    if (currentY > doc.page.height - 120) {
      doc.addPage();
      currentY = 40;
    }

    doc.fillColor('#292235')
       .fontSize(12)
       .font('Helvetica-Bold')
       .text(table.title, 40, currentY);

    currentY += 18;

    // Table Header
    doc.rect(40, currentY, doc.page.width - 80, 20).fill('#E6D7FF');
    let colX = 45;
    const colWidth = (doc.page.width - 90) / table.columns.length;

    table.columns.forEach((col) => {
      doc.fillColor('#292235')
         .fontSize(9)
         .font('Helvetica-Bold')
         .text(col.label, colX, currentY + 5, { width: colWidth });
      colX += colWidth;
    });

    currentY += 22;

    // Table Rows
    table.rows.forEach((row, rowIdx) => {
      if (currentY > doc.page.height - 60) {
        doc.addPage();
        currentY = 40;
      }

      if (rowIdx % 2 === 1) {
        doc.rect(40, currentY - 2, doc.page.width - 80, 18).fill('#FAF5FF');
      }

      colX = 45;
      table.columns.forEach((col) => {
        const val = String(row[col.key] !== undefined ? row[col.key] : '');
        doc.fillColor('#292235')
           .fontSize(8.5)
           .font('Helvetica')
           .text(val, colX, currentY + 2, { width: colWidth });
        colX += colWidth;
      });

      currentY += 18;
    });

    currentY += 25;
  });

  // Footer Privacy Assurance Notice
  const footerY = doc.page.height - 40;
  doc.rect(40, footerY - 10, doc.page.width - 80, 20).fill('#F4EFFC');
  doc.fillColor('#6B31B8')
     .fontSize(8)
     .font('Helvetica')
     .text('🔒 PRIVACY AUDIT COMPLIANT: All mental health and counseling booking details strictly excluded from organizational reports.', 45, footerY - 5);

  doc.end();
};
