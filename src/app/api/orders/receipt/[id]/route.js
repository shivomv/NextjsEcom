import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Order from '@/models/orderModel';
import { authMiddleware } from '@/utils/auth';
import User from '@/models/userModel';
const { generateSimplePDF } = require('@/utils/simplePdfGenerator');
const { htmlToPdf } = require('@/utils/htmlToPdf');

export async function GET(request, { params }) {
  try {
    // Get the URL parameters
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'html';

    // Authenticate user
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    const { id } = params;

    // Connect to database
    await dbConnect();

    // Find order by ID
    const order = await Order.findById(id).populate('user', 'name email');

    // Check if order exists
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this order
    if (order.user._id.toString() !== authResult.user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Not authorized to access this order' },
        { status: 401 }
      );
    }

    // Get user details
    const user = await User.findById(order.user._id);

    // Always generate a PDF for download
    try {
      console.log('Generating PDF for order:', order._id);

      // Generate PDF
      const pdfBuffer = await generateSimplePDF(order, user);

      console.log('PDF generated successfully, buffer size:', pdfBuffer.length);

      // Return PDF with appropriate headers for download
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="receipt-${order.paymentResult?.receipt_number || order._id}.pdf"`,
        },
      });
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      console.error('Error details:', {
        name: pdfError.name,
        message: pdfError.message,
        stack: pdfError.stack,
      });

      // Try to convert HTML to PDF as a fallback
      try {
        console.log('Attempting to convert HTML to PDF as fallback');
        const receiptHtml = generateReceiptHtml(order, user);
        const pdfBuffer = await htmlToPdf(receiptHtml);

        console.log('HTML-to-PDF conversion successful, buffer size:', pdfBuffer.length);

        // Return PDF with appropriate headers for download
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="receipt-${order.paymentResult?.receipt_number || order._id}.pdf"`,
          },
        });
      } catch (htmlToPdfError) {
        console.error('HTML-to-PDF conversion failed:', htmlToPdfError);

        // Final fallback to HTML
        const receiptHtml = generateReceiptHtml(order, user);

        // Return receipt HTML with appropriate headers for download
        return new NextResponse(receiptHtml, {
          headers: {
            'Content-Type': 'text/html',
            'Content-Disposition': `attachment; filename="receipt-${order.paymentResult?.receipt_number || order._id}.html"`,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error generating receipt:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}

// Function to generate receipt HTML
function generateReceiptHtml(order, user) {
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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt #${receiptNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .receipt {
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 5px;
        }
        .receipt-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        .receipt-header h1 {
          color: #6602C2;
          margin: 0;
        }
        .receipt-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .receipt-details div {
          flex: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background-color: #f2f2f2;
          padding: 10px 8px;
          text-align: left;
          border-bottom: 2px solid #ddd;
        }
        .summary {
          margin-top: 20px;
          text-align: right;
        }
        .summary div {
          margin-bottom: 5px;
        }
        .total {
          font-weight: bold;
          font-size: 1.2em;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #ddd;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 0.9em;
          color: #666;
        }
        .print-button {
          background-color: #6602C2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-bottom: 20px;
        }
        @media print {
          .print-button {
            display: none;
          }
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <button class="print-button" onclick="window.print()">Print Receipt</button>

      <div class="receipt">
        <div class="receipt-header">
          <h1>Prashasak Samiti</h1>
          <p>Receipt #${receiptNumber}</p>
        </div>

        <div class="receipt-details">
          <div>
            <h3>Bill To:</h3>
            <p>
              ${user.name}<br>
              ${user.email}<br>
              ${order.shippingAddress.phone}
            </p>
          </div>

          <div>
            <h3>Ship To:</h3>
            <p>
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>

          <div>
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

        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
        </table>

        <div class="summary">
          <div>Subtotal: ${formatPrice(order.itemsPrice)}</div>
          <div>Shipping: ${order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</div>
          <div>Tax (5% GST): ${formatPrice(order.taxPrice)}</div>
          <div class="total">Total: ${formatPrice(order.totalPrice)}</div>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your purchase!</p>
        <p>For any questions, please contact us at support@prashasaksamiti.com</p>
        <p>&copy; ${new Date().getFullYear()} Prashasak Samiti. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}
