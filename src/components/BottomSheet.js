import React from 'react';
import './BottomSheet.css';

export default function BottomSheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <button className="bottom-sheet-close" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}
