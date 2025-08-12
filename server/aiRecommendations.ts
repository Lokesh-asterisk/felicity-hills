import OpenAI from "openai";
import type { Plot } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface InvestmentProfile {
  budget: number;
  investmentGoal: string; // "long-term", "short-term", "rental-income", "development"
  riskTolerance: string; // "low", "medium", "high"
  timeHorizon: string; // "1-2 years", "3-5 years", "5+ years"
  preferredSize: string; // "small", "medium", "large"
  location: string;
  experience: string; // "beginner", "intermediate", "expert"
  priorities: string[]; // ["roi", "location", "amenities", "infrastructure"]
}

export interface RecommendationResult {
  recommendations: Array<{
    plot: Plot;
    matchScore: number;
    reasons: string[];
    aiInsights: string;
    projectedROI: string;
    riskAssessment: string;
  }>;
  marketInsights: string;
  investmentAdvice: string;
  alternativeOptions: string;
}

export async function generateInvestmentRecommendations(
  profile: InvestmentProfile,
  availablePlots: Plot[]
): Promise<RecommendationResult> {
  try {
    // Filter plots within budget
    const affordablePlots = availablePlots.filter(plot => 
      plot.pricePerSqft * plot.sizeInSqft <= profile.budget * 1.1 // Allow 10% flexibility
    );

    if (affordablePlots.length === 0) {
      throw new Error("No plots available within the specified budget");
    }

    // Prepare data for AI analysis
    const plotsData = affordablePlots.map(plot => ({
      id: plot.id,
      location: plot.location,
      size: plot.sizeInSqft,
      pricePerSqft: plot.pricePerSqft,
      totalPrice: plot.pricePerSqft * plot.sizeInSqft,
      features: plot.features,
      nearbyAmenities: plot.nearbyAmenities,
      soilType: plot.soilType,
      waterAccess: plot.waterAccess,
      roadAccess: plot.roadAccess
    }));

    const prompt = `
You are an expert agricultural land investment advisor with deep knowledge of real estate markets, agricultural potential, and investment strategies. Analyze the following investment profile and available land plots to provide personalized recommendations.

INVESTOR PROFILE:
- Budget: ₹${profile.budget.toLocaleString()}
- Investment Goal: ${profile.investmentGoal}
- Risk Tolerance: ${profile.riskTolerance}
- Time Horizon: ${profile.timeHorizon}
- Preferred Size: ${profile.preferredSize}
- Location Preference: ${profile.location}
- Experience Level: ${profile.experience}
- Priorities: ${profile.priorities.join(", ")}

AVAILABLE PLOTS:
${JSON.stringify(plotsData, null, 2)}

Please provide a comprehensive analysis in the following JSON format:

{
  "plotAnalysis": [
    {
      "plotId": "string",
      "matchScore": number (1-100),
      "reasons": ["reason1", "reason2", "reason3"],
      "aiInsights": "detailed analysis of why this plot suits the investor",
      "projectedROI": "specific ROI projection with timeline",
      "riskAssessment": "risk analysis and mitigation strategies"
    }
  ],
  "marketInsights": "current market trends and opportunities in agricultural land investment",
  "investmentAdvice": "personalized advice based on the investor's profile and goals",
  "alternativeOptions": "suggestions for alternative investment strategies or plot modifications"
}

Consider factors like:
- Land appreciation potential in the specific location
- Agricultural productivity and soil quality
- Infrastructure development plans
- Water availability and irrigation potential
- Accessibility and connectivity
- Legal and regulatory considerations
- Market demand for agricultural produce in the area
- Exit strategy options

Provide specific, actionable insights that help the investor make an informed decision.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert agricultural land investment advisor. Provide detailed, accurate, and actionable investment recommendations based on real market analysis. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiAnalysis = JSON.parse(response.choices[0].message.content!);

    // Process AI recommendations and match with plot data
    const recommendations = aiAnalysis.plotAnalysis
      .sort((a: any, b: any) => b.matchScore - a.matchScore)
      .slice(0, 3) // Top 3 recommendations
      .map((analysis: any) => {
        const plot = affordablePlots.find(p => p.id === analysis.plotId);
        return {
          plot: plot!,
          matchScore: analysis.matchScore,
          reasons: analysis.reasons,
          aiInsights: analysis.aiInsights,
          projectedROI: analysis.projectedROI,
          riskAssessment: analysis.riskAssessment
        };
      })
      .filter((rec: any) => rec.plot); // Ensure plot exists

    return {
      recommendations,
      marketInsights: aiAnalysis.marketInsights,
      investmentAdvice: aiAnalysis.investmentAdvice,
      alternativeOptions: aiAnalysis.alternativeOptions
    };

  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    throw new Error("Failed to generate investment recommendations. Please try again.");
  }
}

export async function generateInvestmentInsights(
  budget: number,
  goals: string[]
): Promise<{ insights: string; tips: string[] }> {
  try {
    const prompt = `
As an agricultural land investment expert, provide insights for someone with a budget of ₹${budget.toLocaleString()} looking to achieve these goals: ${goals.join(", ")}.

Provide:
1. Market insights relevant to this budget range
2. 5 practical investment tips

Respond in JSON format:
{
  "insights": "detailed market insights and opportunities",
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an agricultural land investment expert. Provide practical, actionable advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6
    });

    return JSON.parse(response.choices[0].message.content!);
  } catch (error) {
    console.error("Error generating investment insights:", error);
    throw new Error("Failed to generate investment insights");
  }
}