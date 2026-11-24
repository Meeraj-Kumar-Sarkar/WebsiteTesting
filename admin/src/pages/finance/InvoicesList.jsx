import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loaders';
import { useToast } from '../../context/FeedbackContext';
import { usePreferences } from '../../context/PreferencesContext';
import {
  FileText,
  Plus,
  QrCode,
  Printer,
  CheckCircle2,
  Search,
  CreditCard
} from 'lucide-react';

export default function InvoicesList() {
  const [invoices, setInvoices] = useState([]);
  const [tripRequests, setTripRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    tripRequestId: '',
    dueDate: '',
    taxPercentage: 5,
    itemizedNotes: ''
  });

  // Record Payment Reference Modal
  const [paymentModalInvoice, setPaymentModalInvoice] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'UPI_QR_MANUAL',
    transactionRef: '',
    customerNotes: ''
  });
  const [paymentLoading, setPaymentLoading] = useState(false);

  const toast = useToast();
  const { formatDate } = usePreferences();

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
      toast.error('Failed to load invoices: ' + e.message);
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
      toast.error('Failed to load invoice details: ' + e.message);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await api.post('/finance/invoices', createForm);
      toast.success('Customer invoice generated successfully.');
      setShowCreateModal(false);
      setCreateForm({
        tripRequestId: '',
        dueDate: '',
        taxPercentage: 5,
        itemizedNotes: ''
      });
      await loadData();
    } catch (err) {
      toast.error(`Invoice creation failed: ${err.message}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;
    setPaymentLoading(true);
    try {
      await api.post('/payments', {
        invoiceId: paymentModalInvoice.invoiceId,
        amount: parseFloat(paymentForm.amount),
        method: paymentForm.method,
        transactionRef: paymentForm.transactionRef,
        customerNotes: paymentForm.customerNotes
      });
      toast.success('Payment reference submitted for verification.');
      setPaymentModalInvoice(null);
      setPaymentForm({ amount: '', method: 'UPI_QR_MANUAL', transactionRef: '', customerNotes: '' });
      await loadData();
    } catch (err) {
      toast.error(`Payment submission failed: ${err.message}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filtered = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      inv.invoiceId?.toLowerCase().includes(q) ||
      inv.customerName?.toLowerCase().includes(q) ||
      inv.tripRequestId?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Billing, Invoicing & Receipts"
        title="Invoices & Payment Requests"
        description="Issue formal customer invoices, generate UPI payment requests, and track balances across cleared trip itineraries."
        icon={FileText}
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" /> Generate Invoice
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice ID, customer name, trip request..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Invoices' },
            { id: 'UNPAID', label: 'Unpaid' },
            { id: 'PARTIALLY_PAID', label: 'Partially Paid' },
            { id: 'PAID', label: 'Paid' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterStatus === st.id
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Spinner className="w-7 h-7 text-brand-600" />
            <p className="text-xs text-slate-500">Retrieving customer invoice records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices found"
            description={search ? 'No invoices matched your search filter.' : 'No invoices generated under this category yet.'}
            action={
              <button onClick={() => setShowCreateModal(true)} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Issue First Invoice
              </button>
            }
          />
        ) : (
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
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">
                      {inv.invoiceId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {inv.customerName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {inv.tripRequestId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 tabular-nums">
                      ₹{inv.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold tabular-nums">
                      ₹{inv.amountReceived?.toLocaleString() || 0}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600 tabular-nums">
                      ₹{inv.balanceDue?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {inv.dueDate ? formatDate(inv.dueDate) : 'TBD'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={inv.status} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {inv.status !== 'PAID' && (
                        <button
                          onClick={() => {
                            setPaymentModalInvoice(inv);
                            setPaymentForm({
                              amount: String(inv.balanceDue || inv.totalAmount || ''),
                              method: 'UPI_QR_MANUAL',
                              transactionRef: '',
                              customerNotes: ''
                            });
                          }}
                          className="btn-primary py-1 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CreditCard className="w-3 h-3" /> Log Payment
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenInvoice(inv.id)}
                        className="btn-secondary py-1 px-3 text-xs"
                      >
                        View / Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Invoice Modal */}
      {showCreateModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCreateModal(false)}
          title="Issue Customer Invoice"
          description="Generate formal invoice billing customer for agreed itinerary quote."
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="generate-invoice-form"
                disabled={createLoading}
                className="btn-primary text-xs"
              >
                {createLoading ? 'Generating...' : 'Issue Invoice'}
              </button>
            </>
          }
        >
          <form id="generate-invoice-form" onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Trip Request <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={createForm.tripRequestId}
                onChange={(e) => setCreateForm({ ...createForm, tripRequestId: e.target.value })}
                className="input text-xs"
              >
                <option value="">-- Select Trip Request --</option>
                {tripRequests.map((r) => (
                  <option key={r.tripRequestId} value={r.tripRequestId}>
                    {r.tripRequestId} — {r.customerName} (₹{r.agreedAmount?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Due Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={createForm.dueDate}
                  onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Applicable Tax %</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={createForm.taxPercentage}
                  onChange={(e) => setCreateForm({ ...createForm, taxPercentage: Number(e.target.value) })}
                  className="input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Itemized Description</label>
              <textarea
                rows={2}
                value={createForm.itemizedNotes}
                onChange={(e) => setCreateForm({ ...createForm, itemizedNotes: e.target.value })}
                placeholder="Comprehensive package charges including boutique stays, permits, private 4x4 vehicle..."
                className="input resize-none text-xs"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Record Payment Reference Modal */}
      {paymentModalInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setPaymentModalInvoice(null)}
          title={`Record Payment Reference: ${paymentModalInvoice.invoiceId}`}
          description={`Customer: ${paymentModalInvoice.customerName} • Balance Due: ₹${paymentModalInvoice.balanceDue?.toLocaleString()}`}
          footer={
            <>
              <button type="button" onClick={() => setPaymentModalInvoice(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" form="record-payment-form" disabled={paymentLoading} className="btn-primary text-xs">
                {paymentLoading ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </>
          }
        >
          <form id="record-payment-form" onSubmit={handleRecordPaymentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Paid (INR) *</label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="input text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="input text-xs"
                >
                  <option value="UPI_QR_MANUAL">UPI / QR Transfer</option>
                  <option value="BANK_TRANSFER_MANUAL">NEFT / IMPS / RTGS</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">UTR / Transaction Reference *</label>
              <input
                type="text"
                required
                value={paymentForm.transactionRef}
                onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                placeholder="e.g. UPI/HDFC/631109884210"
                className="input text-xs font-mono"
              />
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
          footer={
            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          }
        >
          <div className="space-y-6 text-xs text-slate-800 p-1">
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="text-base font-bold text-slate-900 font-serif">
                  {selectedInvoiceData.company.name}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">{selectedInvoiceData.company.address}</div>
                {selectedInvoiceData.company.gstNumber && (
                  <div className="text-slate-500 text-[11px] font-mono mt-0.5">GSTIN: {selectedInvoiceData.company.gstNumber}</div>
                )}
                <div className="text-slate-500 text-[11px]">{selectedInvoiceData.company.supportEmail}</div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-lg font-black font-mono text-brand-700 block">{selectedInvoiceData.invoice.invoiceId}</span>
                <span className="text-slate-500 text-[11px] block">
                  Date: {formatDate(selectedInvoiceData.invoice.createdAt)}
                </span>
                <span className="text-rose-600 text-[11px] font-semibold block">
                  Due: {selectedInvoiceData.invoice.dueDate ? formatDate(selectedInvoiceData.invoice.dueDate) : 'On Demand'}
                </span>
                <div className="mt-1"><Badge status={selectedInvoiceData.invoice.status} /></div>
              </div>
            </div>

            {/* Customer Billed To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
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
                  <td className="py-2.5 px-3">{selectedInvoiceData.invoice.itemizedNotes || 'Tour Package Booking and Associated Stays & Logistics'}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                    ₹{selectedInvoiceData.invoice.totalAmount?.toLocaleString()}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td className="py-2 px-3 text-slate-600">Total Invoice Amount</td>
                  <td className="py-2 px-3 text-right font-mono text-sm tabular-nums">₹{selectedInvoiceData.invoice.totalAmount?.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-600">Amount Received</td>
                  <td className="py-2 px-3 text-right font-mono text-emerald-600 tabular-nums">₹{selectedInvoiceData.invoice.amountReceived?.toLocaleString()}</td>
                </tr>
                <tr className="border-t">
                  <td className="py-2 px-3 text-slate-900 font-black">Net Balance Due</td>
                  <td className="py-2 px-3 text-right font-mono text-base font-black text-rose-600 tabular-nums">₹{selectedInvoiceData.invoice.balanceDue?.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            {/* UPI QR Payment Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 bg-white border border-emerald-300 rounded-lg p-2 flex flex-col items-center justify-center text-center shadow-sm shrink-0">
                <QrCode className="w-20 h-20 text-slate-800" />
                <span className="text-[8px] font-mono font-bold text-slate-500">Scan via UPI</span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Instant UPI Payment Details
                </span>
                <p className="text-emerald-800 text-[11px]">
                  Supports Google Pay, PhonePe, Paytm, and all Indian banking apps.
                </p>
                <div className="font-mono text-slate-800 bg-white px-2 py-1 rounded border border-emerald-200 inline-block font-bold">
                  UPI VPA: {selectedInvoiceData.upi.upiId}
                </div>
                <div className="text-[10px] text-slate-500">
                  After transfer, note down the 12-digit UTR/reference number to submit for verification.
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
