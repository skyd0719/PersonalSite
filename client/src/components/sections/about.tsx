import { Card, CardContent } from "@/components/ui/card";
import { Tag, Users, Award } from "lucide-react";

export default function About() {
  const stats = [
    { value: "10+", label: "Év tapasztalat" },
    { value: "200+", label: "Sikeres projekt" },
  ];

  const qualifications = [
    {
      icon: Tag,
      title: "Digitalizációs Elkötelezettség",
      description: "Elkötelezett vagyok a digitalizáció és modernizáció mellett, segítve az ügyfeleket a technológiai fejlődés előnyeinek kihasználásában."
    },
    {
      icon: Users,
      title: "Ügyfél-központú Megközelítés",
      description: "Minden projektet az ügyfél egyedi igényeihez és céljaihoz igazítok."
    },
    {
      icon: Award,
      title: "Kiváló Minőség",
      description: "Elkötelezett vagyok a legmagasabb minőségi standardok betartása mellett."
    }
  ];

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Bemutatkozás</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tapasztalt szakemberként büszke vagyok arra, hogy ügyfeleim sikereinek építője lehetek.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Több mint egy évtizedes tapasztalattal rendelkezem a szakmámban, és büszke vagyok arra, 
                hogy számos sikeres projektet valósítottam meg ügyfeleimmel együtt. Elkötelezett vagyok 
                amellett, hogy a legmagasabb színvonalú szolgáltatást nyújtsam.
              </p>
              <p>
                Szakmai pályafutásom során folyamatosan fejlesztem tudásomat és készségeimet, hogy mindig 
                a legkorszerűbb megoldásokat kínálhassam. Az ügyfelek elégedettsége és sikere a 
                legfontosabb számomra.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 bg-muted/50">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {qualifications.map((qualification, index) => (
              <Card key={index} className="p-6 bg-muted/30 border-border/50">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <qualification.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{qualification.title}</h3>
                      <p className="text-muted-foreground">{qualification.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
