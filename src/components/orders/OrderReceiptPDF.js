'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  BlobProvider,
  Font
} from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: '1px solid #EEEEEE',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#6602C2',
    marginBottom: 5,
  },
  receiptNumber: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#666666',
  },
  value: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tableItemCell: {
    width: '40%',
  },
  tableQtyCell: {
    width: '15%',
    textAlign: 'center',
  },
  tablePriceCell: {
    width: '20%',
    textAlign: 'right',
  },
  tableTotalCell: {
    width: '25%',
    textAlign: 'right',
  },
  summary: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  summaryLabel: {
    width: 100,
    fontSize: 12,
    textAlign: 'right',
    paddingRight: 10,
  },
  summaryValue: {
    width: 80,
    fontSize: 12,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: 80,
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'right',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
});

// Format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format price
const formatPrice = (price) => {
  // Convert to number and format with 2 decimal places
  const formattedPrice = Number(price).toFixed(2);
  // Use "Rs." instead of the Rupee symbol to avoid encoding issues
  return 'Rs. ' + formattedPrice;
};

// Create Receipt Document Component
const OrderReceiptDocument = ({ order, user }) => {
  // Get receipt number
  const receiptNumber = order.paymentResult?.receipt_number ||
    `RCP${order._id.toString().substr(-6)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Prashasak Samiti</Text>
          <Text style={styles.receiptNumber}>Receipt #{receiptNumber}</Text>
        </View>

        {/* Customer and Order Information */}
        <View style={styles.row}>
          {/* Billing Information */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <Text style={styles.value}>{user?.name || 'Customer'}</Text>
            <Text style={styles.value}>{user?.email || ''}</Text>
            <Text style={styles.value}>{order.shippingAddress.phone || ''}</Text>
          </View>

          {/* Shipping Information */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Ship To:</Text>
            <Text style={styles.value}>{order.shippingAddress.name || ''}</Text>
            <Text style={styles.value}>{order.shippingAddress.addressLine1 || ''}</Text>
            {order.shippingAddress.addressLine2 && (
              <Text style={styles.value}>{order.shippingAddress.addressLine2}</Text>
            )}
            <Text style={styles.value}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </Text>
            <Text style={styles.value}>{order.shippingAddress.country || ''}</Text>
          </View>

          {/* Order Details */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Order Details:</Text>
            <Text style={styles.value}>Order #: {order.orderNumber || order._id}</Text>
            <Text style={styles.value}>Date: {formatDate(order.createdAt)}</Text>
            <Text style={styles.value}>Payment Method: {order.paymentMethod}</Text>
            {order.isPaid && (
              <Text style={styles.value}>Payment Date: {formatDate(order.paidAt)}</Text>
            )}
            {order.paymentResult?.id && (
              <Text style={styles.value}>Transaction ID: {order.paymentResult.id}</Text>
            )}
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items:</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableItemCell]}>Item</Text>
              <Text style={[styles.tableCell, styles.tableQtyCell]}>Qty</Text>
              <Text style={[styles.tableCell, styles.tablePriceCell]}>Price</Text>
              <Text style={[styles.tableCell, styles.tableTotalCell]}>Total</Text>
            </View>

            {/* Table Rows */}
            {order.orderItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableItemCell]}>{item.name}</Text>
                <Text style={[styles.tableCell, styles.tableQtyCell]}>{item.qty}</Text>
                <Text style={[styles.tableCell, styles.tablePriceCell]}>{formatPrice(item.price)}</Text>
                <Text style={[styles.tableCell, styles.tableTotalCell]}>{formatPrice(item.price * item.qty)}</Text>
              </View>
            ))}
          </View>

          {/* Order Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatPrice(order.itemsPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping:</Text>
              <Text style={styles.summaryValue}>
                {order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5% GST):</Text>
              <Text style={styles.summaryValue}>{formatPrice(order.taxPrice)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatPrice(order.totalPrice)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your purchase!</Text>
          <Text>For any questions, please contact us at support@prashasaksamiti.com</Text>
          <Text>© {new Date().getFullYear()} Prashasak Samiti. All rights reserved.</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Download Button Component
const OrderReceiptPDF = ({ order, user }) => {
  const [isClient, setIsClient] = React.useState(false);

  // Check if we're in the browser
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to download blob
  const downloadBlob = (blob, filename) => {
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Append to the document
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // If not in browser yet, show loading button
  if (!isClient) {
    return (
      <button
        disabled={true}
        className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Initializing...
      </button>
    );
  }

  // Use BlobProvider for more reliable downloads
  return (
    <BlobProvider document={<OrderReceiptDocument order={order} user={user} />}>
      {({ blob, url, loading, error }) => (
        <button
          disabled={loading}
          onClick={() => {
            if (blob) {
              const filename = `receipt-${order.paymentResult?.receipt_number || order._id}.pdf`;
              downloadBlob(blob, filename);
            }
          }}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : error ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Error: Try Again
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
      )}
    </BlobProvider>
  );
};

export default OrderReceiptPDF;
