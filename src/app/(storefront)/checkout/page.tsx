'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const total = getTotalPrice();
  const tax = total * 0.08; // 8% tax mock
  const shipping = total > 150 ? 0 : 15.00;
  const finalTotal = total + tax + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mocking Razorpay/Payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="font-heading text-4xl font-bold mb-4">Thank You For Your Order!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your payment was successful and your beautiful items are being prepared. We've sent a confirmation email with your order details.
        </p>
        <div className="p-6 bg-muted/20 rounded-lg mb-8 text-left">
          <p className="font-medium">Order Number: #LX-{Math.floor(Math.random() * 900000) + 100000}</p>
          <p className="text-sm text-muted-foreground mt-2">You can track your order status in your dashboard.</p>
        </div>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty.</h1>
        <Link href="/shop"><Button>Go to Shop</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          {/* Shipping Details */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Mock */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="radio" name="payment" value="card" defaultChecked className="w-4 h-4 text-primary" />
                  <span className="font-medium">Credit/Debit Card (Razorpay Mock)</span>
                </label>
                <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="radio" name="payment" value="cod" className="w-4 h-4 text-primary" />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24 bg-muted/10">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-md" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 text-sm pt-4 border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-4 border-t border-border">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Button type="submit" disabled={isProcessing} className="w-full mt-8 rounded-full h-12 text-base">
                {isProcessing ? 'Processing Payment...' : `Pay $${finalTotal.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
