const PDFDocument = require('pdfkit');

/**
 * Generate a simple PDF receipt for an order
 * @param {Object} order - The order object
 * @param {Object} user - The user object
 * @returns {Promise<Buffer>} - The PDF document as a buffer
 */
function generateSimplePDF(order, user) {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument();
      
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

      // Get receipt number
      const receiptNumber = order.paymentResult?.receipt_number || 
        `RCP${order._id.toString().substr(-6)}`;

      // Add content to PDF
      doc.fontSize(20)
         .text('Prashasak Samiti', { align: 'center' })
         .fontSize(12)
         .text(`Receipt #${receiptNumber}`, { align: 'center' })
         .moveDown();

      // Add billing information
      doc.fontSize(14)
         .text('Bill To:', { underline: true })
         .fontSize(12)
         .text(user.name || 'Customer')
         .text(user.email || '')
         .text(order.shippingAddress.phone || '')
         .moveDown();

      // Add shipping information
      doc.fontSize(14)
         .text('Ship To:', { underline: true })
         .fontSize(12)
         .text(order.shippingAddress.name || user.name || 'Customer')
         .text(order.shippingAddress.addressLine1 || '')
         .text(order.shippingAddress.addressLine2 || '')
         .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`)
         .text(order.shippingAddress.country || '')
         .moveDown();

      // Add order details
      doc.fontSize(14)
         .text('Order Details:', { underline: true })
         .fontSize(12)
         .text(`Order #: ${order.orderNumber || order._id}`)
         .text(`Date: ${formatDate(order.createdAt)}`)
         .text(`Payment Method: ${order.paymentMethod}`);

      if (order.isPaid) {
        doc.text(`Payment Date: ${formatDate(order.paidAt)}`);
      }

      if (order.paymentResult?.id) {
        doc.text(`Transaction ID: ${order.paymentResult.id}`);
      }
      
      doc.moveDown();

      // Add order items
      doc.fontSize(14)
         .text('Order Items:', { underline: true })
         .moveDown();

      // Add table headers
      doc.fontSize(12)
         .text('Item', 50, doc.y, { width: 250, continued: true })
         .text('Qty', { width: 50, align: 'center', continued: true })
         .text('Price', { width: 100, align: 'right', continued: true })
         .text('Total', { width: 100, align: 'right' })
         .moveDown();

      // Add order items
      order.orderItems.forEach(item => {
        doc.text(item.name, 50, doc.y, { width: 250, continued: true })
           .text(item.qty.toString(), { width: 50, align: 'center', continued: true })
           .text(formatPrice(item.price), { width: 100, align: 'right', continued: true })
           .text(formatPrice(item.price * item.qty), { width: 100, align: 'right' })
           .moveDown(0.5);
      });

      doc.moveDown();

      // Add order summary
      doc.fontSize(12)
         .text(`Subtotal: ${formatPrice(order.itemsPrice)}`, { align: 'right' })
         .text(`Shipping: ${order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}`, { align: 'right' })
         .text(`Tax (5% GST): ${formatPrice(order.taxPrice)}`, { align: 'right' })
         .fontSize(14)
         .text(`Total: ${formatPrice(order.totalPrice)}`, { align: 'right' })
         .moveDown(2);

      // Add footer
      doc.fontSize(10)
         .text('Thank you for your purchase!', { align: 'center' })
         .text('For any questions, please contact us at support@prashasaksamiti.com', { align: 'center' })
         .text(`© ${new Date().getFullYear()} Prashasak Samiti. All rights reserved.`, { align: 'center' });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateSimplePDF
};
