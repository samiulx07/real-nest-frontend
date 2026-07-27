export interface ReceiptData {
  invoiceNumber: string;
  date: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  propertyTitle: string;
  flatNumber: string;
  floorNumber: number;
  flatSize: number;
  totalFlatPrice: number;
  paidAmount: number;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: string;
}

export const generateReceiptPDF = (data: ReceiptData) => {
  const windowPrint = window.open("", "", "width=850,height=1000");

  if (!windowPrint) {
    alert("Please allow popups to download or print the PDF receipt.");
    return;
  }

  const formattedTotal = Number(data.totalFlatPrice).toLocaleString();
  const formattedPaid = Number(data.paidAmount).toLocaleString();
  const dueAmount = Math.max(0, data.totalFlatPrice - data.paidAmount).toLocaleString();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Receipt - ${data.invoiceNumber}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            margin: 0;
            padding: 40px;
            color: #00062A;
            background: #ffffff;
          }
          .receipt-box {
            max-width: 750px;
            margin: 0 auto;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }
          .brand {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: -0.5px;
          }
          .brand span { color: #FF4C00; }
          .subtitle {
            font-size: 11px;
            color: #64748b;
            margin-top: 4px;
          }
          .invoice-meta {
            text-align: right;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .badge-success { background: #dcfce7; color: #166534; }
          .badge-pending { background: #fef3c7; color: #92400e; }

          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .info-card {
            background: #f8fafc;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid #f1f5f9;
          }
          .info-card h4 {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #94a3b8;
            margin: 0 0 8px 0;
          }
          .info-card p {
            margin: 2px 0;
            font-size: 12px;
            font-weight: 600;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background: #00062A;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            text-align: left;
            padding: 12px 16px;
          }
          th:first-child { border-top-left-radius: 10px; border-bottom-left-radius: 10px; }
          th:last-child { border-top-right-radius: 10px; border-bottom-right-radius: 10px; text-align: right; }
          td {
            padding: 14px 16px;
            font-size: 12px;
            border-bottom: 1px solid #f1f5f9;
          }
          td:last-child { text-align: right; font-weight: 800; }

          .total-box {
            background: #f8fafc;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 40px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 12px;
          }
          .total-row.grand {
            border-top: 2px solid #e2e8f0;
            padding-top: 12px;
            margin-top: 6px;
            font-size: 16px;
            font-weight: 900;
            color: #FF4C00;
          }

          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px dashed #cbd5e1;
          }
          .stamp {
            border: 2px solid #166534;
            color: #166534;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 900;
            font-size: 14px;
            transform: rotate(-5deg);
            display: inline-block;
          }
          .signature {
            text-align: center;
            width: 180px;
          }
          .signature-line {
            border-top: 1px solid #00062A;
            margin-bottom: 4px;
          }
          .signature p {
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            margin: 0;
          }

          @media print {
            body { padding: 0; }
            .receipt-box { border: none; shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <div>
              <div class="brand">Real<span>Nest</span></div>
              <div class="subtitle">RealNest Properties Ltd. | Gulshan, Dhaka</div>
              <div class="subtitle">Hotline: +880 1700-000000 | info@realnest.com</div>
            </div>
            <div class="invoice-meta">
              <span class="badge ${data.paymentStatus === 'VALIDATED' || data.paymentStatus === 'APPROVED' ? 'badge-success' : 'badge-pending'}">
                ${data.paymentStatus}
              </span>
              <div style="font-size: 14px; font-weight: 900;">${data.invoiceNumber}</div>
              <div class="subtitle">Date: ${data.date}</div>
              <div class="subtitle">Ref: ${data.bookingNumber}</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="info-card">
              <h4>Billed To (Customer)</h4>
              <p style="font-size: 14px; font-weight: 800;">${data.customerName}</p>
              <p>${data.customerEmail}</p>
              <p>${data.customerPhone}</p>
            </div>

            <div class="info-card">
              <h4>Property Details</h4>
              <p style="font-size: 14px; font-weight: 800;">${data.propertyTitle}</p>
              <p>Unit Code: <strong>Flat ${data.flatNumber}</strong> (Floor: G+${data.floorNumber})</p>
              <p>Size: ${data.flatSize} sqft</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Payment Method</th>
                <th>Transaction Reference</th>
                <th>Amount (BDT)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Flat Reservation Downpayment</strong><br>
                  <span style="font-size: 10px; color: #64748b;">${data.propertyTitle} - Unit ${data.flatNumber}</span>
                </td>
                <td>${data.paymentMethod}</td>
                <td style="font-family: monospace;">${data.transactionId}</td>
                <td>৳ ${formattedPaid}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div class="total-row">
              <span>Total Agreement Flat Price:</span>
              <span>৳ ${formattedTotal}</span>
            </div>
            <div class="total-row">
              <span>Amount Paid This Transaction:</span>
              <span style="color: #166534; font-weight: 800;">৳ ${formattedPaid}</span>
            </div>
            <div class="total-row">
              <span>Remaining Balance Due:</span>
              <span>৳ ${dueAmount}</span>
            </div>
            <div class="total-row grand">
              <span>Total Payment Received:</span>
              <span>৳ ${formattedPaid}</span>
            </div>
          </div>

          <div class="footer">
            <div>
              <div class="stamp">OFFICIAL RECEIPT</div>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <p>Authorized Signature</p>
              <p>RealNest Accounts Dept.</p>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  windowPrint.document.write(htmlContent);
  windowPrint.document.close();
};
