import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Clock, Loader2, X, ArrowLeft, Filter } from "lucide-react";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import type { Video } from "@shared/schema";

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const filteredVideos = videos?.filter(video => 
    selectedCategory === "all" || video.category === selectedCategory
  );

  const categories = [
    { value: "all", label: "All Videos", icon: "🎬" },
    { value: "project", label: "Project Overview", icon: "🏗️" },
    { value: "location", label: "Location & Connectivity", icon: "📍" },
    { value: "testimonial", label: "Customer Stories", icon: "💬" }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "project": return "bg-blue-100 text-blue-800 border-blue-200";
      case "location": return "bg-green-100 text-green-800 border-green-200";
      case "testimonial": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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

  // Function to convert Google Drive share URL to embed URL
  const convertGoogleDriveUrl = (url: string) => {
    console.log('Original URL:', url);
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      console.log('Extracted file ID:', fileId);
      if (fileId) {
        // Try different embed formats for better compatibility
        const embedUrl = `https://drive.google.com/file/d/${fileId}/preview?usp=embed_facebook`;
        console.log('Embed URL:', embedUrl);
        return embedUrl;
      }
    }
    console.log('Returning original URL:', url);
    return url;
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <Button 
              onClick={goHome}
              variant="outline" 
              className="mb-6 border-primary text-primary hover:bg-primary hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Project Videos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch comprehensive videos showcasing our Khushalipur agricultural land project, 
              location advantages, amenities, and real customer experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-500 mr-2" />
            {categories.map((category) => (
              <Button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedCategory === category.value 
                    ? "bg-primary hover:bg-secondary" 
                    : "border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCategory === "all" 
                    ? `All Videos (${filteredVideos?.length})` 
                    : `${categories.find(c => c.value === selectedCategory)?.label} (${filteredVideos?.length})`
                  }
                </h2>
                <p className="text-gray-600">
                  High-quality videos to help you understand our project better
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos?.map((video, index) => (
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
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-primary ml-1" />
                        </div>
                      </div>
                      
                      {/* Duration Badge */}
                      <Badge className="absolute top-3 right-3 bg-black/70 text-white text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration}
                      </Badge>
                      
                      {/* Category Badge */}
                      <Badge className={`absolute top-3 left-3 text-xs ${getCategoryColor(video.category)}`}>
                        {getCategoryIcon(video.category)} {video.category}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
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

              {filteredVideos?.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📹</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No videos found
                  </h3>
                  <p className="text-gray-600">
                    No videos available for the selected category.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl w-full p-0">
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
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <Badge className={getCategoryColor(selectedVideo.category)}>
                    {getCategoryIcon(selectedVideo.category)} {selectedVideo.category}
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

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Invest?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            After watching our videos, book a site visit to experience everything in person
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={goHome}
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
        </div>
      </section>

      <Footer />
    </div>
  );
}