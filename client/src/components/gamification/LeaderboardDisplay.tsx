import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Crown,
  TrendingUp,
  Calendar,
  Clock,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Leaderboard } from "@shared/schema";

interface LeaderboardDisplayProps {
  className?: string;
}

const periodLabels = {
  daily: "Today",
  weekly: "This Week", 
  monthly: "This Month",
  all_time: "All Time"
};

const getPodiumIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2: return <Trophy className="w-5 h-5 text-gray-400" />;
    case 3: return <Medal className="w-5 h-5 text-amber-600" />;
    default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1: return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
    case 2: return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    case 3: return "text-amber-600 bg-amber-50 dark:bg-amber-900/20";
    default: return "text-muted-foreground bg-muted/20";
  }
};

export function LeaderboardDisplay({ className }: LeaderboardDisplayProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>('weekly');

  // Fetch leaderboard data
  const { data: leaderboard = [], isLoading } = useQuery<Leaderboard[]>({
    queryKey: [`/api/gamification/leaderboard/${selectedPeriod}`],
  });

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-12 h-6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Leaderboard
        </CardTitle>
        
        {/* Period Selection */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
          {Object.entries(periodLabels).map(([period, label]) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(period as any)}
              className="h-7 px-2 text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No activity recorded yet</p>
            <p className="text-xs">Be the first to earn points!</p>
          </div>
        ) : (
          leaderboard.slice(0, 10).map((entry, index) => {
            const rank = index + 1;
            const initials = entry.userEmail
              .split('@')[0]
              .split('.')
              .map(part => part.charAt(0).toUpperCase())
              .join('')
              .slice(0, 2);
            
            return (
              <div
                key={entry.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  rank <= 3 ? getRankColor(rank) : "hover:bg-muted/50"
                )}
              >
                {/* Rank Icon */}
                <div className="flex-shrink-0">
                  {getPodiumIcon(rank)}
                </div>

                {/* User Avatar */}
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {entry.userEmail.split('@')[0].replace(/[._]/g, ' ')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.eventCount} activities
                  </div>
                </div>

                {/* Points Badge */}
                <Badge variant="outline" className="font-mono">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {entry.totalPoints}
                </Badge>
              </div>
            );
          })
        )}

        {/* Period Info */}
        <div className="pt-3 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            {selectedPeriod === 'daily' && <Clock className="w-3 h-3" />}
            {selectedPeriod === 'weekly' && <Calendar className="w-3 h-3" />}
            {selectedPeriod === 'monthly' && <Calendar className="w-3 h-3" />}
            {selectedPeriod === 'all_time' && <TrendingUp className="w-3 h-3" />}
            <span>
              {selectedPeriod === 'all_time' 
                ? 'Overall rankings'
                : `Rankings for ${periodLabels[selectedPeriod].toLowerCase()}`
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}