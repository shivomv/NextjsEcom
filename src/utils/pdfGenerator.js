const PDFDocument = require('pdfkit');

/**
 * Generate a PDF receipt for an order
 * @param {Object} order - The order object
 * @param {Object} user - The user object
 * @returns {Buffer} - The PDF document as a buffer
 */
async function generateReceiptPDF(order, user) {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
      });

      // Collect the PDF data chunks
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (error) => reject(error));

      // Format date
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
      };

      // Format price
      const formatPrice = (price) => {
        return `₹${Number(price).toFixed(2)}`;
      };

      // Get receipt number or generate one if not available
      const receiptNumber = order.paymentResult?.receipt_number ||
        `RCP${order._id.toString().substr(-6)}`;

      // Add company logo and header
      doc.fontSize(20)
         .font('Helvetica-Bold')
         .text('Prashasak Samiti', { align: 'center' })
         .fontSize(12)
         .font('Helvetica')
         .text(`Receipt #${receiptNumber}`, { align: 'center' })
         .moveDown(2);

      // Add a horizontal line
      doc.moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke()
         .moveDown();

      // Create columns for billing, shipping, and order details
      const colWidth = (doc.page.width - 100) / 3;

      // Billing information
      doc.font('Helvetica-Bold')
         .text('Bill To:', 50, doc.y)
         .font('Helvetica')
         .moveDown(0.5)
         .text(user.name || 'Customer')
         .text(user.email || '')
         .text(order.shippingAddress.phone || '')
         .moveUp(3);

      // Shipping information
      doc.font('Helvetica-Bold')
         .text('Ship To:', 50 + colWidth, doc.y)
         .font('Helvetica')
         .moveDown(0.5)
         .text(order.shippingAddress.name || user.name || 'Customer')
         .text(order.shippingAddress.addressLine1 || '')
         .text(order.shippingAddress.addressLine2 || '')
         .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`)
         .text(order.shippingAddress.country || '')
         .moveUp(5);

      // Order details
      doc.font('Helvetica-Bold')
         .text('Order Details:', 50 + colWidth * 2, doc.y)
         .font('Helvetica')
         .moveDown(0.5)
         .text(`Order #: ${order.orderNumber || order._id}`)
         .text(`Date: ${formatDate(order.createdAt)}`)
         .text(`Payment Method: ${order.paymentMethod}`);

      if (order.isPaid) {
        doc.text(`Payment Date: ${formatDate(order.paidAt)}`);
      }

      if (order.paymentResult?.id) {
        doc.text(`Transaction ID: ${order.paymentResult.id}`);
      }

      // Move down after the columns
      doc.moveDown(2);

      // Add a horizontal line
      doc.moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke()
         .moveDown();

      // Add order items table
      // Table headers
      const tableTop = doc.y;
      const tableHeaders = ['Item', 'Qty', 'Price', 'Total'];
      const tableColumnWidths = [colWidth * 1.5, colWidth * 0.5, colWidth * 0.5, colWidth * 0.5];

      // Draw table headers
      doc.font('Helvetica-Bold');
      let xPosition = 50;

      tableHeaders.forEach((header, i) => {
        const width = tableColumnWidths[i];
        const align = i === 0 ? 'left' : 'right';
        doc.text(header, xPosition, tableTop, { width, align });
        xPosition += width;
      });

      doc.moveDown();

      // Draw table rows
      doc.font('Helvetica');
      let yPosition = doc.y;

      // Add order items
      order.orderItems.forEach((item) => {
        // Reset x position for each row
        xPosition = 50;

        // Item name
        doc.text(item.name, xPosition, yPosition, {
          width: tableColumnWidths[0],
          align: 'left'
        });
        xPosition += tableColumnWidths[0];

        // Quantity
        doc.text(item.qty.toString(), xPosition, yPosition, {
          width: tableColumnWidths[1],
          align: 'right'
        });
        xPosition += tableColumnWidths[1];

        // Price
        doc.text(formatPrice(item.price), xPosition, yPosition, {
          width: tableColumnWidths[2],
          align: 'right'
        });
        xPosition += tableColumnWidths[2];

        // Total
        doc.text(formatPrice(item.price * item.qty), xPosition, yPosition, {
          width: tableColumnWidths[3],
          align: 'right'
        });

        // Move to next row
        yPosition = doc.y + 15;
        doc.y = yPosition;
      });

      // Add a horizontal line
      doc.moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke()
         .moveDown();

      // Add order summary
      const summaryX = doc.page.width - 200;

      doc.font('Helvetica')
         .text('Subtotal:', summaryX, doc.y, { width: 100, align: 'left' })
         .text(formatPrice(order.itemsPrice), summaryX + 100, doc.y - doc.currentLineHeight(), { width: 100, align: 'right' })
         .moveDown(0.5);

      doc.text('Shipping:', summaryX, doc.y, { width: 100, align: 'left' })
         .text(order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice), summaryX + 100, doc.y - doc.currentLineHeight(), { width: 100, align: 'right' })
         .moveDown(0.5);

      doc.text('Tax (5% GST):', summaryX, doc.y, { width: 100, align: 'left' })
         .text(formatPrice(order.taxPrice), summaryX + 100, doc.y - doc.currentLineHeight(), { width: 100, align: 'right' })
         .moveDown(0.5);

      // Add a horizontal line for total
      doc.moveTo(summaryX, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke()
         .moveDown(0.5);

      // Total
      doc.font('Helvetica-Bold')
         .text('Total:', summaryX, doc.y, { width: 100, align: 'left' })
         .text(formatPrice(order.totalPrice), summaryX + 100, doc.y - doc.currentLineHeight(), { width: 100, align: 'right' })
         .moveDown(2);

      // Add footer
      doc.font('Helvetica')
         .fontSize(10)
         .text('Thank you for your purchase!', { align: 'center' })
         .moveDown(0.5)
         .text('For any questions, please contact us at support@prashasaksamiti.com', { align: 'center' })
         .moveDown(0.5)
         .text(`© ${new Date().getFullYear()} Prashasak Samiti. All rights reserved.`, { align: 'center' });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateReceiptPDF
};
