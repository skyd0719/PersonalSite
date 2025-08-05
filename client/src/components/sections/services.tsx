import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Settings, Lightbulb, Check, ArrowRight } from "lucide-react";

export default function Services() {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const services = [
    {
      icon: TrendingUp,
      title: "Stratégiai tanácsadás",
      description: "Segítek ügyfeleim számára a legoptimálisabb stratégiai döntések meghozatalában és a célok elérésében.",
      features: [
        "Üzleti stratégia fejlesztés",
        "Folyamatoptimalizálás",
        "Teljesítmény elemzés"
      ]
    },
    {
      icon: Settings,
      title: "Projektmenedzsment",
      description: "Professzionális projektvezetéssel biztosítom a határidők betartását és a kiváló eredményeket.",
      features: [
        "Projekt tervezés és végrehajtás",
        "Csapatkoordináció",
        "Kockázatkezelés"
      ]
    },
    {
      icon: Lightbulb,
      title: "Innovációs tanácsadás",
      description: "Támogatom ügyfeleim innovációs törekvéseit és a digitális transzformációs folyamatokat.",
      features: [
        "Technológiai megoldások",
        "Digitalizációs stratégia",
        "Változásmenedzsment"
      ]
    }
  ];

  return (
    <section id="services" className="section-padding bg-muted/30">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Tanácsadó szolgáltatások</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Átfogó szolgáltatásaim segítségével támogatom ügyfeleim célkitűzéseinek megvalósítását.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-background shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="bg-background shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Kérdése van a szolgáltatásokkal kapcsolatban?
              </h3>
              <p className="text-muted-foreground mb-6">
                Szívesen beszélünk projektjéről és arról, hogyan segíthetek Önnek.
              </p>
              <Button 
                onClick={scrollToContact}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Kapcsolatfelvétel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
