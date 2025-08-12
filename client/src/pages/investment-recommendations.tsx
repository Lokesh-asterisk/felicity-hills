import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, TrendingUp, DollarSign, MapPin, Clock, Shield, Star, Target, Lightbulb, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Plot } from "@shared/schema";

const investmentProfileSchema = z.object({
  userEmail: z.string().email("Please enter a valid email address"),
  budget: z.number().min(50000, "Minimum budget should be ₹50,000"),
  investmentGoal: z.string().min(1, "Please select an investment goal"),
  riskTolerance: z.string().min(1, "Please select your risk tolerance"),
  timeHorizon: z.string().min(1, "Please select your time horizon"),
  preferredSize: z.string().min(1, "Please select preferred plot size"),
  location: z.string().min(1, "Please specify location preference"),
  experience: z.string().min(1, "Please select your experience level"),
  priorities: z.array(z.string()).min(1, "Please select at least one priority"),
});

type InvestmentProfileForm = z.infer<typeof investmentProfileSchema>;

interface Recommendation {
  plot: Plot;
  matchScore: number;
  reasons: string[];
  aiInsights: string;
  projectedROI: string;
  riskAssessment: string;
}

interface RecommendationResult {
  profileId: string;
  recommendations: Recommendation[];
  marketInsights: string;
  investmentAdvice: string;
  alternativeOptions: string;
}

export default function InvestmentRecommendations() {
  const [step, setStep] = useState(1);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);

  const form = useForm<InvestmentProfileForm>({
    resolver: zodResolver(investmentProfileSchema),
    defaultValues: {
      userEmail: "",
      budget: 500000,
      investmentGoal: "",
      riskTolerance: "",
      timeHorizon: "",
      preferredSize: "",
      location: "",
      experience: "",
      priorities: [],
    },
  });

  const recommendationMutation = useMutation({
    mutationFn: async (data: InvestmentProfileForm) => {
      return apiRequest("/api/investment-recommendations", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data: RecommendationResult) => {
      setRecommendations(data);
      setStep(3);
    },
  });

  const onSubmit = (data: InvestmentProfileForm) => {
    setStep(2);
    recommendationMutation.mutate(data);
  };

  const priorityOptions = [
    { id: "roi", label: "High Returns (ROI)" },
    { id: "location", label: "Prime Location" },
    { id: "amenities", label: "Modern Amenities" },
    { id: "infrastructure", label: "Infrastructure Development" },
    { id: "security", label: "Security & Safety" },
    { id: "connectivity", label: "Road Connectivity" },
  ];

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Brain className="h-10 w-10 text-emerald-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                AI-Powered Investment Recommendations
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get personalized agricultural land investment suggestions based on your financial goals, 
              risk tolerance, and investment preferences using advanced AI analysis.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-600" />
                    Personal Information & Investment Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="userEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Budget (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="500000" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="investmentGoal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Goal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your primary goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="long-term">Long-term Appreciation</SelectItem>
                              <SelectItem value="short-term">Short-term Gains</SelectItem>
                              <SelectItem value="rental-income">Rental Income</SelectItem>
                              <SelectItem value="development">Land Development</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeHorizon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Time Horizon</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="How long do you plan to hold?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-2 years">1-2 Years</SelectItem>
                              <SelectItem value="3-5 years">3-5 Years</SelectItem>
                              <SelectItem value="5+ years">5+ Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="riskTolerance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Tolerance</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your risk comfort level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low - Stable, secure investments</SelectItem>
                              <SelectItem value="medium">Medium - Balanced risk/reward</SelectItem>
                              <SelectItem value="high">High - Maximum growth potential</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Your experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner - First time investor</SelectItem>
                              <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                              <SelectItem value="expert">Expert - Experienced investor</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="preferredSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Plot Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="small">Small (Under 1000 sq ft)</SelectItem>
                              <SelectItem value="medium">Medium (1000-2000 sq ft)</SelectItem>
                              <SelectItem value="large">Large (Above 2000 sq ft)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Preference</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Near Dehradun, Highway access" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="priorities"
                    render={() => (
                      <FormItem>
                        <FormLabel>Investment Priorities (Select all that apply)</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {priorityOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="priorities"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, option.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== option.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="text-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
                  disabled={recommendationMutation.isPending}
                >
                  {recommendationMutation.isPending ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Your Profile...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Get AI Recommendations
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Brain className="h-16 w-16 text-emerald-600 mx-auto animate-pulse" />
              <h3 className="text-xl font-semibold">AI is analyzing your investment profile</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we generate personalized recommendations based on your preferences...
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 3 && recommendations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Brain className="h-10 w-10 text-emerald-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Your Personalized Investment Recommendations
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Based on AI analysis of your profile and current market conditions
            </p>
          </div>

          {/* Market Insights */}
          <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                <TrendingUp className="h-5 w-5" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 dark:text-blue-300">{recommendations.marketInsights}</p>
            </CardContent>
          </Card>

          {/* Investment Advice */}
          <Card className="mb-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Lightbulb className="h-5 w-5" />
                Personalized Investment Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 dark:text-amber-300">{recommendations.investmentAdvice}</p>
            </CardContent>
          </Card>

          {/* Recommended Plots */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Top Recommended Plots
            </h2>
            
            {recommendations.recommendations.map((rec, index) => (
              <Card key={rec.plot.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      #{index + 1} Plot {rec.plot.plotNumber}
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                        {rec.matchScore}% Match
                      </Badge>
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        ₹{(rec.plot.pricePerSqYd * rec.plot.size).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{rec.plot.pricePerSqYd}/sq yd
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{rec.plot.size} sq yards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{rec.plot.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-green-600">{rec.projectedROI}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Why This Plot Suits You:</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {rec.reasons.map((reason, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">AI Analysis:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{rec.aiInsights}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Risk Assessment:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{rec.riskAssessment}</p>
                  </div>

                  {rec.plot.features && rec.plot.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.plot.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alternative Options */}
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                <Target className="h-5 w-5" />
                Alternative Investment Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 dark:text-purple-300">{recommendations.alternativeOptions}</p>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button 
              onClick={() => setStep(1)} 
              variant="outline" 
              size="lg"
              className="mr-4"
            >
              New Analysis
            </Button>
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Schedule Site Visit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}