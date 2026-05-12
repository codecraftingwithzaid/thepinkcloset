'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CartSheet() {
  const { items, getTotalItems, getTotalPrice, removeItem, updateQuantity } = useCartStore();
  const itemCount = getTotalItems();

  return (
    <Sheet>
      <SheetTrigger className="relative text-foreground/60 hover:text-foreground transition-colors p-2">
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col px-4">
        <SheetHeader className="px-2 pt-6">
          <SheetTitle className="font-heading text-2xl">Your Cart</SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-4 px-4 py-4 mt-4">
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 border-b border-border pb-4">
                    <img src={item.image} alt={item.title} className="w-20 h-24 object-cover rounded-md bg-muted" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm line-clamp-2 pr-4">{item.title}</h4>
                          <button 
                            onClick={() => removeItem(item.id, item.size, item.color)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                           {item.size && `${item.size}`} {item.color && `| ${item.color}`}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-border rounded-full px-2 py-0.5">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size, item.color)}
                            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                            className="p-1 text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t border-border pt-4 mt-auto mb-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-muted-foreground">Subtotal</span>
                <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/cart">
                  <Button variant="outline" className="w-full rounded-full">View Cart</Button>
                </Link>
                <Link href="/checkout">
                  <Button className="w-full rounded-full">Checkout</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
