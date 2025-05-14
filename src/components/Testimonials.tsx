
const testimonials = [
  {
    quote: "DirectivePlus nous a permis de simplifier considérablement notre conformité réglementaire. C'est un gain de temps précieux pour notre équipe.",
    author: "Marie Dupont",
    role: "Directrice Qualité, Clinique Saint-Joseph",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    quote: "L'interface intuitive et la simplicité d'utilisation nous ont convaincus dès le premier jour. Le support client est également exceptionnel.",
    author: "Thomas Martin",
    role: "Responsable Conformité, Centre Hospitalier Régional",
    avatar: "https://randomuser.me/api/portraits/men/47.jpg"
  },
  {
    quote: "Nous avons réduit de 40% le temps consacré à la gestion documentaire grâce à DirectivePlus. Un outil qui est devenu indispensable.",
    author: "Sophie Lefebvre",
    role: "Directrice des Opérations, EHPAD Les Oliviers",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding bg-directiveplus-50">
      <div className="container mx-auto container-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ce que nos clients disent
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez comment DirectivePlus aide de nombreuses organisations à améliorer leur gestion réglementaire.
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <svg className="h-8 w-8 text-directiveplus-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium text-gray-800">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonial Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-4xl font-bold text-directiveplus-600 mb-2">98%</p>
            <p className="text-gray-600">Taux de satisfaction client</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-4xl font-bold text-directiveplus-600 mb-2">500+</p>
            <p className="text-gray-600">Organisations qui nous font confiance</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-4xl font-bold text-directiveplus-600 mb-2">35%</p>
            <p className="text-gray-600">Temps gagné en gestion documentaire</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
