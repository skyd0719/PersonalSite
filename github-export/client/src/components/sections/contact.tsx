import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Send, Linkedin } from "lucide-react";
import type { InsertContactMessage } from "@shared/schema";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertContactMessage>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Üzenet elküldve!",
        description: "Köszönöm az üzenetét! Megkaptam és a lehető leghamarabb válaszolni fogok. Várhatóan 24 órán belül felveszem Önnel a kapcsolatot.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Hiba történt",
        description: error.message || "Nem sikerült elküldeni az üzenetet.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof InsertContactMessage, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "kun.botond@icloud.com",
      href: "mailto:kun.botond@icloud.com"
    },
    {
      icon: Phone,
      title: "Telefon",
      value: "+36 70 466 6325",
      href: "tel:+36704666325"
    },
    {
      icon: MapPin,
      title: "Helyszín",
      value: "Budapest és Vácrátót, Magyarország",
      href: null
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/botond-kun", label: "LinkedIn" },
  ];

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Kapcsolatfelvétel</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vegye fel velem a kapcsolatot! Szívesen beszélek projektjéről és arról, hogyan segíthetek.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <info.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                  {info.href ? (
                    <a 
                      href={info.href} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-6">
              <h3 className="font-semibold text-foreground mb-4">Kövessen a közösségi médiában</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground rounded-lg flex items-center justify-center transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-muted/30">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Név *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Az Ön neve"
                        required
                        className="focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@example.com"
                        required
                        className="focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Tárgy *</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Üzenet tárgya"
                      required
                      className="focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Üzenet *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Írja le részletesen, miben segíthetek..."
                      rows={6}
                      required
                      className="focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                    />
                  </div>

                  <div>
                    <Button 
                      type="submit" 
                      disabled={contactMutation.isPending}
                      className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {contactMutation.isPending ? "Küldés..." : "Üzenet küldése"}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    * Kötelező mezők. Az Ön adatait bizalmasan kezelem és harmadik félnek nem adom át.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
