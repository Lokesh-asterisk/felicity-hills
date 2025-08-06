import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { Plot } from "@shared/schema";

export default function PlotSelection() {
  const { data: plots, isLoading } = useQuery<Plot[]>({
    queryKey: ["/api/plots"],
  });

  const getPlotStatusColor = (available: boolean, category: string) => {
    if (!available) return "bg-gray-100 border-gray-300 opacity-60";
    if (category === "premium") return "bg-amber-50 border-amber-200";
    if (category === "small") return "bg-blue-50 border-blue-200";
    return "bg-green-50 border-green-200";
  };

  const getStatusBadge = (available: boolean, category: string) => {
    if (!available) return <Badge variant="destructive" className="text-xs">Sold</Badge>;
    if (category === "premium") return <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">Premium</Badge>;
    if (category === "small") return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">Small</Badge>;
    return <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Available</Badge>;
  };

  const plotRates = [
    { category: "Plot 1-4", price: "₹9,500/गज", feature: "40 ft road" },
    { category: "Plot 5", price: "₹10,000/गज", feature: "Double road + pool facing" },
    { category: "Small Plots", price: "₹8,100/गज", feature: "25 ft road" }
  ];

  if (isLoading) {
    return (
      <section id="plots" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="plots" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Plot Selection
          </h2>
          <p className="text-xl text-gray-600">
            Choose your preferred plot
          </p>
        </div>

        {/* Plot Rates Overview */}
        <Card className="shadow-lg mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Plot Rates</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plotRates.map((rate, index) => (
                <Card key={rate.category} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="font-semibold text-gray-900">{rate.category}</div>
                    <div className="text-2xl font-bold text-primary">{rate.price}</div>
                    <div className="text-sm text-gray-600">{rate.feature}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Plot Layout */}
        <Card className="shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Plot Layout Map</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {plots?.map((plot, index) => (
                <Card 
                  key={plot.id}
                  className={`${getPlotStatusColor(plot.available ?? true, plot.category)} border-2 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900">{plot.plotNumber}</span>
                      {getStatusBadge(plot.available ?? true, plot.category)}
                    </div>
                    <div className="text-sm space-y-1">
                      <div><span className="font-medium">{plot.size} गज</span></div>
                      <div className={`font-semibold ${plot.available ? 'text-primary' : 'text-gray-500'}`}>
                        ₹{plot.pricePerSqYd.toLocaleString()}/गज
                      </div>
                      <div className="text-gray-600">{plot.roadWidth} ft road</div>
                      {plot.location && (
                        <div className="text-xs text-gray-500 capitalize">
                          {plot.location.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3">लेजेंड:</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded mr-2"></div>
                  <span className="text-sm">Premium</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded mr-2"></div>
                  <span className="text-sm">Small Plots</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                  <span className="text-sm">Sold</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
