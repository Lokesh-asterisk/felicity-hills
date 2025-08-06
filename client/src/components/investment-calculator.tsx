import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Shield, MapPin, Home } from "lucide-react";

interface CalculationResult {
  totalInvestment: number;
  expectedValue: number;
  estimatedReturns: number;
}

export default function InvestmentCalculator() {
  const [plotSize, setPlotSize] = useState<string>("");
  const [ratePerGaj, setRatePerGaj] = useState<string>("");
  const [investmentPeriod, setInvestmentPeriod] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateInvestment = () => {
    if (!plotSize || !ratePerGaj || !investmentPeriod) {
      return;
    }

    const size = parseFloat(plotSize);
    const rate = parseFloat(ratePerGaj);
    const period = parseFloat(investmentPeriod);

    const totalInvestment = size * rate;
    const annualReturn = 0.175; // 17.5% average
    const expectedValue = totalInvestment * Math.pow(1 + annualReturn, period);
    const estimatedReturns = expectedValue - totalInvestment;

    setResult({
      totalInvestment,
      expectedValue,
      estimatedReturns
    });
  };

  const formatCurrency = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const investmentBenefits = [
    {
      icon: TrendingUp,
      title: "15-20% Annual Returns",
      description: "Expected returns better than market",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Shield,
      title: "Safe Investment",
      description: "Registered in agricultural land category",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Delhi-Dehradun Expressway connectivity",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Home,
      title: "Future Development",
      description: "Cottage and farm house construction potential",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Investment Calculator
          </h2>
          <p className="text-xl text-gray-600">
            Calculate your investment returns
          </p>
        </div>

        <Card className="bg-gradient-to-br from-green-50 to-teal-50 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Calculate Returns</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plot Size (in gaj)
                    </label>
                    <Select value={plotSize} onValueChange={setPlotSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Plot Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="200">200 gaj</SelectItem>
                        <SelectItem value="250">250 gaj</SelectItem>
                        <SelectItem value="300">300 gaj</SelectItem>
                        <SelectItem value="400">400 gaj</SelectItem>
                        <SelectItem value="500">500 gaj</SelectItem>
                        <SelectItem value="600">600 gaj</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate per gaj
                    </label>
                    <Select value={ratePerGaj} onValueChange={setRatePerGaj}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8100">₹8,100 (Small Plots)</SelectItem>
                        <SelectItem value="9000">₹9,000 (Gate Facing)</SelectItem>
                        <SelectItem value="9500">₹9,500 (40 ft Road)</SelectItem>
                        <SelectItem value="10000">₹10,000 (Premium)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Period (years)
                    </label>
                    <Select value={investmentPeriod} onValueChange={setInvestmentPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="2">2 Years</SelectItem>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={calculateInvestment} 
                    className="w-full bg-primary hover:bg-secondary"
                    size="lg"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Benefits</h3>
                <div className="space-y-4 mb-6">
                  {investmentBenefits.map((benefit, index) => (
                    <div key={benefit.title} className="flex items-center p-4 bg-white rounded-xl shadow-sm">
                      <div className={`w-12 h-12 ${benefit.color} rounded-full flex items-center justify-center mr-4`}>
                        <benefit.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold">{benefit.title}</div>
                        <div className="text-sm text-gray-600">{benefit.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Results Display */}
                {result && (
                  <Card className="shadow-lg animate-fade-in">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Investment Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Investment:</span>
                          <span className="font-semibold">{formatCurrency(result.totalInvestment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Value:</span>
                          <span className="font-semibold text-green-600">{formatCurrency(result.expectedValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Returns:</span>
                          <span className="font-semibold text-primary">{formatCurrency(result.estimatedReturns)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Comparison */}
        <Card className="mt-12 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Investment Comparison</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">15-20%</div>
                <div className="text-sm text-gray-600">Khushalipur Plots</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-2">6-7%</div>
                <div className="text-sm text-gray-600">Fixed Deposit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-2">10-12%</div>
                <div className="text-sm text-gray-600">Mutual Funds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-2">12-15%*</div>
                <div className="text-sm text-gray-600">Stock Market</div>
                <div className="text-xs text-gray-500 mt-1">*Subject to market risks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
