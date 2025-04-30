'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ReceiptPdfGenerator = ({ order, user }) => {
  const [generating, setGenerating] = useState(false);

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
  const getReceiptNumber = () => {
    return order.paymentResult?.receipt_number || 
      `RCP${order._id.toString().substr(-6)}`;
  };

  // Generate PDF from receipt content
  const generatePDF = async () => {
    try {
      setGenerating(true);

      // Create a temporary div to hold the receipt content
      const receiptDiv = document.createElement('div');
      receiptDiv.innerHTML = generateReceiptHTML();
      receiptDiv.style.width = '800px';
      receiptDiv.style.padding = '20px';
      receiptDiv.style.position = 'absolute';
      receiptDiv.style.left = '-9999px';
      document.body.appendChild(receiptDiv);

      // Use html2canvas to capture the receipt content
      const canvas = await html2canvas(receiptDiv, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Remove the temporary div
      document.body.removeChild(receiptDiv);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Download PDF
      pdf.save(`receipt-${getReceiptNumber()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // Generate receipt HTML content
  const generateReceiptHTML = () => {
    const receiptNumber = getReceiptNumber();
    
    // Generate order items HTML
    const orderItemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price * item.qty)}</td>
      </tr>
    `).join('');

    // Generate receipt HTML
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;">
        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
            <h1 style="color: #6602C2; margin: 0;">Prashasak Samiti</h1>
            <p>Receipt #${receiptNumber}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div style="flex: 1;">
              <h3>Bill To:</h3>
              <p>
                ${user?.name || 'Customer'}<br>
                ${user?.email || ''}<br>
                ${order.shippingAddress.phone || ''}
              </p>
            </div>
            
            <div style="flex: 1;">
              <h3>Ship To:</h3>
              <p>
                ${order.shippingAddress.name || ''}<br>
                ${order.shippingAddress.addressLine1 || ''}<br>
                ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.country || ''}
              </p>
            </div>
            
            <div style="flex: 1;">
              <h3>Order Details:</h3>
              <p>
                Order #: ${order.orderNumber || order._id}<br>
                Date: ${formatDate(order.createdAt)}<br>
                Payment Method: ${order.paymentMethod}<br>
                ${order.isPaid ? `Payment Date: ${formatDate(order.paidAt)}<br>` : ''}
                ${order.paymentResult?.id ? `Transaction ID: ${order.paymentResult.id}<br>` : ''}
              </p>
            </div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="text-align: left; background-color: #f2f2f2; padding: 10px 8px; border-bottom: 2px solid #ddd;">Item</th>
                <th style="text-align: center; background-color: #f2f2f2; padding: 10px 8px; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="text-align: right; background-color: #f2f2f2; padding: 10px 8px; border-bottom: 2px solid #ddd;">Price</th>
                <th style="text-align: right; background-color: #f2f2f2; padding: 10px 8px; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right;">
            <div style="margin-bottom: 5px;">Subtotal: ${formatPrice(order.itemsPrice)}</div>
            <div style="margin-bottom: 5px;">Shipping: ${order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</div>
            <div style="margin-bottom: 5px;">Tax (5% GST): ${formatPrice(order.taxPrice)}</div>
            <div style="font-weight: bold; font-size: 1.2em; margin-top: 10px; padding-top: 10px; border-top: 2px solid #ddd;">Total: ${formatPrice(order.totalPrice)}</div>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 0.9em; color: #666;">
          <p>Thank you for your purchase!</p>
          <p>For any questions, please contact us at support@prashasaksamiti.com</p>
          <p>&copy; ${new Date().getFullYear()} Prashasak Samiti. All rights reserved.</p>
        </div>
      </div>
    `;
  };

  return (
    <button
      onClick={generatePDF}
      disabled={generating}
      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {generating ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Download PDF Receipt
        </>
      )}
    </button>
  );
};

export default ReceiptPdfGenerator;
