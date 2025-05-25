
const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding bg-directiveplus-50">
      <div className="container mx-auto container-padding">
        {/* Testimonial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-4xl font-bold text-directiveplus-600 mb-2">98%</p>
            <p className="text-gray-600">Taux de satisfaction utilisateur</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-4xl font-bold text-directiveplus-600 mb-2">500+</p>
            <p className="text-gray-600">Utilisateurs qui nous font confiance</p>
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
