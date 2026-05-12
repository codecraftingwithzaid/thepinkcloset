import React from 'react';

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="font-heading text-4xl font-bold mb-8">Return & Refund Policy</h1>
      <div className="prose prose-stone max-w-none text-muted-foreground">
        
        <p className="text-lg leading-relaxed mb-8">
          We want you to love everything you purchase from Luxe. If you are not entirely satisfied with your purchase, we're here to help.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Returns</h2>
        <p className="mb-4">
          You have <strong>30 calendar days</strong> to return an item from the date you received it.
        </p>
        <p className="mb-4">
          To be eligible for a return, your item must be:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Unused and in the same condition that you received it.</li>
          <li>Unwashed and unaltered.</li>
          <li>Have all original tags attached.</li>
          <li>Accompanied by the receipt or proof of purchase.</li>
        </ul>
        <p className="mb-8 text-sm italic">
          * Note: Final sale items, intimates, and customized garments are not eligible for return.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Refunds</h2>
        <p className="mb-4">
          Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
        </p>
        <p className="mb-4">
          If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Shipping Costs</h2>
        <p className="mb-4">
          You will be responsible for paying for your own shipping costs for returning your item unless the item received was damaged or incorrect. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">How to Initiate a Return</h2>
        <p className="mb-4">
          To start a return, please log into your account, go to your Orders history, and select "Request Return" next to the applicable order. Alternatively, you can contact our support team at returns@luxeboutique.com.
        </p>
      </div>
    </div>
  );
}
