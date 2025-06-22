
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-dark text-neutral-light py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} AI Career Interview Assistant. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Powered by Gemini API. For illustrative purposes.
        </p>
      </div>
    </footer>
  );
};
