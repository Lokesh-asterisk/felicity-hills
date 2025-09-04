import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  // Set page title for SEO
  useEffect(() => {
    document.title = "Page Not Found - Khushalipur | Felicity Hills";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'The page you are looking for could not be found. Return to Khushalipur homepage to explore our premium agricultural land investment opportunities.');
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 mb-6">
            The page you are looking for could not be found. It may have been moved or deleted.
          </p>
          
          <div className="flex justify-center">
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Return to Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
