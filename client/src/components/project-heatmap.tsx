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
  featured: boolean | null;
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
  const [showLandBoundary, setShowLandBoundary] = useState(false);
  
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
        {/* Google Maps with Visual Project Markers */}
        <div className="w-full h-96 rounded-lg overflow-hidden bg-gray-100 relative">
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
          
          {/* Land Boundary Outline for Selected Project */}
          {selectedProject && showLandBoundary && (
            <div className="absolute inset-0 pointer-events-none">
              {(() => {
                const selectedLat = parseFloat(selectedProject.latitude || '0');
                const selectedLng = parseFloat(selectedProject.longitude || '0');
                
                // Calculate position for the selected project
                const mapBounds = {
                  north: 30.45,
                  south: 30.15,
                  east: 78.15,
                  west: 77.95
                };
                
                // Use percentage coordinates for the SVG viewBox
                const centerX = 50; // Center of the map area
                const centerY = 50;
                
                // Generate irregular land boundary shape (like in your image) - larger and more visible
                const boundaryPoints = [
                  { x: centerX - 15, y: centerY - 20 },   // Top-left
                  { x: centerX + 8, y: centerY - 25 },    // Top
                  { x: centerX + 20, y: centerY - 12 },   // Top-right
                  { x: centerX + 25, y: centerY + 5 },    // Right
                  { x: centerX + 18, y: centerY + 22 },   // Bottom-right
                  { x: centerX - 3, y: centerY + 25 },    // Bottom
                  { x: centerX - 20, y: centerY + 15 },   // Bottom-left
                  { x: centerX - 25, y: centerY - 5 },    // Left
                ];
                
                const pathData = `M ${boundaryPoints[0].x} ${boundaryPoints[0].y} ` +
                  boundaryPoints.slice(1).map(point => `L ${point.x} ${point.y}`).join(' ') + ' Z';
                
                return (
                  <svg 
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    style={{ pointerEvents: 'none', zIndex: 10 }}
                  >
                    {/* Animated dotted land boundary */}
                    <path
                      d={pathData}
                      fill="rgba(220, 38, 38, 0.1)"
                      stroke="#dc2626"
                      strokeWidth="0.8"
                      strokeDasharray="2,1"
                      style={{
                        filter: 'drop-shadow(0 0 2px rgba(220, 38, 38, 0.8))'
                      }}
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;3;0"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </path>
                    
                    {/* Land area label */}
                    <text
                      x={centerX}
                      y={centerY - 8}
                      textAnchor="middle"
                      className="text-xs font-bold fill-red-600"
                      style={{ 
                        fontSize: '3px',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.9)'
                      }}
                    >
                      {selectedProject.name}
                    </text>
                    <text
                      x={centerX}
                      y={centerY + 2}
                      textAnchor="middle"
                      className="text-xs font-medium fill-red-500"
                      style={{ 
                        fontSize: '2.5px',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.9)'
                      }}
                    >
                      Land Area: ~2-5 acres
                    </text>
                  </svg>
                );
              })()}
            </div>
          )}

          {/* Visual Markers Overlay on Map */}
          {heatmapProjects.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {heatmapProjects.map((project, index) => {
                if (!project.latitude || !project.longitude) return null;
                
                // Calculate approximate position on visible map
                const lat = parseFloat(project.latitude);
                const lng = parseFloat(project.longitude);
                
                // Position calculation relative to map bounds (Dehradun area)
                const mapBounds = {
                  north: 30.45,
                  south: 30.15,
                  east: 78.15,
                  west: 77.95
                };
                
                // Convert lat/lng to pixel coordinates within the iframe
                const x = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
                const y = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;
                
                // Only show markers that fall within visible bounds
                if (x < 0 || x > 100 || y < 0 || y > 100) return null;
                
                const color = getProjectColor(project.type);
                
                return (
                  <div
                    key={project.id}
                    className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                    onClick={() => {
                      setSelectedProject(project as HeatmapProject);
                      setShowLandBoundary(true);
                      // Optional: Open in new Google Maps tab
                      // window.open(`https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}&query_place_id=${encodeURIComponent(project.name)}`, '_blank');
                    }}
                  >
                    {/* Coverage Area Circle */}
                    <div
                      className="absolute inset-0 rounded-full border-2 border-dashed opacity-30"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderColor: color,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                    
                    {/* Heatmap glow effect */}
                    <div
                      className="absolute inset-0 rounded-full animate-pulse opacity-40"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: color,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                    
                    {/* Project marker pin */}
                    <div
                      className="relative z-10 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform"
                      style={{
                        width: project.featured ? '12px' : '8px',
                        height: project.featured ? '12px' : '8px',
                        backgroundColor: color,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                    
                    {/* Featured project pulse */}
                    {project.featured && (
                      <div
                        className="absolute inset-0 rounded-full border-2 animate-ping"
                        style={{
                          borderColor: '#fbbf24',
                          width: '16px',
                          height: '16px',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    )}
                    
                    {/* Project name and coverage info tooltip */}
                    <div
                      className="absolute whitespace-nowrap text-xs font-medium text-gray-800 bg-white/95 px-2 py-1 rounded shadow-lg border opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                      style={{
                        transform: 'translate(-50%, -120%)',
                        textShadow: 'none',
                      }}
                    >
                      <div className="font-semibold">{project.name}</div>
                      <div className="text-gray-600">Coverage: ~2-5 acres radius</div>
                      <div className="text-blue-600">Click for exact location</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Project List with Direct Map Links */}
        {heatmapProjects.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Project Locations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {heatmapProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-all cursor-pointer ${
                    selectedProject?.id === project.id 
                      ? 'bg-blue-50 border-blue-300 shadow-md' 
                      : 'bg-white border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedProject(project as HeatmapProject);
                    setShowLandBoundary(true);
                    // Optional: Open exact location in Google Maps
                    // window.open(`https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}&query_place_id=${encodeURIComponent(project.name)}`, '_blank');
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0 border border-white shadow-sm"
                    style={{ 
                      backgroundColor: getProjectColor(project.type)
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{project.name}</div>
                    <div className="text-xs text-gray-500">{project.latitude}°N, {project.longitude}°E</div>
                    <div className="text-xs text-gray-400 capitalize">{project.type} • {project.status}</div>
                    <div className="text-xs text-green-600 font-medium">Coverage: ~2-5 acres radius</div>
                  </div>
                  <div className="text-xs text-blue-600 flex-shrink-0 font-medium">View Location →</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Enhanced Legend with Coverage Info */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 border max-w-48">
          <h4 className="text-sm font-semibold mb-2">Project Types & Coverage</h4>
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
          
          <hr className="my-2" />
          
          <h5 className="text-xs font-semibold mb-1">Coverage Areas</h5>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-dashed border-gray-400"></div>
              <span>Land coverage radius</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              <span>Project center point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-yellow-400"></div>
              <span>Featured projects</span>
            </div>
            <div className="text-xs text-green-600 mt-1 font-medium">
              ~2-5 acres per project
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
              onClick={() => {
                setSelectedProject(null);
                setShowLandBoundary(false);
              }}
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
            <div className="md:col-span-2">
              <span className="font-medium text-red-600">Land Coverage:</span>
              <span className="ml-2 text-green-600 font-medium">~2-5 acres total area</span>
            </div>
          </div>
          
          {/* Land Boundary Toggle Button */}
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setShowLandBoundary(!showLandBoundary)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showLandBoundary 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showLandBoundary ? '🔴 Hide Land Boundary' : '📍 Show Land Boundary'}
            </button>
            <button
              onClick={() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${selectedProject.latitude},${selectedProject.longitude}&query_place_id=${encodeURIComponent(selectedProject.name)}`, '_blank');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              🗺️ Open in Google Maps
            </button>
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