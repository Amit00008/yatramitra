import { Mail, User, Phone, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import AnimateOnScroll from "./AnimateOnScroll";

const ContactSection = () => {
  const [charCount, setCharCount] = useState(0);
  const [subscribed, setSubscribed] = useState(true);

  const inputClasses =
    "w-full rounded-lg border border-nav-foreground/20 bg-nav-foreground/10 px-3 py-2.5 text-sm text-nav-foreground placeholder:text-nav-foreground/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 hover:border-nav-foreground/30";

  return (
    <section className="bg-nav">
      <div className="container mx-auto px-6 pb-12">
        <AnimateOnScroll className="max-w-4xl mx-auto rounded-2xl border border-secondary/30 bg-nav-foreground/5 p-8">
          <h2 className="text-xl md:text-2xl font-bold text-nav-foreground mb-6 flex items-center gap-2">
            <Mail className="h-6 w-6 text-secondary" />
            Stay Updated & Contact Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-nav-foreground flex items-center gap-1 mb-1.5">
                <User className="h-3.5 w-3.5" /> Full Name
              </label>
              <input type="text" placeholder="Your Name" maxLength={100} className={inputClasses} />
            </div>
            <div>
              <label className="text-sm font-medium text-nav-foreground flex items-center gap-1 mb-1.5">
                <Mail className="h-3.5 w-3.5" /> Email Address
              </label>
              <input type="email" placeholder="your@email.com" maxLength={255} className={inputClasses} />
            </div>
            <div>
              <label className="text-sm font-medium text-nav-foreground flex items-center gap-1 mb-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone Number
              </label>
              <input type="tel" placeholder="+91 9876543210" maxLength={20} className={inputClasses} />
            </div>
            <div>
              <label className="text-sm font-medium text-nav-foreground flex items-center gap-1 mb-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Subject
              </label>
              <select className={inputClasses}>
                <option>General Inquiry</option>
                <option>Hotel Booking</option>
                <option>Ride Sharing</option>
                <option>Car Rentals</option>
                <option>Rewards</option>
                <option>Support</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-nav-foreground flex items-center gap-1 mb-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Message
            </label>
            <textarea
              placeholder="Your message here..."
              maxLength={500}
              rows={4}
              onChange={(e) => setCharCount(e.target.value.length)}
              className={`${inputClasses} resize-y`}
            />
            <p className="text-right text-xs text-nav-foreground/50 mt-1">{charCount}/500 characters</p>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-nav-foreground cursor-pointer group">
              <input
                type="checkbox"
                checked={subscribed}
                onChange={(e) => setSubscribed(e.target.checked)}
                className="rounded border-nav-foreground/30 accent-secondary"
              />
              <span className="transition-colors group-hover:text-secondary">Subscribe to newsletter & updates</span>
            </label>
            <button className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors duration-200 hover:bg-secondary/90 active:scale-95">
              Send Message
            </button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ContactSection;
