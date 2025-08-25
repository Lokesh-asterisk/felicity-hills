import React, { useState, useEffect } from 'react';
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

  // Convert lat/lng to SVG coordinates (simplified projection)
  const latLngToSVG = (lat: string, lng: string) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    // Simplified conversion for Dehradun area (adjust based on your region)
    const minLat = 30.0, maxLat = 30.5;
    const minLng = 77.8, maxLng = 78.3;
    
    const x = ((longitude - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - latitude) / (maxLat - minLat)) * 600;
    
    return { x: Math.max(0, Math.min(800, x)), y: Math.max(0, Math.min(600, y)) };
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
        {/* SVG Heatmap */}
        <svg 
          viewBox="0 0 800 600" 
          className="w-full h-96 bg-gradient-to-br from-gray-50 to-blue-50"
          style={{ aspectRatio: '4/3' }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Region labels */}
          <text x="100" y="50" className="text-sm fill-gray-500 font-medium">Dehradun Region</text>
          <text x="600" y="550" className="text-xs fill-gray-400">Agricultural & Residential Areas</text>
          
          {/* Project markers */}
          {heatmapProjects.map((project) => {
            if (!project.latitude || !project.longitude) return null;
            
            const { x, y } = latLngToSVG(project.latitude, project.longitude);
            const intensity = getHeatmapIntensity(project);
            const color = getProjectColor(project.type);
            
            return (
              <g key={project.id}>
                {/* Heatmap glow effect */}
                <circle
                  cx={x}
                  cy={y}
                  r={25}
                  fill={color}
                  opacity={intensity * 0.3}
                  className="animate-pulse"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={15}
                  fill={color}
                  opacity={intensity * 0.5}
                />
                
                {/* Project marker */}
                <circle
                  cx={x}
                  cy={y}
                  r={project.featured ? 8 : 6}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setSelectedProject(project)}
                />
                
                {/* Featured project indicator */}
                {project.featured && (
                  <circle
                    cx={x}
                    cy={y}
                    r={12}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    className="animate-ping"
                  />
                )}
                
                {/* Project label */}
                <text
                  x={x}
                  y={y - 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-medium pointer-events-none"
                  style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}
                >
                  {project.name}
                </text>
              </g>
            );
          })}
        </svg>
        
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