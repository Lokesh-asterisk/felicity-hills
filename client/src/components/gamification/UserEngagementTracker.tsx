import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Award,
  Flame,
  Target,
  Crown,
  Medal,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { UserProfile, Achievement, UserAchievement, EngagementStats } from "@shared/schema";

interface UserEngagementTrackerProps {
  userEmail: string;
  className?: string;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    case 'rare': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
    case 'epic': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
    case 'legendary': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case 'common': return <Medal className="w-4 h-4" />;
    case 'rare': return <Award className="w-4 h-4" />;
    case 'epic': return <Trophy className="w-4 h-4" />;
    case 'legendary': return <Crown className="w-4 h-4" />;
    default: return <Medal className="w-4 h-4" />;
  }
};

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    Star, Trophy, TrendingUp, Award, Flame, Target, Crown, Medal
  };
  const IconComponent = iconMap[iconName] || Star;
  return <IconComponent className="w-5 h-5" />;
};

export function UserEngagementTracker({ userEmail, className }: UserEngagementTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch user profile
  const { data: profile } = useQuery<UserProfile>({
    queryKey: [`/api/gamification/profile/${userEmail}`],
    enabled: !!userEmail,
  });

  // Fetch user achievements
  const { data: userAchievements = [] } = useQuery<UserAchievement[]>({
    queryKey: [`/api/gamification/achievements/${userEmail}`],
    enabled: !!userEmail,
  });

  // Fetch all available achievements
  const { data: allAchievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/gamification/achievements'],
  });

  // Fetch user engagement stats
  const { data: stats } = useQuery<EngagementStats>({
    queryKey: [`/api/gamification/stats/${userEmail}`],
    enabled: !!userEmail,
  });

  if (!profile || !userEmail) {
    return null;
  }

  const getUserLevel = (totalPoints: number) => {
    if (totalPoints >= 2500) return { level: 5, name: "Elite Investor", color: "text-yellow-600" };
    if (totalPoints >= 1000) return { level: 4, name: "Expert Investor", color: "text-purple-600" };
    if (totalPoints >= 500) return { level: 3, name: "Rising Investor", color: "text-blue-600" };
    if (totalPoints >= 100) return { level: 2, name: "Active Explorer", color: "text-green-600" };
    return { level: 1, name: "New Visitor", color: "text-gray-600" };
  };

  const getNextLevelProgress = (totalPoints: number) => {
    const thresholds = [100, 500, 1000, 2500];
    for (const threshold of thresholds) {
      if (totalPoints < threshold) {
        const prevThreshold = thresholds[thresholds.indexOf(threshold) - 1] || 0;
        const progress = ((totalPoints - prevThreshold) / (threshold - prevThreshold)) * 100;
        return { progress: Math.max(0, progress), nextThreshold: threshold };
      }
    }
    return { progress: 100, nextThreshold: null };
  };

  const userLevel = getUserLevel(profile.totalPoints || 0);
  const levelProgress = getNextLevelProgress(profile.totalPoints || 0);
  
  const earnedAchievements = userAchievements.filter(ua => ua.unlockedAt !== null);
  const availableAchievements = allAchievements.filter(a => 
    !userAchievements.some(ua => ua.achievementId === a.id && ua.unlockedAt !== null)
  );

  return (
    <TooltipProvider>
      <Card className={cn("w-full max-w-md mx-auto", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Your Progress</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* User Level and Points */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className={cn("px-3 py-1", userLevel.color)}>
                Level {userLevel.level}
              </Badge>
              <span className={cn("font-medium", userLevel.color)}>
                {userLevel.name}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Total Points</span>
                <span className="font-bold text-primary">{profile.totalPoints}</span>
              </div>
              
              {levelProgress.nextThreshold && (
                <>
                  <Progress value={levelProgress.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{profile.totalPoints} pts</span>
                    <span>{levelProgress.nextThreshold} pts</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">{earnedAchievements.length}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">{profile.currentStreak || 0}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">{stats?.totalEvents || 0}</div>
              <div className="text-xs text-muted-foreground">Activities</div>
            </div>
          </div>

          {/* Recent Achievement */}
          {earnedAchievements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Latest Achievement</h4>
              {(() => {
                const latest = earnedAchievements[earnedAchievements.length - 1];
                const achievement = allAchievements.find(a => a.id === latest.achievementId);
                if (!achievement) return null;
                
                return (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                    <div className={cn("p-1 rounded", getRarityColor(achievement.rarity))}>
                      {getRarityIcon(achievement.rarity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-4 pt-2 border-t">
              {/* All Earned Achievements */}
              {earnedAchievements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Earned Achievements</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {earnedAchievements.slice().reverse().map((userAchievement) => {
                      const achievement = allAchievements.find(a => a.id === userAchievement.achievementId);
                      if (!achievement) return null;
                      
                      return (
                        <Tooltip key={userAchievement.id}>
                          <TooltipTrigger asChild>
                            <div className={cn(
                              "flex items-center gap-2 p-2 rounded-lg cursor-pointer",
                              getRarityColor(achievement.rarity)
                            )}>
                              {getIconComponent(achievement.icon)}
                              <span className="text-xs font-medium truncate">
                                {achievement.name}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-center">
                              <div className="font-medium">{achievement.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {achievement.description}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Earned: {new Date(userAchievement.unlockedAt!).toLocaleDateString()}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Available Achievements */}
              {availableAchievements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Available Achievements</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableAchievements.slice(0, 6).map((achievement) => (
                      <Tooltip key={achievement.id}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 opacity-60">
                            {getIconComponent(achievement.icon)}
                            <span className="text-xs font-medium truncate">
                              {achievement.name}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <div className="font-medium">{achievement.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {achievement.description}
                            </div>
                            {achievement.pointsRequired && achievement.pointsRequired > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Requires: {achievement.pointsRequired} points
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}