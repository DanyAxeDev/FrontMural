import React from 'react';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export default function Modal({ isOpen, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300 animate-in"
    >
      {children}
    </div>
  );
}