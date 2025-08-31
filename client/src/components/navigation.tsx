import logoImage from "@assets/Felicity Hills Logo_1754587869215.png";

export default function Navigation() {

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <a 
              href="/" 
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src={logoImage} 
                alt="Felicity Hills Logo" 
                className="h-20 w-auto"
              />
            </a>
          </div>
          
        </div>

      </div>
    </nav>
  );
}
