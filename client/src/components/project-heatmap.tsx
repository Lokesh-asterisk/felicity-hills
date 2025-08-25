import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Project } from '@shared/schema';

interface HeatmapProject {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  type: string;
  status: string;
  priceRange: string;
  latitude?: string | null;
  longitude?: string | null;
  featured: boolean;
}

interface ProjectHeatmapProps {
  selectedStatus?: string;
  selectedType?: string;
  showFeaturedOnly?: boolean;
}

export default function ProjectHeatmap({ 
  selectedStatus, 
  selectedType, 
  showFeaturedOnly 
}: ProjectHeatmapProps) {
  const [selectedProject, setSelectedProject] = useState<HeatmapProject | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 30.3165, lng: 78.0322 }); // Dehradun area
  const mapRef = useRef<HTMLDivElement>(null);
  
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"]
  });

  // Filter projects based on props and coordinates
  const heatmapProjects = projects.filter(project => {
    if (!project.latitude || !project.longitude) return false;
    if (selectedStatus && project.status !== selectedStatus) return false;
    if (selectedType && project.type !== selectedType) return false;
    if (showFeaturedOnly && !project.featured) return false;
    return true;
  });

  // Calculate heatmap intensity based on project metrics
  const getHeatmapIntensity = (project: HeatmapProject) => {
    let intensity = 0.3; // Base intensity
    
    // Increase intensity for featured projects
    if (project.featured) intensity += 0.3;
    
    // Increase intensity based on status
    switch (project.status) {
      case 'active': intensity += 0.4; break;
      case 'upcoming': intensity += 0.2; break;
      case 'completed': intensity += 0.1; break;
      default: break;
    }
    
    return Math.min(intensity, 1.0);
  };

  // Get color based on project type
  const getProjectColor = (type: string) => {
    switch (type) {
      case 'residential': return '#3B82F6'; // Blue
      case 'commercial': return '#10B981'; // Green
      case 'agricultural': return '#F59E0B'; // Amber
      case 'mixed': return '#8B5CF6'; // Purple
      default: return '#6B7280'; // Gray
    }
  };

  // Initialize map with actual coordinates
  useEffect(() => {
    if (heatmapProjects.length > 0) {
      // Calculate map center from project coordinates
      const avgLat = heatmapProjects.reduce((sum, project) => 
        sum + parseFloat(project.latitude || '0'), 0) / heatmapProjects.length;
      const avgLng = heatmapProjects.reduce((sum, project) => 
        sum + parseFloat(project.longitude || '0'), 0) / heatmapProjects.length;
      
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  }, [heatmapProjects]);

  // Generate Google Maps embed URL with markers
  const generateMapUrl = () => {
    const markers = heatmapProjects.map((project, index) => {
      const color = getProjectColor(project.type).replace('#', '');
      const label = String.fromCharCode(65 + index); // A, B, C, etc.
      return `markers=color:0x${color}%7Clabel:${label}%7C${project.latitude},${project.longitude}`;
    }).join('&');
    
    const apiKey = "AIzaSyBFw0Qbyq9zTFTd-tUqqo6yLWFyhx_gdHg"; // You'll need your own API key
    return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${mapCenter.lat},${mapCenter.lng}&zoom=11&${markers}`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading heatmap...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-green-50">
        <h3 className="text-lg font-semibold text-gray-800">Interactive Project Heatmap</h3>
        <p className="text-sm text-gray-600">
          Explore {heatmapProjects.length} projects with geographic coordinates
        </p>
      </div>
      
      <div className="relative">
        {/* Google Maps Integration */}
        <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100">
          {heatmapProjects.length > 0 ? (
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${50000}!2d${mapCenter.lng}!3d${mapCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1629780000000!5m2!1sen!2sin`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <div className="mb-2">🗺️</div>
                <p>No projects with coordinates to display</p>
              </div>
            </div>
          )}
        </div>

        {/* Project Markers Overlay */}
        {heatmapProjects.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="relative w-full h-96">
              {heatmapProjects.map((project, index) => {
                if (!project.latitude || !project.longitude) return null;
                
                // Calculate approximate position on the map (simplified)
                const lat = parseFloat(project.latitude);
                const lng = parseFloat(project.longitude);
                
                // Simple positioning relative to map center (this is approximate)
                const latDiff = (lat - mapCenter.lat) * 111000; // meters per degree lat
                const lngDiff = (lng - mapCenter.lng) * 111000 * Math.cos(lat * Math.PI / 180);
                
                // Convert to pixels (very approximate for zoom level 11)
                const scale = 0.5; // Adjust based on zoom level
                const x = 50 + (lngDiff * scale * 0.001); // Rough conversion
                const y = 50 - (latDiff * scale * 0.001);
                
                const color = getProjectColor(project.type);
                const intensity = getHeatmapIntensity(project);
                
                return (
                  <div
                    key={project.id}
                    className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${Math.max(5, Math.min(95, x))}%`,
                      top: `${Math.max(5, Math.min(95, y))}%`,
                    }}
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Heatmap glow effect */}
                    <div
                      className="absolute inset-0 rounded-full animate-pulse"
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: color,
                        opacity: intensity * 0.3,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                    
                    {/* Project marker */}
                    <div
                      className="relative z-10 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform"
                      style={{
                        width: project.featured ? '16px' : '12px',
                        height: project.featured ? '16px' : '12px',
                        backgroundColor: color,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                    
                    {/* Featured indicator */}
                    {project.featured && (
                      <div
                        className="absolute inset-0 rounded-full border-2 animate-ping"
                        style={{
                          borderColor: '#fbbf24',
                          width: '24px',
                          height: '24px',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    )}
                    
                    {/* Project label */}
                    <div
                      className="absolute whitespace-nowrap text-xs font-medium text-gray-700 bg-white/90 px-2 py-1 rounded shadow-sm"
                      style={{
                        transform: 'translate(-50%, -130%)',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                      }}
                    >
                      {project.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 border">
          <h4 className="text-sm font-semibold mb-2">Project Types</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Residential</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Commercial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Agricultural</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Mixed</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full border-2 border-yellow-400"></div>
              <span>Featured</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Project Details Panel */}
      {selectedProject && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-800">{selectedProject.name}</h4>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-400 hover:text-gray-600"
              data-testid="close-project-details"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Location:</span>
              <span className="ml-2">{selectedProject.location}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Type:</span>
              <span className="ml-2 capitalize">{selectedProject.type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                selectedProject.status === 'active' ? 'bg-green-100 text-green-800' :
                selectedProject.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedProject.status}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Price Range:</span>
              <span className="ml-2">{selectedProject.priceRange}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{selectedProject.shortDescription}</p>
        </div>
      )}
      
      {/* Empty state */}
      {heatmapProjects.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <div className="mb-2">🗺️</div>
          <p>No projects with coordinates found.</p>
          <p className="text-xs mt-1">Add latitude and longitude to projects in the admin dashboard.</p>
        </div>
      )}
    </div>
  );
}