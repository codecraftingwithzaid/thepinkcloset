import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="font-heading text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-stone max-w-none text-muted-foreground">
        <p className="mb-6">Last updated: May 2026</p>
        
        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          At Luxe, we respect your privacy and are committed to protecting your personal data. We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact customer support. This may include your name, email address, shipping address, payment information, and phone number.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Process and fulfill your orders, including sending emails to confirm your order status and shipment.</li>
          <li>Communicate with you about products, services, offers, promotions, and events.</li>
          <li>Maintain and secure your account.</li>
          <li>Analyze trends and usage to improve our website and customer experience.</li>
        </ul>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Information Sharing</h2>
        <p className="mb-4">
          We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, such as payment processing, shipping, and email delivery. These providers are bound by strict confidentiality agreements.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>

        <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at privacy@luxeboutique.com.
        </p>
      </div>
    </div>
  );
}
