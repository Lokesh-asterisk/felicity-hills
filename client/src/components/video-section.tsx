import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Clock, Loader2, X } from "lucide-react";
import type { Video } from "@shared/schema";

export default function VideoSection() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "project": return "bg-blue-100 text-blue-800";
      case "location": return "bg-green-100 text-green-800";
      case "testimonial": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "project": return "🏗️";
      case "location": return "📍";
      case "testimonial": return "💬";
      default: return "🎥";
    }
  };

  const playVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="videos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Project Videos
          </h2>
          <p className="text-xl text-gray-600">
            Watch detailed videos about our project and location
          </p>
          <Button 
            onClick={() => window.location.href = '/videos'}
            variant="outline" 
            className="mt-4 border-primary text-primary hover:bg-primary hover:text-white"
          >
            View All Videos
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {videos?.map((video, index) => (
            <Card 
              key={video.id}
              className="shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up overflow-hidden group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => playVideo(video)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                </div>
                
                {/* Duration Badge */}
                <Badge className="absolute top-4 right-4 bg-black/70 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {video.duration}
                </Badge>
                
                {/* Category Badge */}
                <Badge className={`absolute top-4 left-4 ${getCategoryColor(video.category)}`}>
                  {getCategoryIcon(video.category)} {video.category}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {video.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {video.description}
                </p>
                
                <Button 
                  className="w-full mt-4 bg-primary hover:bg-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    playVideo(video);
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Video
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl w-full p-0">
            <DialogHeader className="p-6 pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {selectedVideo?.title}
                  </DialogTitle>
                  <p className="text-gray-600 mt-2">
                    {selectedVideo?.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeVideo}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            
            {selectedVideo && (
              <div className="px-6 pb-6">
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  {/* Alternative: Direct link approach since Google Drive iframe embedding has restrictions */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <Play className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {selectedVideo.title}
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {selectedVideo.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild className="bg-primary text-white hover:bg-secondary" size="lg">
                          <a 
                            href={selectedVideo.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Watch on Google Drive
                          </a>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => navigator.clipboard?.writeText(selectedVideo.videoUrl)}
                        >
                          Copy Link
                        </Button>
                      </div>
                      <div className="flex items-center justify-center mt-4 space-x-4">
                        <Badge className="bg-green-100 text-green-800">
                          <Clock className="w-3 h-3 mr-1" />
                          {selectedVideo.duration}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          HD Quality
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-primary to-secondary animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Impressed by What You See?
            </h3>
            <p className="text-green-100 mb-6">
              Book a site visit to experience the location and amenities in person
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-white text-primary hover:bg-gray-100" 
                size="lg"
              >
                Book Site Visit
              </Button>
              <Button asChild className="bg-green-500 text-white hover:bg-green-600" size="lg">
                <a 
                  href="https://wa.me/918588834221?text=Hello%2C%20I%20watched%20your%20videos%20and%20want%20to%20book%20a%20site%20visit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}