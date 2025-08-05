import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="pt-16 business-gradient">
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Professzionális <span className="text-primary">tanácsadó megoldások</span> az Ön számára
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Több mint 10 éves tapasztalattal segítem ügyfeleimet céljaik elérésében. 
                Szakértelmem és elkötelezettségem garantálja a kiváló eredményeket.
                <br /><strong>Első konzultáció 30 percben, teljesen ingyenes!</strong>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection("#booking")}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                Ingyenes online konzultáció
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => scrollToSection("#services")}
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Szolgáltatások
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/assets/profile-photo.jpg" 
              alt="Kun Botond - Professzionális tanácsadó" 
              className="rounded-2xl shadow-2xl w-full h-auto max-w-md mx-auto"
              onError={(e) => {
                // Ha nem sikerül betölteni a saját képet, használjunk egy alapértelmezett professzionális képet
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
