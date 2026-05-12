import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="font-heading text-4xl font-bold mb-8">Terms & Conditions</h1>
      <div className="prose prose-stone max-w-none text-muted-foreground">
        <p className="mb-6">Last updated: May 2026</p>
        
        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Agreement to Terms</h2>
        <p className="mb-4">
          By accessing and using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use our website.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Product Information and Pricing</h2>
        <p className="mb-4">
          We strive to provide accurate product descriptions and pricing. However, errors may occur. If we discover an error in the price or description of an item you ordered, we will notify you and offer the option to reconfirm your order or cancel it. We reserve the right to modify prices without prior notice.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Orders and Payment</h2>
        <p className="mb-4">
          By placing an order, you warrant that all details you provide are accurate, that you are an authorized user of the credit or debit card used to place the order, and that there are sufficient funds to cover the cost of the goods. All orders are subject to availability and confirmation of the order price.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Intellectual Property</h2>
        <p className="mb-4">
          All content included on this site, such as text, graphics, logos, images, and software, is the property of Luxe Boutique and protected by international copyright laws. You may not reproduce, duplicate, copy, sell, or exploit any portion of the service without express written permission from us.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Limitation of Liability</h2>
        <p className="mb-4">
          Luxe Boutique shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service or products.
        </p>
      </div>
    </div>
  );
}
