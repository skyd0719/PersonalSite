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
                Professzionális <span className="text-primary">megoldások</span> az Ön számára
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Több mint 10 éves tapasztalattal segítem ügyfeleimet céljaik elérésében. 
                Szakértelmem és elkötelezettségem garantálja a kiváló eredményeket.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection("#services")}
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                Szolgáltatások
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                onClick={() => scrollToSection("#contact")}
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Kapcsolatfelvétel
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000" 
              alt="Professional business consultant" 
              className="rounded-2xl shadow-2xl w-full h-auto max-w-md mx-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
