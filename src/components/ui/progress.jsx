import React from "react";

export function Progress({ value }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-4">
      <div
        className="bg-green-500 h-full rounded-full transition-all"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
