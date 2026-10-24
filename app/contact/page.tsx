"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Mail, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Discovery
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              Contact &amp; Integration Support
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Get in touch regarding ERC-8004 agent indexing, validator onboarding, or partnership inquiries.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4 text-primary" />
              Send a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="rounded-lg border border-accent-green/30 bg-accent-green/10 p-6 text-center space-y-3">
                <CheckCircle2 className="mx-auto h-8 w-8 text-accent-green" />
                <h3 className="font-semibold text-foreground">Message Received (Demo)</h3>
                <p className="text-sm text-muted-foreground">
                  Thank you for reaching out! Your inquiry has been logged in the demo environment.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                  >
                    Send Another
                  </Button>
                  <Link href="/">
                    <Button size="sm">Return to Discovery</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name / Team</Label>
                  <Input
                    id="contact-name"
                    placeholder="Your name or project"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email or Telegram</Label>
                  <Input
                    id="contact-email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-msg">Message *</Label>
                  <Textarea
                    id="contact-msg"
                    rows={4}
                    placeholder="How can we help with your ERC-8004 agent?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="gap-1.5">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
