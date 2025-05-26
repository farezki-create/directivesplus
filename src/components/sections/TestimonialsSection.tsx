
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      stars: 5,
      comment:
        "Enfin une solution simple et sécurisée pour mes directives anticipées. Je me sens rassuré de savoir que mes volontés seront respectées.",
      author: "Marie D., 65 ans",
    },
    {
      stars: 5,
      comment:
        "Interface très intuitive. J'ai pu créer mes directives en quelques minutes et les partager facilement avec ma famille.",
      author: "Jean-Pierre M., 58 ans",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Ce que disent nos utilisateurs
        </h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{testimonial.comment}</p>
              <div className="font-semibold">{testimonial.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
