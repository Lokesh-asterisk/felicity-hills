import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Car, 
  Mountain, 
  Plane, 
  Train, 
  Hospital, 
  MapPin,
  Bus,
  TreePine,
  Leaf,
  Wind,
  Play,
  Clock,
  X,
  Video as VideoIcon
} from "lucide-react";
import type { Video } from "@shared/schema";

export default function LocationAdvantages() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  // Fetch location videos specifically
  const { data: locationVideos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
    select: (videos) => videos?.filter(video => video.category === "location") || [],
  });

  const playVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsVideoDialogOpen(true);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    setIsVideoDialogOpen(false);
  };

  // Function to convert Google Drive share URL to embed URL
  const convertGoogleDriveUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return url;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Location Advantages
          </h2>
          <p className="text-xl text-gray-600">
            Due to land scarcity in Dehradun, Khushalipur is now the first choice of investors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Distance from Delhi</h3>
              <div className="text-2xl font-bold text-blue-600 mb-1">220 km</div>
              <div className="text-gray-600">2 hours drive</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Distance from Dehradun</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">13 km</div>
              <div className="text-gray-600">20 minutes drive</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Jolly Grant Airport</h3>
              <div className="text-2xl font-bold text-purple-600 mb-1">60 km</div>
              <div className="text-gray-600">1 hour drive</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Train className="text-white text-2xl w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Railway Station</h3>
              <div className="text-2xl font-bold text-orange-600 mb-1">15 km</div>
              <div className="text-gray-600">Dehradun Station</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Location Information */}
        <Card className="bg-gray-50 border-gray-200 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Connectivity Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">Delhi-Dehradun Expressway</div>
                      <div className="text-sm text-gray-600">Direct highway connection</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <TreePine className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">Mussoorie Hills</div>
                      <div className="text-sm text-gray-600">30 km scenic drive</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Hospital className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">Hospitals & Schools</div>
                      <div className="text-sm text-gray-600">5-10 km radius</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Local Amenities</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Hospital className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">NCR Connectivity</div>
                      <div className="text-sm text-gray-600">220 km distance</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Bus className="text-primary text-xl mr-3 w-6 h-6" />
                    <div>
                      <div className="font-semibold">Bus Stop</div>
                      <div className="text-sm text-gray-600">Just 1 km away</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-8">
                    <div className="flex items-center">
                      <Wind className="text-teal-500 w-6 h-6 mr-2" />
                      <div>
                        <div className="font-semibold text-gray-900">Natural Environment</div>
                        <div className="text-sm text-gray-600">Clean Air & Pollution-free</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Leaf className="text-green-500 w-6 h-6 mr-2" />
                      <div>
                        <div className="font-semibold text-gray-900">Green Surroundings</div>
                        <div className="text-sm text-gray-600">Agricultural landscape</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Videos Section */}
        {locationVideos && locationVideos.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12 animate-fade-in-up">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                <VideoIcon className="inline-block w-8 h-8 mr-3 text-primary" />
                Location Advantage Videos
              </h3>
              <p className="text-lg text-gray-600">
                Watch videos showcasing our prime location and connectivity benefits
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationVideos.map((video, index) => (
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
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-primary ml-1" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration}
                    </Badge>
                    
                    {/* Location Badge */}
                    <Badge className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      Location
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h4>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {video.description}
                    </p>
                    
                    <Button 
                      className="w-full mt-3 bg-primary hover:bg-secondary text-sm"
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
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-bold">
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
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={convertGoogleDriveUrl(selectedVideo.videoUrl)}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-green-100 text-green-800">
                    <MapPin className="w-3 h-3 mr-1" />
                    Location Advantage
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedVideo.duration}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}