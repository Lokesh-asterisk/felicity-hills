import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Mountain, DollarSign, Calendar, Award, Sparkles } from "lucide-react";

const plotSizes = [
  { size: 500, price: 15000, type: "Luxury Cottage Plot" },
  { size: 750, price: 16000, type: "Premium Villa Plot" },
  { size: 1000, price: 17000, type: "Executive Estate Plot" },
  { size: 1500, price: 18000, type: "Ultra-Luxury Estate" },
  { size: 2000, price: 19000, type: "Exclusive Mountain Estate" }
];

const investmentScenarios = [
  { years: 3, growth: 25, scenario: "Conservative Hill Station Growth" },
  { years: 5, growth: 30, scenario: "Expected Tourism Boom" },
  { years: 7, growth: 35, scenario: "Premium Development Complete" },
  { years: 10, growth: 40, scenario: "Established Hill Station Hub" }
];

export default function PanchurInvestmentCalculator() {
  const [selectedPlotSize, setSelectedPlotSize] = useState<number>(750);
  const [selectedYears, setSelectedYears] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [useCustom, setUseCustom] = useState<boolean>(false);

  const selectedPlot = plotSizes.find(plot => plot.size === selectedPlotSize) || plotSizes[1];
  const selectedScenario = investmentScenarios.find(scenario => scenario.years === selectedYears) || investmentScenarios[1];
  
  const totalInvestment = useCustom && customAmount ? 
    parseInt(customAmount) : 
    selectedPlot.size * selectedPlot.price;
  
  const futureValue = totalInvestment * (1 + selectedScenario.growth / 100);
  const totalReturns = futureValue - totalInvestment;
  const annualReturn = (Math.pow(futureValue / totalInvestment, 1 / selectedYears) - 1) * 100;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="calculator" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="inline-flex items-center mb-4 bg-blue-100 text-blue-800">
            <Calculator className="w-4 h-4 mr-2" />
            Premium Hill Station Investment Calculator
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Calculate Your Himalayan Investment Returns
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the potential returns from investing in premium hill station plots 
            with our comprehensive investment calculator.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Inputs */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-900">
                <Mountain className="h-6 w-6 text-blue-600 mr-2" />
                Investment Calculator
              </CardTitle>
              <CardDescription>
                Select your preferred plot size and investment timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Investment Type Toggle */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Investment Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={!useCustom ? "default" : "outline"}
                    onClick={() => setUseCustom(false)}
                    className={!useCustom ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    Plot Based
                  </Button>
                  <Button
                    variant={useCustom ? "default" : "outline"}
                    onClick={() => setUseCustom(true)}
                    className={useCustom ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    Custom Amount
                  </Button>
                </div>
              </div>

              {/* Plot Selection or Custom Amount */}
              {!useCustom ? (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Select Plot Size</Label>
                  <Select value={selectedPlotSize.toString()} onValueChange={(value) => setSelectedPlotSize(parseInt(value))}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {plotSizes.map((plot) => (
                        <SelectItem key={plot.size} value={plot.size.toString()}>
                          {plot.size} sq yd - {plot.type} (₹{plot.price}/sq yd)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="bg-white/80 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Investment Details:</div>
                    <div className="font-semibold text-lg">
                      {selectedPlot.size} sq yd × ₹{selectedPlot.price.toLocaleString()} = ₹{totalInvestment.toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Investment Amount</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount in ₹"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
              )}

              {/* Investment Timeline */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Investment Timeline</Label>
                <Select value={selectedYears.toString()} onValueChange={(value) => setSelectedYears(parseInt(value))}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {investmentScenarios.map((scenario) => (
                      <SelectItem key={scenario.years} value={scenario.years.toString()}>
                        {scenario.years} years - {scenario.scenario} ({scenario.growth}% growth)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-6">
            {/* Investment Summary */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                  Investment Projection
                </CardTitle>
                <CardDescription>
                  Based on {selectedScenario.scenario.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">₹{totalInvestment.toLocaleString()}</div>
                    <div className="text-gray-600">Initial Investment</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{selectedYears} Years</div>
                    <div className="text-gray-600">Investment Period</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Returns Breakdown */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <Award className="h-6 w-6 text-purple-600 mr-2" />
                  Expected Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/80 rounded-lg">
                    <span className="font-medium">Future Value:</span>
                    <span className="text-2xl font-bold text-purple-600">₹{futureValue.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-white/80 rounded-lg">
                    <span className="font-medium">Total Returns:</span>
                    <span className="text-2xl font-bold text-green-600">₹{totalReturns.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-white/80 rounded-lg">
                    <span className="font-medium">Annual Return Rate:</span>
                    <span className="text-2xl font-bold text-blue-600">{annualReturn.toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                    <span className="font-medium">Total Growth:</span>
                    <span className="text-2xl font-bold text-orange-600">{selectedScenario.growth}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Advantages */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-900">
                  <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
                  Hill Station Investment Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span>Premium location scarcity drives higher appreciation</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span>Growing hill station tourism boosts property values</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span>Climate change increases demand for cool locations</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span>Limited development permissions protect exclusivity</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
          <Mountain className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">Ready to Invest in Your Himalayan Future?</h3>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg mb-6">
            These projections are based on market analysis and hill station development trends. 
            Book a premium site visit to see the location and discuss investment options.
          </p>
          
          <Button 
            size="lg"
            onClick={() => scrollToSection('contact')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Premium Site Visit
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            * Investment projections are estimates based on market analysis and past trends. 
            Actual returns may vary based on market conditions, development progress, and external factors.
          </p>
        </div>
      </div>
    </section>
  );
}