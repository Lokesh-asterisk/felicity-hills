import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2 } from "lucide-react";
import type { Testimonial } from "@shared/schema";

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  const formatCurrency = (amount: number) => {
    return '₹' + (amount / 100000).toFixed(1) + ' लाख';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-primary text-white',
      'bg-pink-500 text-white',
      'bg-blue-500 text-white',
      'bg-purple-500 text-white',
      'bg-green-500 text-white',
      'bg-orange-500 text-white'
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Happy Customer Stories
          </h2>
          <p className="text-xl text-gray-600">
            Real experiences and success stories from our investors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${getAvatarColor(index)} rounded-full flex items-center justify-center font-bold text-xl`}>
                    {getInitials(testimonial.name)}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic relative">
                  <span className="text-4xl text-primary opacity-20 absolute -top-2 -left-2">"</span>
                  {testimonial.review}
                  <span className="text-4xl text-primary opacity-20 absolute -bottom-4 -right-2">"</span>
                </blockquote>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Investment</div>
                    <div className="font-semibold text-primary">{formatCurrency(testimonial.investment)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Returns</div>
                    <div className="font-semibold text-green-600">{testimonial.returns}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Plot Size</div>
                    <div className="font-semibold">{testimonial.plotSize} गज</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Duration</div>
                    <div className="font-semibold">{testimonial.duration}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Badge variant="secondary" className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 text-lg font-semibold">
            <Heart className="w-5 h-5 mr-2" />
            98% Customer Satisfaction Rate • 500+ happy investors and counting...
          </Badge>
        </div>
      </div>
    </section>
  );
}
