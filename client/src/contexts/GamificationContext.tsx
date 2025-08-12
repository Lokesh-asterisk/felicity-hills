import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGamification } from "@/hooks/useGamification";
import { AchievementNotification } from "@/components/gamification";
import type { Achievement } from "@shared/schema";

interface GamificationContextType {
  userEmail: string | null;
  userName: string | null;
  setUser: (email: string, name: string) => void;
  recordActivity: (eventType: string, eventData?: Record<string, any>, points?: number) => Promise<void>;
  showAchievement: (achievement: Achievement) => void;
  isEnabled: boolean;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export function useGamificationContext() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
}

interface GamificationProviderProps {
  children: ReactNode;
}

export function GamificationProvider({ children }: GamificationProviderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [customAchievement, setCustomAchievement] = useState<Achievement | null>(null);

  const gamification = useGamification({ 
    userEmail: userEmail || '' 
  });

  // Initialize user profile when user is set
  useEffect(() => {
    if (userEmail && userName) {
      gamification.initializeProfile(userName);
    }
  }, [userEmail, userName, gamification]);

  const setUser = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
  };

  const recordActivity = async (
    eventType: string, 
    eventData: Record<string, any> = {},
    points: number = 0
  ) => {
    if (!userEmail) return;
    
    try {
      await gamification.recordEngagement(eventType, eventData, points);
    } catch (error) {
      console.error('Failed to record gamification activity:', error);
    }
  };

  const showAchievement = (achievement: Achievement) => {
    setCustomAchievement(achievement);
  };

  const dismissAchievement = () => {
    setCustomAchievement(null);
    gamification.dismissAchievement();
  };

  const contextValue: GamificationContextType = {
    userEmail,
    userName,
    setUser,
    recordActivity,
    showAchievement,
    isEnabled: !!userEmail,
  };

  return (
    <GamificationContext.Provider value={contextValue}>
      {children}
      
      {/* Achievement Notifications */}
      <AchievementNotification 
        achievement={customAchievement || gamification.newAchievement}
        onDismiss={dismissAchievement}
      />
    </GamificationContext.Provider>
  );
}