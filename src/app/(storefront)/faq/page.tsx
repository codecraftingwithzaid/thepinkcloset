import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have original tags attached. Please note that sale items are final sale."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes! We offer worldwide shipping. Free international shipping is available for orders over $250. Standard rates apply for orders below that amount."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order by logging into your account and viewing your order history."
    },
    {
      question: "How long does shipping take?",
      answer: "Domestic orders typically arrive within 3-5 business days. International orders can take between 7-14 business days depending on customs processing in your country."
    },
    {
      question: "Do you offer sizing advice?",
      answer: "Yes, every product page includes a detailed size guide. If you need further assistance, please contact our support team with your measurements, and we'd be happy to help you find the perfect fit."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="font-heading text-4xl font-bold mb-2 text-center">Frequently Asked Questions</h1>
      <p className="text-center text-muted-foreground mb-12">Find answers to our most common questions below.</p>

      <Accordion className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-medium text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
