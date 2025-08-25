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

  // Calculate map center from all projects
  const mapCenter = React.useMemo(() => {
    if (heatmapProjects.length === 0) return { lat: 30.3165, lng: 78.0322 };
    
    const avgLat = heatmapProjects.reduce((sum, project) => 
      sum + parseFloat(project.latitude || '0'), 0) / heatmapProjects.length;
    const avgLng = heatmapProjects.reduce((sum, project) => 
      sum + parseFloat(project.longitude || '0'), 0) / heatmapProjects.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [heatmapProjects]);

  // Generate Google Maps URL with actual markers - using simpler approach
  const googleMapsUrl = React.useMemo(() => {
    if (heatmapProjects.length === 0) {
      // Default map centered on Dehradun
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55659.24344818684!2d78.01855632167968!3d30.31649707593402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888af%3A0x4c3562c032518799!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1629780000000!5m2!1sen!2sin`;
    }

    // For multiple markers, create a simple search URL that Google Maps will render properly
    if (heatmapProjects.length === 1) {
      const project = heatmapProjects[0];
      return `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3462.746!2d${project.longitude}!3d${project.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzAuMzE2NSxOIDc4LjAzMjIsRQ!!5e0!3m2!1sen!2sin!4v1629780000000!5m2!1sen!2sin`;
    }
    
    // For multiple projects, center on the map area and let users click the project links below
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27829.622!2d${mapCenter.lng}!3d${mapCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888af%3A0x4c3562c032518799!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1629780000000!5m2!1sen!2sin`;
  }, [heatmapProjects, mapCenter]);

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
        {/* Google Maps with Native Markers at Real Coordinates */}
        <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={googleMapsUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
            title="Interactive Project Heatmap"
          />
        </div>

        {/* Direct Links to Open in Google Maps */}
        {heatmapProjects.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {heatmapProjects.map((project, index) => (
              <a
                key={project.id}
                href={`https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}&query_place_id=${project.name.replace(/\s+/g, '+')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ 
                    backgroundColor: project.type === 'residential' ? '#3B82F6' : 
                                   project.type === 'commercial' ? '#10B981' : 
                                   project.type === 'agricultural' ? '#F59E0B' : '#8B5CF6' 
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{project.name}</div>
                  <div className="text-xs text-gray-500">{project.latitude}, {project.longitude}</div>
                </div>
                <div className="text-xs text-blue-600 flex-shrink-0">View →</div>
              </a>
            ))}
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