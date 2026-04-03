import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import SellerLayout from '../components/SellerLayout';
import api from '../utils/api';

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, statusFilter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('sellerToken');
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 10,
        ...(statusFilter && { status: statusFilter })
      });
      
      const response = await api.get(`/seller/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrders(response.data.data || []);
      setPagination(response.data.pagination || { current: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('sellerToken');
      await api.patch(`/seller/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePrintInvoice = async (order) => {
    try {
      const printWindow = window.open('', '_blank');
      const invoiceHTML = await generateInvoiceHTML(order);
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error('Error printing invoice:', error);
      alert('Failed to print invoice');
    }
  };

  const handleDownloadInvoice = async (order) => {
    try {
      const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const invoiceNo = `INV-${order._id?.slice(-5) || '00000'}`;
      const gstAmount = Math.round(order.totalAmount * 0.18);
      const totalWithGST = order.totalAmount + gstAmount;

      // Generate QR Code in black and white
      const qrData = JSON.stringify({
        orderId: order.orderId || order._id,
        invoice: invoiceNo,
        amount: totalWithGST,
        date: orderDate,
        customer: order.shippingAddress?.name || 'Customer'
      });
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Create PDF - A4 size for better clarity
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Set font
      pdf.setFont('helvetica');

      // Header - TAX INVOICE
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('TAX INVOICE', 105, 20, { align: 'center' });
      
      pdf.setLineWidth(1);
      pdf.setDrawColor(0, 0, 0);
      pdf.line(15, 25, 195, 25);

      // Company Info Section
      pdf.setLineWidth(0.5);
      pdf.rect(15, 30, 180, 35, 'D');

      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Royal Wedding Cards', 20, 38);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Patna, Bihar - 800001', 20, 46);
      pdf.text('Phone: +91 9876543210', 20, 52);
      pdf.text('Email: info@royalweddingcards.com', 20, 58);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('GSTIN: 10ABCDE1234F1Z5', 20, 64);

      // Invoice Details Grid
      const boxWidth = 43;
      const boxHeight = 18;
      let startX = 15;
      const startY = 75;

      // Order ID Box
      pdf.setLineWidth(0.5);
      pdf.rect(startX, startY, boxWidth, boxHeight, 'D');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ORDER ID', startX + 2, startY + 6);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(order.orderId || order._id?.slice(-8).toUpperCase(), startX + 2, startY + 13);

      // Invoice No Box
      startX += boxWidth + 2;
      pdf.rect(startX, startY, boxWidth, boxHeight, 'D');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVOICE NO', startX + 2, startY + 6);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoiceNo, startX + 2, startY + 13);

      // Date Box
      startX += boxWidth + 2;
      pdf.rect(startX, startY, boxWidth, boxHeight, 'D');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DATE', startX + 2, startY + 6);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(orderDate, startX + 2, startY + 13);

      // Status Box
      startX += boxWidth + 2;
      pdf.rect(startX, startY, boxWidth, boxHeight, 'D');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('STATUS', startX + 2, startY + 6);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const status = (order.orderStatus || order.status || 'Ordered');
      pdf.text(status.charAt(0).toUpperCase() + status.slice(1), startX + 2, startY + 13);

      // Ship To Section
      pdf.setLineWidth(0.5);
      pdf.rect(15, 100, 120, 35, 'D');
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SHIP TO:', 18, 108);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const shipName = order.shippingAddress?.name || order.user?.name || 'Customer';
      const shipMobile = order.shippingAddress?.mobile || 'N/A';
      const shipAddr1 = order.shippingAddress?.addressLine1 || '';
      const shipAddr2 = order.shippingAddress?.addressLine2 || '';
      const shipCity = order.shippingAddress?.city || '';
      const shipState = order.shippingAddress?.state || '';
      const shipPin = order.shippingAddress?.pincode || '';
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(shipName, 18, 115);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Mobile: ${shipMobile}`, 18, 121);
      const addr = `${shipAddr1}${shipAddr2 ? ', ' + shipAddr2 : ''}`;
      pdf.text(addr.substring(0, 45), 18, 127);
      pdf.text(`${shipCity}, ${shipState} - ${shipPin}`, 18, 133);

      // QR Code
      pdf.addImage(qrCodeDataURL, 'PNG', 145, 100, 45, 45);
      pdf.setFontSize(8);
      pdf.text('Scan for Details', 167.5, 148, { align: 'center' });

      // Items Table
      const tableStartY = 145;
      
      // Table Header
      pdf.setLineWidth(0.5);
      pdf.setFillColor(0, 0, 0);
      pdf.rect(15, tableStartY, 180, 10, 'FD');
      
      pdf.setFontSize(11);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ITEM DESCRIPTION', 18, tableStartY + 7);
      pdf.text('QTY', 118, tableStartY + 7, { align: 'center' });
      pdf.text('PRICE', 145, tableStartY + 7, { align: 'right' });
      pdf.text('AMOUNT', 190, tableStartY + 7, { align: 'right' });

      // Table Row
      pdf.setTextColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(15, tableStartY + 10, 180, 25, 'D');
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const itemName = order.productInfo?.name || 'Wedding Invitation Card';
      pdf.text(itemName.substring(0, 45), 18, tableStartY + 18);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('With QR Scanner Technology', 18, tableStartY + 24);
      pdf.text('Premium Quality Print', 18, tableStartY + 30);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(order.quantity || 1), 118, tableStartY + 22, { align: 'center' });
      pdf.text(`Rs ${order.pricePerCard || 0}`, 145, tableStartY + 22, { align: 'right' });
      pdf.text(`Rs ${order.totalAmount || 0}`, 190, tableStartY + 22, { align: 'right' });

      // Totals Section
      const totalsStartY = tableStartY + 45;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Item Total:', 130, totalsStartY);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Rs ${order.totalAmount || 0}`, 190, totalsStartY, { align: 'right' });

      pdf.setFont('helvetica', 'normal');
      pdf.text('GST (18%):', 130, totalsStartY + 8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Rs ${gstAmount}`, 190, totalsStartY + 8, { align: 'right' });

      // Total Paid
      pdf.setLineWidth(1);
      pdf.rect(125, totalsStartY + 12, 70, 10, 'D');
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TOTAL PAID:', 130, totalsStartY + 19);
      pdf.text(`Rs ${totalWithGST}`, 190, totalsStartY + 19, { align: 'right' });

      // Payment Info
      pdf.setLineWidth(0.5);
      pdf.rect(15, totalsStartY + 30, 180, 12, 'D');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const paymentMethod = (order.paymentMethod || 'UPI').toUpperCase();
      pdf.text(`Payment: Paid via ${paymentMethod}`, 18, totalsStartY + 38);

      // Declaration
      pdf.setLineWidth(0.5);
      pdf.rect(15, totalsStartY + 48, 180, 20, 'D');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DECLARATION:', 18, totalsStartY + 55);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const declarationText = 'We declare that this invoice shows the actual price of the goods';
      const declarationText2 = 'described. Goods sold are for end user consumption only.';
      pdf.text(declarationText, 18, totalsStartY + 61);
      pdf.text(declarationText2, 18, totalsStartY + 66);

      // Signature Section
      pdf.setFontSize(9);
      pdf.text('For Royal Wedding Cards', 18, totalsStartY + 85);
      
      pdf.setLineWidth(0.5);
      pdf.line(18, totalsStartY + 105, 70, totalsStartY + 105);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Authorized Signatory', 18, totalsStartY + 110);

      // Footer
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Thank you for your business!', 105, totalsStartY + 130, { align: 'center' });
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('This is a computer-generated invoice and does not require a signature.', 105, totalsStartY + 138, { align: 'center' });
      pdf.text('For support: support@royalweddingcards.com | +91 9876543210', 105, totalsStartY + 144, { align: 'center' });

      // Save PDF
      pdf.save(`Invoice-${order.orderId || order._id?.slice(-8).toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to download invoice');
    }
  };

  const generateInvoiceHTML = async (order) => {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const invoiceNo = `INV-${order._id?.slice(-5) || '00000'}`;
    const gstAmount = Math.round(order.totalAmount * 0.18);
    const totalWithGST = order.totalAmount + gstAmount;

    // Generate QR Code with order information
    const qrData = JSON.stringify({
      orderId: order.orderId || order._id,
      invoice: invoiceNo,
      amount: totalWithGST,
      date: orderDate,
      customer: order.shippingAddress?.name || 'Customer'
    });
    
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 100,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${order.orderId || order._id?.slice(-8).toUpperCase()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      background: white;
      width: 6in;
      height: 3in;
      padding: 0;
      margin: 0;
    }
    .invoice-container { 
      width: 6in;
      height: 3in;
      background: white; 
      padding: 0.2in;
      position: relative;
      font-size: 8px;
    }
    
    /* Header */
    .tax-header { 
      text-align: center; 
      border-bottom: 1.5px solid #333; 
      padding-bottom: 4px; 
      margin-bottom: 6px; 
    }
    .tax-header h1 { 
      font-size: 14px; 
      color: #333; 
      margin: 0;
      font-weight: bold;
    }
    
    /* Two Column Layout */
    .content-wrapper {
      display: flex;
      gap: 0.15in;
    }
    .left-column {
      flex: 1;
    }
    .right-column {
      width: 0.9in;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    /* Company Info */
    .company-info { 
      margin-bottom: 6px; 
      padding: 4px; 
      background: #f9f9f9; 
      border-left: 2px solid #ff6b35; 
    }
    .company-info h2 { 
      font-size: 10px; 
      color: #333; 
      margin-bottom: 2px;
      font-weight: bold;
    }
    .company-info p { 
      font-size: 7px; 
      color: #666; 
      line-height: 1.3; 
    }
    .company-info .gstin { 
      font-weight: bold; 
      color: #ff6b35; 
    }
    
    /* Invoice Details */
    .invoice-details { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 4px; 
      margin-bottom: 6px; 
    }
    .detail-box { 
      padding: 3px; 
      border: 0.5px solid #ddd; 
      background: #fafafa; 
    }
    .detail-box h3 { 
      font-size: 6px; 
      color: #888; 
      text-transform: uppercase; 
      margin-bottom: 1px; 
    }
    .detail-box p { 
      font-size: 7px; 
      color: #333; 
      font-weight: 600; 
    }
    
    /* Ship To */
    .ship-to { 
      margin-bottom: 6px; 
      padding: 4px; 
      border: 0.5px solid #ddd; 
      background: #fcfcfc;
    }
    .ship-to h3 { 
      font-size: 7px; 
      color: #333; 
      margin-bottom: 2px; 
      font-weight: bold;
    }
    .ship-to p { 
      font-size: 6px; 
      color: #666; 
      line-height: 1.3; 
    }
    
    /* Items Table */
    .items-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-bottom: 6px; 
      font-size: 7px;
    }
    .items-table th { 
      background: #333; 
      color: white; 
      padding: 3px; 
      text-align: left; 
      font-size: 7px; 
    }
    .items-table td { 
      padding: 3px; 
      border: 0.5px solid #ddd; 
      font-size: 7px; 
    }
    .items-table .item-desc { 
      font-weight: 600; 
      color: #333; 
    }
    .items-table .item-note { 
      font-size: 6px; 
      color: #888; 
    }
    
    /* Totals */
    .totals { 
      margin-left: auto; 
      width: 100%; 
    }
    .totals table { 
      width: 100%; 
      border-collapse: collapse; 
    }
    .totals td { 
      padding: 2px; 
      font-size: 7px; 
      border-bottom: 0.5px solid #eee; 
    }
    .totals .label { 
      color: #666; 
    }
    .totals .amount { 
      text-align: right; 
      font-weight: 600; 
      color: #333; 
    }
    .totals .total-row td { 
      font-size: 8px; 
      font-weight: bold; 
      color: #fff; 
      background: #ff6b35; 
      border: none; 
      padding: 3px; 
    }
    
    /* Payment */
    .payment-info { 
      margin: 4px 0; 
      padding: 3px; 
      background: #e8f5e9; 
      border-left: 2px solid #4caf50; 
    }
    .payment-info p { 
      font-size: 6px; 
      color: #2e7d32; 
      font-weight: 600; 
    }
    
    /* QR Code Section */
    .qr-box { 
      text-align: center; 
      margin-bottom: 6px;
    }
    .qr-box img { 
      width: 0.8in; 
      height: 0.8in; 
      border: 1px solid #ddd; 
      padding: 2px;
      background: white;
    }
    .qr-box p { 
      font-size: 6px; 
      color: #888; 
      margin-top: 2px; 
    }
    
    /* Declaration */
    .declaration { 
      padding: 3px; 
      background: #fff9e6; 
      border: 0.5px dashed #ffc107; 
      font-size: 5px;
      margin-top: 4px;
    }
    .declaration p { 
      color: #856404; 
      line-height: 1.2; 
    }
    
    /* Footer */
    .footer { 
      margin-top: 4px; 
      padding-top: 3px; 
      border-top: 0.5px solid #ddd; 
      text-align: center; 
    }
    .footer p { 
      font-size: 5px; 
      color: #999; 
      line-height: 1.3; 
    }
    
    @media print {
      body { 
        margin: 0;
        padding: 0;
      }
      .invoice-container { 
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="tax-header">
      <h1>🧾 TAX INVOICE</h1>
    </div>

    <div class="content-wrapper">
      <div class="left-column">
        <!-- Company Info -->
        <div class="company-info">
          <h2>Royal Wedding Cards</h2>
          <p>
            Patna, Bihar - 800001 | Phone: +91 9876543210<br>
            Email: info@royalweddingcards.com<br>
            <span class="gstin">GSTIN: 10ABCDE1234F1Z5</span>
          </p>
        </div>

        <!-- Invoice Details -->
        <div class="invoice-details">
          <div class="detail-box">
            <h3>Order ID</h3>
            <p>${order.orderId || order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <div class="detail-box">
            <h3>Invoice No</h3>
            <p>${invoiceNo}</p>
          </div>
          <div class="detail-box">
            <h3>Date</h3>
            <p>${orderDate}</p>
          </div>
          <div class="detail-box">
            <h3>Status</h3>
            <p style="text-transform: capitalize;">${order.orderStatus || order.status || 'Ordered'}</p>
          </div>
        </div>

        <!-- Ship To -->
        <div class="ship-to">
          <h3>📦 Ship To:</h3>
          <p>
            <strong>${order.shippingAddress?.name || order.user?.name || 'Customer'}</strong><br>
            Mobile: ${order.shippingAddress?.mobile || 'N/A'}<br>
            ${order.shippingAddress?.addressLine1 || ''}${order.shippingAddress?.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}<br>
            ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}
          </p>
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 50%;">Item</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 17.5%; text-align: right;">Price</th>
              <th style="width: 17.5%; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="item-desc">${order.productInfo?.name || 'Wedding Card'}</div>
                <div class="item-note">✓ QR Scanner | Premium Print</div>
              </td>
              <td style="text-align: center;"><strong>${order.quantity || 1}</strong></td>
              <td style="text-align: right;">₹${order.pricePerCard || 0}</td>
              <td style="text-align: right;"><strong>₹${order.totalAmount || 0}</strong></td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
          <table>
            <tr>
              <td class="label">Item Total:</td>
              <td class="amount">₹${order.totalAmount || 0}</td>
            </tr>
            <tr>
              <td class="label">GST (18%):</td>
              <td class="amount">₹${gstAmount}</td>
            </tr>
            <tr class="total-row">
              <td>Total Paid:</td>
              <td style="text-align: right;">₹${totalWithGST}</td>
            </tr>
          </table>
        </div>

        <!-- Payment Info -->
        <div class="payment-info">
          <p>✓ Payment: Paid via ${order.paymentMethod?.toUpperCase() || 'UPI'}</p>
        </div>

        <!-- Declaration -->
        <div class="declaration">
          <p>
            <strong>Declaration:</strong> Goods sold are for end user consumption only. 
            This invoice shows actual price and all particulars are true and correct.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>
            Thank you for shopping with us! 🎉<br>
            For support: support@royalweddingcards.com | +91 9876543210
          </p>
        </div>
      </div>

      <div class="right-column">
        <!-- QR Code -->
        <div class="qr-box">
          <img src="${qrCodeDataURL}" alt="QR Code">
          <p>Scan for Details</p>
        </div>
        
        <!-- Signature -->
        <div style="text-align: center; margin-top: auto;">
          <p style="font-size: 6px; color: #666; margin-bottom: 15px;">For Royal Wedding Cards</p>
          <p style="font-size: 6px; color: #333; font-weight: 600; border-top: 0.5px solid #333; padding-top: 2px;">Authorized Signatory</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'printing': return 'bg-purple-100 text-purple-700';
      case 'shipped': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      // Old statuses
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const statuses = [
    { value: '', label: 'All Orders' },
    { value: 'ordered', label: 'Ordered' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'printing', label: 'Printing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <SellerLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-gray-600">Manage orders for your products</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPagination({ ...pagination, current: 1 });
          }}
          className="px-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">Orders for your products will appear here</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-600">Order ID</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Customer</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Amount</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                    <th className="text-right p-4 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono text-sm">#{order._id?.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.user?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{order.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-800">₹{order.totalAmount || 0}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus || order.status)}`}>
                          {order.orderStatus || order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Print Invoice"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download Invoice"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                disabled={pagination.current === 1}
                className="px-4 py-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.current} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                disabled={pagination.current === pagination.pages}
                className="px-4 py-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Order #{selectedOrder._id?.slice(-8).toUpperCase()}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{selectedOrder.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedOrder.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{selectedOrder.user?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Product Info */}
            {selectedOrder.productInfo && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Product Details</h4>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  {selectedOrder.productInfo.image && (
                    <img 
                      src={selectedOrder.productInfo.image} 
                      alt={selectedOrder.productInfo.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{selectedOrder.productInfo.name || 'Product'}</p>
                    <p className="text-sm text-gray-500">Quantity: {selectedOrder.quantity || 1}</p>
                    <p className="text-sm text-gray-500">Price per card: ₹{selectedOrder.pricePerCard || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-800">₹{selectedOrder.totalAmount || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Address */}
            {selectedOrder.shippingAddress && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Shipping Address</h4>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.mobile}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedOrder.shippingAddress.addressLine1}
                    {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl mb-6">
              <span className="font-semibold text-gray-800">Total Amount</span>
              <span className="text-2xl font-bold text-orange-600">₹{selectedOrder.totalAmount || 0}</span>
            </div>

            {/* Print & Download Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handlePrintInvoice(selectedOrder)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>
              <button
                onClick={() => handleDownloadInvoice(selectedOrder)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Invoice
              </button>
            </div>

            {/* Status Update */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Update Order Status</h4>
              <div className="flex flex-wrap gap-2">
                {['confirmed', 'printing', 'shipped', 'delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder._id, status)}
                    disabled={selectedOrder.orderStatus === status || selectedOrder.orderStatus === 'cancelled'}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      selectedOrder.orderStatus === status
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerOrdersPage;
