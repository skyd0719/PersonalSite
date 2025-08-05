import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, CheckCircle, Phone, Mail } from "lucide-react";
import type { InsertAppointment, Service } from "@shared/schema";

export default function Booking() {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string>("");
  const [formData, setFormData] = useState<Partial<InsertAppointment>>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
  });

  // Fetch available services
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const response = await apiRequest("POST", "/api/appointments", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Foglalás sikeres!",
        description: "Köszönöm a foglalását! E-mailben megerősítést fog kapni, és hamarosan felveszem Önnel a kapcsolatot.",
      });
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        notes: "",
      });
      setSelectedService("");
    },
    onError: (error: any) => {
      console.error("Booking error:", error);
      
      let title = "Hiba történt";
      let description = "Nem sikerült elküldeni a foglalást.";
      
      if (error.message?.includes("409")) {
        title = "Időpont már foglalt";
        description = "Ez az időpont már foglalt. Kérem válasszon másik időpontot.";
      } else if (error.message?.includes("400")) {
        title = "Hibás adatok";
        description = "Kérem ellenőrizze az űrlap adatait.";
      } else if (error.message) {
        description = error.message;
      }
      
      toast({
        title,
        description,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.appointmentDate) {
      toast({
        title: "Hiányzó adatok",
        description: "Kérem válasszon időpontot!",
        variant: "destructive",
      });
      return;
    }

    // Fixed to free consultation service
    const freeConsultationService = services.find((s: Service) => s.name === "Ingyenes konzultáció");
    
    bookingMutation.mutate({
      ...formData,
      serviceId: freeConsultationService?.id || "",
      duration: 30,
    } as InsertAppointment);
  };

  const handleInputChange = (field: keyof InsertAppointment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Fetch booked slots to exclude them
  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["/api/available-slots"],
    queryFn: async () => {
      // Get booked slots for the next 14 days
      const slots = [];
      for (let i = 1; i <= 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
        
        const dateStr = date.toISOString().split('T')[0];
        const response = await fetch(`/api/available-slots?date=${dateStr}`);
        if (response.ok) {
          const data = await response.json();
          slots.push(...data.bookedSlots);
        }
      }
      return slots;
    }
  });

  // Generate time slots for the next 14 days
  const generateTimeSlots = () => {
    const slots = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Add time slots (9 AM - 5 PM)
      for (let hour = 9; hour < 17; hour++) {
        const timeSlot = new Date(date);
        timeSlot.setHours(hour, 0, 0, 0);
        
        // Skip if slot is already booked
        if (bookedSlots.includes(timeSlot.toISOString())) continue;
        
        const dateStr = timeSlot.toISOString().split('T')[0];
        const timeStr = timeSlot.toLocaleTimeString('hu-HU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        slots.push({
          value: timeSlot.toISOString(),
          label: `${dateStr} ${timeStr}`,
          date: dateStr,
          time: timeStr
        });
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <section id="booking" className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Foglaljon ingyenes online konzultációt
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Beszéljük meg projektjét egy online konzultáció keretében. Az első konzultáció ingyenes és 30 percet tart!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Booking Form */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Időpontfoglalás
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Selection - Fixed to Free Consultation */}
                <div className="space-y-2">
                  <Label htmlFor="service">Szolgáltatás típusa</Label>
                  <div className="p-3 bg-muted rounded-md border">
                    <p className="font-medium text-foreground">
                      Ingyenes online konzultáció (30 perc)
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ismerkedő beszélgetés projektjéről és együttműködési lehetőségekről
                    </p>
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div className="space-y-2">
                  <Label htmlFor="datetime">Időpont</Label>
                  <Select 
                    value={formData.appointmentDate ? new Date(formData.appointmentDate).toISOString() : ""} 
                    onValueChange={(value) => handleInputChange("appointmentDate", value)}
                  >
                    <SelectTrigger data-testid="select-datetime">
                      <SelectValue placeholder="Válasszon időpontot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Client Information */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Név *</Label>
                    <Input
                      id="clientName"
                      data-testid="input-client-name"
                      value={formData.clientName || ""}
                      onChange={(e) => handleInputChange("clientName", e.target.value)}
                      placeholder="Az Ön neve"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Telefon</Label>
                    <Input
                      id="clientPhone"
                      data-testid="input-client-phone"
                      value={formData.clientPhone || ""}
                      onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                      placeholder="+36 XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email cím *</Label>
                  <Input
                    id="clientEmail"
                    data-testid="input-client-email"
                    type="email"
                    value={formData.clientEmail || ""}
                    onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Megjegyzés</Label>
                  <Textarea
                    id="notes"
                    data-testid="textarea-notes"
                    value={formData.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Írja le röviden, hogy mit szeretne megbeszélni..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  data-testid="button-submit-booking"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    "Foglalás küldése..."
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Időpontfoglalás
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Information Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Hogyan működik?
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Válasszon időpontot</h4>
                      <p className="text-sm text-muted-foreground">
                        Válassza ki a számára megfelelő szolgáltatást és időpontot.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Megerősítés</h4>
                      <p className="text-sm text-muted-foreground">
                        E-mailben visszaigazolást kap az időpontról.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Online konzultáció</h4>
                      <p className="text-sm text-muted-foreground">
                        Online videohívás formájában tartjuk meg a beszélgetést.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Elérhetőségek</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm">kun.botond@icloud.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm">+36 70 466 6325</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Hétfő-Péntek: 9:00-17:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}