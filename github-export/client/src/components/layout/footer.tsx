export default function Footer() {
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
    <footer className="bg-slate-900 text-white section-padding">
      <div className="container-max">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Kun Botond</h3>
            <p className="text-slate-300 leading-relaxed">
              Professzionális tanácsadói szolgáltatások magas szakmai színvonalon. 
              Segítem ügyfeleim célkitűzéseinek megvalósítását.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Gyors linkek</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection("#about")}
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Bemutatkozás
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("#services")}
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Szolgáltatások
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("#contact")}
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Kapcsolat
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Kapcsolat</h4>
            <ul className="space-y-2 text-slate-300">
              <li>kun.botond@icloud.com</li>
              <li>+36 70 466 6325</li>
              <li>Budapest és Vácrátót, Magyarország</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © 2024 Kun Botond. Minden jog fenntartva.
          </p>
        </div>
      </div>
    </footer>
  );
}
