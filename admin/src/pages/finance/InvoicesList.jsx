import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  FileText,
  Plus,
  QrCode,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  DollarSign,
  Search,
  Building
} from 'lucide-react';

export default function InvoicesList() {
  const [invoices, setInvoices] = useState([]);
  const [tripRequests, setTripRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    tripRequestId: '',
    dueDate: '',
    taxPercentage: 5,
    itemizedNotes: ''
  });
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [invRes, reqRes] = await Promise.all([
        api.get('/finance/invoices'),
        api.get('/trip-requests')
      ]);
      setInvoices(invRes || []);
      setTripRequests(reqRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenInvoice = async (invoiceId) => {
    try {
      const res = await api.get(`/finance/invoices/${invoiceId}`);
      setSelectedInvoiceData(res);
    } catch (e) {
      alert('Failed to load invoice details: ' + e.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/finance/invoices', createForm);
      setFeedback('Invoice generated successfully.');
      setShowCreateModal(false);
      await loadData();
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold mb-1">
            <FileText className="w-4 h-4 text-emerald-600" />
            Billing, Invoicing & Receipts
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Invoices & Payment Requests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue formal customer invoices, generate UPI payment requests, and track balances.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Generate Invoice
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback('')} className="font-bold text-brand-700 hover:text-brand-900">×</button>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Trip Request</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Amount Received</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-brand-700">
                    {inv.invoiceId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {inv.customerName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {inv.tripRequestId}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    ₹{inv.totalAmount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold">
                    ₹{inv.amountReceived?.toLocaleString() || 0}
                  </td>
                  <td className="py-3 px-4 font-bold text-rose-600">
                    ₹{inv.balanceDue?.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {inv.dueDate || 'TBD'}
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={inv.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenInvoice(inv.id)}
                      className="px-3 py-1 rounded bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs border border-brand-200 transition"
                    >
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {showCreateModal && (
        <Modal isOpen={true} onClose={() => setShowCreateModal(false)} title="Issue Customer Invoice">
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                Select Trip Request
              </label>
              <select
                required
                value={createForm.tripRequestId}
                onChange={(e) => setCreateForm({ ...createForm, tripRequestId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
              >
                <option value="">-- Select Trip Request --</option>
                {tripRequests.map(r => (
                  <option key={r.tripRequestId} value={r.tripRequestId}>
                    {r.tripRequestId} — {r.customerName} (₹{r.agreedAmount?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Payment Due Date</label>
                <input
                  type="date"
                  required
                  value={createForm.dueDate}
                  onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Applicable Tax %</label>
                <input
                  type="number"
                  value={createForm.taxPercentage}
                  onChange={(e) => setCreateForm({ ...createForm, taxPercentage: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Itemized Description</label>
              <textarea
                rows={2}
                value={createForm.itemizedNotes}
                onChange={(e) => setCreateForm({ ...createForm, itemizedNotes: e.target.value })}
                placeholder="Comprehensive package charges including boutique stays, permits, vehicle..."
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg text-xs">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold shadow-sm">
                Issue Invoice
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Printable Invoice Modal with QR Pay */}
      {selectedInvoiceData && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInvoiceData(null)}
          title={`Invoice: ${selectedInvoiceData.invoice.invoiceId}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 text-xs text-slate-800 p-2">
            {/* Invoice Top Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <div className="text-base font-bold text-slate-900 font-serif">
                  {selectedInvoiceData.company.name}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">{selectedInvoiceData.company.address}</div>
                <div className="text-slate-500 text-[11px] font-mono mt-0.5">GSTIN: {selectedInvoiceData.company.gstNumber}</div>
                <div className="text-slate-500 text-[11px]">{selectedInvoiceData.company.supportEmail}</div>
              </div>

              <div className="text-right">
                <span className="text-lg font-black font-mono text-brand-700 block">{selectedInvoiceData.invoice.invoiceId}</span>
                <span className="text-slate-500 text-[11px] block">Date: {new Date(selectedInvoiceData.invoice.createdAt).toLocaleDateString()}</span>
                <span className="text-rose-600 text-[11px] font-semibold block">Due: {selectedInvoiceData.invoice.dueDate}</span>
                <div className="mt-1"><Badge status={selectedInvoiceData.invoice.status} /></div>
              </div>
            </div>

            {/* Customer Billed To */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Billed To</span>
                <div className="font-bold text-sm text-slate-900">{selectedInvoiceData.invoice.customerName}</div>
                <div className="text-slate-600">{selectedInvoiceData.invoice.customerPhone}</div>
                <div className="text-slate-600">{selectedInvoiceData.invoice.customerEmail}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Trip Reference</span>
                <div className="font-semibold text-slate-900">{selectedInvoiceData.invoice.packageName}</div>
                <div className="text-slate-600">{selectedInvoiceData.invoice.travelDates}</div>
                <div className="text-slate-600">{selectedInvoiceData.invoice.travellerCount} Travellers</div>
              </div>
            </div>

            {/* Charges Table */}
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-3">{selectedInvoiceData.invoice.itemizedNotes}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">₹{selectedInvoiceData.invoice.totalAmount?.toLocaleString()}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td className="py-2 px-3 text-slate-600">Total Invoice Amount</td>
                  <td className="py-2 px-3 text-right font-mono text-sm">₹{selectedInvoiceData.invoice.totalAmount?.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-600">Amount Received</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-600">₹{selectedInvoiceData.invoice.amountReceived?.toLocaleString()}</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 px-3 text-slate-900 font-black">Net Balance Due</td>
                  <td className="py-2 px-3 text-right font-mono text-base font-black text-rose-600">₹{selectedInvoiceData.invoice.balanceDue?.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            {/* Demonstration UPI QR Payment Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 bg-white border border-emerald-300 rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-sm">
                <QrCode className="w-20 h-20 text-slate-800" />
                <span className="text-[8px] font-mono font-bold text-slate-500">Scan via UPI</span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Instant UPI Payment Instructions (Demonstration)
                </span>
                <p className="text-emerald-800 text-[11px]">
                  Scan using Google Pay, PhonePe, Paytm, or BHIM.
                </p>
                <div className="font-mono text-slate-700 bg-white px-2 py-1 rounded border border-emerald-200 inline-block font-bold">
                  UPI VPA: {selectedInvoiceData.upi.upiId}
                </div>
                <div className="text-[10px] text-slate-500">
                  After payment, provide the 12-digit UTR/transaction reference to Sales or Finance for reconciliation.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs shadow flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
