"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyButton({ couponCode }: { couponCode: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleCopyCode}
      className="group cursor-pointer bg-white px-6 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors duration-200"
    >
      <span className="font-mono text-lg font-bold text-gray-900">
        {couponCode}
      </span>
      {copied ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <Copy className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
      )}
    </div>
  );
}
