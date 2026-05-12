import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-heading text-4xl font-bold mb-2 text-center">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-12">We'd love to hear from you. Please reach out with any questions.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-heading font-bold mb-6">Get in Touch</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jane@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Order Inquiry" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea 
                  id="message" 
                  className="w-full min-h-[150px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="How can we help you?"
                />
              </div>
              <Button type="submit" className="w-full rounded-full h-12">Send Message</Button>
            </form>
          </div>

          <div className="bg-muted/30 p-8 rounded-2xl h-fit">
            <h2 className="text-2xl font-heading font-bold mb-8">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Boutique Address</h3>
                  <p className="text-muted-foreground mt-1">123 Fashion Avenue<br/>New York, NY 10001<br/>United States</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground mt-1">+1 (555) 123-4567<br/>Mon-Fri 9am - 6pm EST</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground mt-1">support@luxeboutique.com<br/>We reply within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
