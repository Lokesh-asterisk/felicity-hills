import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { 
  UserProfile, 
  Achievement, 
  UserAchievement, 
  EngagementStats,
  InsertUserProfile,
  InsertEngagementEvent 
} from "@shared/schema";

interface UseGamificationProps {
  userEmail: string;
}

export function useGamification({ userEmail }: UseGamificationProps) {
  const queryClient = useQueryClient();
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: [`/api/gamification/profile/${userEmail}`],
    enabled: !!userEmail,
  });

  // Fetch user achievements
  const { data: userAchievements = [], isLoading: achievementsLoading } = useQuery<UserAchievement[]>({
    queryKey: [`/api/gamification/achievements/${userEmail}`],
    enabled: !!userEmail,
  });

  // Fetch all available achievements
  const { data: allAchievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/gamification/achievements'],
  });

  // Fetch user engagement stats
  const { data: stats, isLoading: statsLoading } = useQuery<EngagementStats>({
    queryKey: [`/api/gamification/stats/${userEmail}`],
    enabled: !!userEmail,
  });

  // Create or update user profile
  const createProfileMutation = useMutation({
    mutationFn: async (profileData: InsertUserProfile): Promise<UserProfile> => {
      return await apiRequest('/api/gamification/profile', 'POST', profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/gamification/profile/${userEmail}`] });
    },
  });

  // Record engagement event
  const recordEventMutation = useMutation({
    mutationFn: async (eventData: InsertEngagementEvent): Promise<any> => {
      return await apiRequest('/api/gamification/engage', 'POST', eventData);
    },
    onSuccess: (data: any) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/gamification/profile/${userEmail}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/gamification/achievements/${userEmail}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/gamification/stats/${userEmail}`] });
      
      // Check for new achievement
      if (data?.newAchievement) {
        setNewAchievement(data.newAchievement);
      }
    },
  });

  // Initialize user profile if it doesn't exist
  const initializeProfile = useCallback(async (userName: string) => {
    if (!profile && userEmail) {
      try {
        await createProfileMutation.mutateAsync({
          email: userEmail,
          name: userName,
          totalPoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          level: 1,
        });
      } catch (error) {
        console.error('Failed to initialize user profile:', error);
      }
    }
  }, [profile, userEmail, createProfileMutation]);

  // Record an engagement event
  const recordEngagement = useCallback(async (
    eventType: string, 
    eventData: Record<string, any> = {},
    pointsEarned: number = 0
  ) => {
    if (!userEmail) return;

    try {
      await recordEventMutation.mutateAsync({
        userEmail,
        eventType,
        eventData: JSON.stringify(eventData),
        pointsEarned,
        sessionId: null,
        ipAddress: null,
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to record engagement event:', error);
    }
  }, [userEmail, recordEventMutation]);

  // Dismiss achievement notification
  const dismissAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);

  // Helper functions
  const getUserLevel = useCallback((totalPoints: number) => {
    if (totalPoints >= 2500) return { level: 5, name: "Elite Investor", color: "text-yellow-600" };
    if (totalPoints >= 1000) return { level: 4, name: "Expert Investor", color: "text-purple-600" };
    if (totalPoints >= 500) return { level: 3, name: "Rising Investor", color: "text-blue-600" };
    if (totalPoints >= 100) return { level: 2, name: "Active Explorer", color: "text-green-600" };
    return { level: 1, name: "New Visitor", color: "text-gray-600" };
  }, []);

  const getNextLevelProgress = useCallback((totalPoints: number) => {
    const thresholds = [100, 500, 1000, 2500];
    for (const threshold of thresholds) {
      if (totalPoints < threshold) {
        const prevThreshold = thresholds[thresholds.indexOf(threshold) - 1] || 0;
        const progress = ((totalPoints - prevThreshold) / (threshold - prevThreshold)) * 100;
        return { progress: Math.max(0, progress), nextThreshold: threshold };
      }
    }
    return { progress: 100, nextThreshold: null };
  }, []);

  return {
    // Data
    profile,
    userAchievements,
    allAchievements,
    stats,
    newAchievement,
    
    // Loading states
    isLoading: profileLoading || achievementsLoading || statsLoading,
    
    // Actions
    initializeProfile,
    recordEngagement,
    dismissAchievement,
    
    // Utilities
    getUserLevel,
    getNextLevelProgress,
    
    // Computed values
    earnedAchievements: userAchievements.filter(ua => ua.unlockedAt !== null),
    availableAchievements: allAchievements.filter(a => 
      !userAchievements.some(ua => ua.achievementId === a.id && ua.unlockedAt !== null)
    ),
  };
}