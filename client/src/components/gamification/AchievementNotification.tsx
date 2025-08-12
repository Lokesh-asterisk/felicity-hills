import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Crown, Medal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement } from "@shared/schema";

interface AchievementNotificationProps {
  achievement: Achievement | null;
  pointsEarned?: number;
  onDismiss: () => void;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'from-gray-400 to-gray-600';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-yellow-400 to-yellow-600';
    default: return 'from-gray-400 to-gray-600';
  }
};

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case 'common': return <Medal className="w-6 h-6" />;
    case 'rare': return <Award className="w-6 h-6" />;
    case 'epic': return <Trophy className="w-6 h-6" />;
    case 'legendary': return <Crown className="w-6 h-6" />;
    default: return <Medal className="w-6 h-6" />;
  }
};

export function AchievementNotification({ 
  achievement, 
  pointsEarned = 0, 
  onDismiss 
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for animation to complete
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25 
          }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <Card className="p-4 shadow-lg border-2 border-primary/20 bg-gradient-to-r from-background to-background/95 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              {/* Achievement Icon with Glow */}
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={cn(
                  "p-2 rounded-full bg-gradient-to-br text-white shadow-lg",
                  getRarityColor(achievement.rarity)
                )}
              >
                {getRarityIcon(achievement.rarity)}
              </motion.div>

              {/* Achievement Content */}
              <div className="flex-1 space-y-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <h3 className="font-bold text-sm">Achievement Unlocked!</h3>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs capitalize",
                      achievement.rarity === 'legendary' && "text-yellow-600 border-yellow-300",
                      achievement.rarity === 'epic' && "text-purple-600 border-purple-300",
                      achievement.rarity === 'rare' && "text-blue-600 border-blue-300",
                      achievement.rarity === 'common' && "text-gray-600 border-gray-300"
                    )}
                  >
                    {achievement.rarity}
                  </Badge>
                </motion.div>
                
                <motion.h4
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-semibold text-primary"
                >
                  {achievement.name}
                </motion.h4>
                
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-muted-foreground"
                >
                  {achievement.description}
                </motion.p>

                {pointsEarned > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-1 text-xs text-primary font-medium"
                  >
                    <Star className="w-3 h-3 fill-current" />
                    +{pointsEarned} points
                  </motion.div>
                )}
              </div>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Celebration Particles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1,
                    scale: 0,
                    x: "50%",
                    y: "50%"
                  }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </motion.div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}