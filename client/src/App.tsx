import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import ProjectShowcase from "@/pages/project-showcase";
import Videos from "@/pages/videos";
import Brochures from "@/pages/brochures";
import BookVisit from "@/pages/book-visit";
import AdminDashboard from "@/pages/admin-dashboard";

// Hook to scroll to top on route change
function useScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
}

function Router() {
  useScrollToTop();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/project-showcase" component={ProjectShowcase} />
      <Route path="/videos" component={Videos} />
      <Route path="/brochures" component={Brochures} />
      <Route path="/book-visit" component={BookVisit} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
