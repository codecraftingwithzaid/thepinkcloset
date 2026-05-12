'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-2xl">
          <h2 className="text-2xl font-medium mb-4">Your cart is elegantly empty.</h2>
          <p className="text-muted-foreground mb-8">Discover our latest arrivals to find something beautiful.</p>
          <Link href="/shop">
            <Button size="lg" className="rounded-full px-8">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-6 py-6 border-b border-border last:border-0">
                <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  <img src={item.image || 'https://via.placeholder.com/150'} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                      </p>
                    </div>
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-border rounded-full px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size, item.color)}
                        className="p-1 hover:text-primary transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                        className="p-1 hover:text-primary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      className="text-muted-foreground hover:text-destructive flex items-center gap-2 text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Card className="bg-muted/10 border-border">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-xl mb-6">Order Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
                    <span className="font-bold text-base">Estimated Total</span>
                    <span className="font-bold text-xl">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <Button className="w-full mt-8 rounded-full h-12 text-base shadow-md">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
