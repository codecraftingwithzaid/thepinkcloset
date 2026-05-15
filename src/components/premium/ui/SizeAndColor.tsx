'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ColorOption {
  id: string;
  name: string;
  hex: string;
  available?: boolean;
}

interface ColorSwatchProps {
  colors: ColorOption[];
  selected?: string;
  onSelect?: (colorId: string) => void;
  onChange?: (colorId: string) => void;
}

export function ColorSwatch({ colors, selected, onSelect, onChange }: ColorSwatchProps) {
  const handleSelect = (colorId: string) => {
    onSelect?.(colorId);
    onChange?.(colorId);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-neutral-900">Color</h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <motion.button
            key={color.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(color.id)}
            disabled={color.available === false}
            className={`relative rounded-full transition-all ${
              selected === color.id ? 'ring-2 ring-pink-400 ring-offset-2' : ''
            } ${color.available === false ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={color.name}
          >
            <div
              className="w-10 h-10 rounded-full border-2 border-neutral-200"
              style={{ backgroundColor: color.hex }}
            />
            {selected === color.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check size={16} className="text-white drop-shadow-lg" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
      {selected && (
        <p className="text-sm text-neutral-600">
          Selected: <span className="font-medium">{colors.find((c) => c.id === selected)?.name}</span>
        </p>
      )}
    </div>
  );
}

interface SizeOption {
  id: string;
  label: string;
  inStock: number;
}

interface SizeSelectorProps {
  sizes: SizeOption[];
  selected?: string;
  onSelect?: (sizeId: string) => void;
  onChange?: (sizeId: string) => void;
}

export function SizeSelector({ sizes, selected, onSelect, onChange }: SizeSelectorProps) {
  const handleSelect = (sizeId: string) => {
    onSelect?.(sizeId);
    onChange?.(sizeId);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-neutral-900">Size</h4>
        <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => (
          <motion.button
            key={size.id}
            whileHover={{ scale: size.inStock > 0 ? 1.05 : 1 }}
            whileTap={{ scale: size.inStock > 0 ? 0.95 : 1 }}
            onClick={() => size.inStock > 0 && handleSelect(size.id)}
            disabled={size.inStock === 0}
            className={`py-3 px-2 rounded-lg font-medium text-sm transition-all ${
              selected === size.id
                ? 'bg-gradient-to-r from-pink-300 to-pink-200 text-neutral-900 ring-2 ring-pink-400'
                : size.inStock > 0
                ? 'border-2 border-neutral-300 text-neutral-900 hover:border-pink-300'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {size.label}
          </motion.button>
        ))}
      </div>
      {selected && (
        <p className="text-sm text-neutral-600">
          Stock: <span className="font-medium">{sizes.find((s) => s.id === selected)?.inStock} available</span>
        </p>
      )}
    </div>
  );
}

interface SizeChartModalProps {
  isOpen: boolean;
  onClose?: () => void;
  measurements?: {
    size: string;
    bust?: string;
    waist?: string;
    hip?: string;
    length?: string;
  }[];
}

export function SizeChartModal({ isOpen, onClose, measurements }: SizeChartModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl max-h-96 overflow-auto luxury-shadow"
      >
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-neutral-900">Size Chart</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {measurements && measurements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-neutral-300">
                    <th className="text-left py-3 px-3 font-semibold text-neutral-900">Size</th>
                    {measurements[0]?.bust && <th className="text-left py-3 px-3 font-semibold text-neutral-900">Bust</th>}
                    {measurements[0]?.waist && <th className="text-left py-3 px-3 font-semibold text-neutral-900">Waist</th>}
                    {measurements[0]?.hip && <th className="text-left py-3 px-3 font-semibold text-neutral-900">Hip</th>}
                    {measurements[0]?.length && <th className="text-left py-3 px-3 font-semibold text-neutral-900">Length</th>}
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-neutral-50' : ''}>
                      <td className="py-3 px-3 font-medium text-neutral-900">{row.size}</td>
                      {row.bust && <td className="py-3 px-3 text-neutral-700">{row.bust}</td>}
                      {row.waist && <td className="py-3 px-3 text-neutral-700">{row.waist}</td>}
                      {row.hip && <td className="py-3 px-3 text-neutral-700">{row.hip}</td>}
                      {row.length && <td className="py-3 px-3 text-neutral-700">{row.length}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-neutral-600 text-center py-8">Size chart not available</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
