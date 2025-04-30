const PDFDocument = require('pdfkit');

/**
 * Convert HTML receipt to PDF
 * @param {string} html - The HTML content
 * @returns {Promise<Buffer>} - The PDF document as a buffer
 */
function htmlToPdf(html) {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument();
      
      // Collect the PDF data chunks
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (error) => reject(error));

      // Extract text content from HTML
      const textContent = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '\n')
        .replace(/\n{2,}/g, '\n')
        .trim();

      // Add content to PDF
      doc.fontSize(12).text(textContent);

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  htmlToPdf
};
