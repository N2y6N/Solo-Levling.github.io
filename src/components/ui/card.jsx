import React from "react";

export function Card({ children, className }) {
  return (
    <div className={`rounded-lg border bg-gray-800 text-white p-4 shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}
