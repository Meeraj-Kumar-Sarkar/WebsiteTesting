import React from 'react';

const STATUS_CONFIGS = {
  // Account Statuses
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Active' },
  PENDING_MASTER_APPROVAL: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending Approval' },
  PENDING_VERIFICATION: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Pending OTP' },
  FROZEN: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'Frozen' },
  SUSPENDED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Suspended' },
  BLOCKED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Blocked' },
  DEACTIVATED: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: 'Deactivated' },

  // Enquiry Statuses
  NEW: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'New' },
  CONTACTED: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Contacted' },
  INTERESTED: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', label: 'Interested' },
  NEGOTIATION: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Negotiation' },
  CUSTOMER_ACCEPTED_QUOTE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Accepted Quote' },
  DETAILS_PENDING: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Details Pending' },
  SUBMITTED_FOR_REVIEW: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'In Review' },
  CONVERTED_TO_TRIP_REQUEST: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'Converted to Request' },
  CLOSED: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: 'Closed' },

  // Trip Request & Workflow Statuses
  DRAFT: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', label: 'Draft' },
  SUBMITTED: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Submitted' },
  FINANCE_REVIEW: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Finance Review' },
  PAYMENT_PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Payment Pending' },
  PAYMENT_UNDER_VERIFICATION: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', label: 'Payment Under Verification' },
  PAYMENT_VERIFIED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Payment Verified' },
  FINANCE_REJECTED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Finance Rejected' },
  MASTER_REVIEW: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Master Review' },
  CHANGES_REQUESTED: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Changes Requested' },
  MASTER_REJECTED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Master Rejected' },
  APPROVED_FOR_SUPPLIER_BOOKING: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', label: 'Approved for Supplier Booking' },
  SUPPLIER_BOOKING_IN_PROGRESS: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'Booking Suppliers' },
  SUPPLIER_CONFIRMED: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', label: 'Suppliers Confirmed' },
  TRIP_CONFIRMED: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', label: 'Trip Confirmed' },
  CANCEL_REQUESTED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Cancel Requested' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Cancelled' },
  COMPLETED: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', label: 'Completed' },

  // Invoice & Payment Statuses
  PAID: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Paid' },
  PARTIALLY_PAID: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Partially Paid' },
  UNPAID: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Unpaid' },
  VERIFIED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Verified' },
  REJECTED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Rejected' },

  // Blog Statuses
  PUBLISHED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Published' },
  HIDDEN: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: 'Hidden' },

  // Media Visibility
  PUBLIC_GALLERY: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Public Gallery' },
  CUSTOMER_DELIVERY: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Customer Delivery' },
  PRIVATE: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: 'Private' }
};

export default function Badge({ status, text, size = 'md' }) {
  const config = STATUS_CONFIGS[status] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    label: status || 'Unknown'
  };

  const displayText = text || config.label;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {displayText}
    </span>
  );
}
