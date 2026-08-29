import React, { useState } from 'react';
import { ExpenseItem } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: ExpenseItem) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
}) => {
  const [title, setTitle] = useState('');
  const [amountINR, setAmountINR] = useState('1850');
  const [category, setCategory] = useState<'Food' | 'Transport' | 'Activities' | 'Hotels' | 'Flights' | 'Train/IRCTC' | 'Other'>('Food');
  const [paymentMethod, setPaymentMethod] = useState<'UPI (GPay/PhonePe)' | 'Credit Card' | 'Cash' | 'Net Banking'>('UPI (GPay/PhonePe)');
  const [paidBy, setPaidBy] = useState<string>('You');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amountINR) return;

    const inrVal = parseFloat(amountINR) || 0;

    let icon = 'payments';
    let iconBg = 'bg-blue-100';
    let iconColor = 'text-blue-600';

    if (category === 'Food') {
      icon = 'utensils';
      iconBg = 'bg-amber-100';
      iconColor = 'text-amber-600';
    } else if (category === 'Transport') {
      icon = 'moped';
      iconBg = 'bg-purple-100';
      iconColor = 'text-purple-600';
    } else if (category === 'Train/IRCTC') {
      icon = 'train';
      iconBg = 'bg-blue-100';
      iconColor = 'text-blue-600';
    } else if (category === 'Activities') {
      icon = 'surfing';
      iconBg = 'bg-emerald-100';
      iconColor = 'text-emerald-600';
    } else if (category === 'Hotels') {
      icon = 'hotel';
      iconBg = 'bg-orange-100';
      iconColor = 'text-orange-600';
    } else if (category === 'Flights') {
      icon = 'flight';
      iconBg = 'bg-cyan-100';
      iconColor = 'text-cyan-600';
    }

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      time: `Today • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      category,
      amountINR: inrVal,
      paymentMethod,
      paidBy,
      splitWith: ['You', 'Rahul', 'Ankit'],
      icon,
      iconBg,
      iconColor,
    };

    onAddExpense(newExpense);
    setTitle('');
    setAmountINR('1850');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center border-b border-black/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058bc] text-2xl">account_balance_wallet</span>
            <h3 className="text-xl font-bold text-[#1a1b1f]">Log Expense / UPI</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#717786] hover:text-[#1a1b1f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#414755] block mb-1">Expense Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Curlies Shack Dinner or Scooty Fuel"
              className="w-full h-12 rounded-xl border border-[#c1c6d7] px-4 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#414755] block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-12 rounded-xl border border-[#c1c6d7] px-3 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none cursor-pointer bg-white"
              >
                <option value="Food">Food & Shacks</option>
                <option value="Train/IRCTC">Train / Vande Bharat</option>
                <option value="Transport">Scooty / Cab / Auto</option>
                <option value="Activities">Water Sports & Tours</option>
                <option value="Hotels">Hotels & Stays</option>
                <option value="Flights">Flights</option>
                <option value="Other">Other & Emergency</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#414755] block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full h-12 rounded-xl border border-[#c1c6d7] px-3 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none cursor-pointer bg-white"
              >
                <option value="UPI (GPay/PhonePe)">UPI (GPay/PhonePe)</option>
                <option value="Cash">Cash / ATM</option>
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#414755] block mb-1">Amount (INR ₹)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={amountINR}
                  onChange={(e) => setAmountINR(e.target.value)}
                  placeholder="1850"
                  className="w-full h-12 rounded-xl border border-[#c1c6d7] pl-8 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#717786] font-bold">
                  ₹
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#414755] block mb-1">Paid By</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full h-12 rounded-xl border border-[#c1c6d7] px-3 text-sm font-medium focus:ring-2 focus:ring-[#0058bc] outline-none cursor-pointer bg-white"
              >
                <option value="You">You</option>
                <option value="Rahul">Rahul</option>
                <option value="Ankit">Ankit</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-full border border-black/10 text-[#414755] font-bold text-sm hover:bg-[#eeedf3] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-full bg-[#0058bc] text-white font-bold text-sm hover:bg-[#004493] cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-lg">check</span>
              <span>Save Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

