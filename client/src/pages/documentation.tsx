import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-8">Documentation</h1>
          
          <div className="bg-muted/30 rounded-lg p-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Coming Soon</h2>
            <p className="text-xl text-muted-foreground mb-8">
              We're working on comprehensive documentation to help you get the most out of TextBlaster.
            </p>
            <p className="text-muted-foreground mb-8">
              In the meantime, if you have questions or need help getting started, please don't hesitate to contact our support team.
            </p>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                <strong>Email Support:</strong>{' '}
                <a href="mailto:support@textblaster.com" className="text-primary hover:underline">
                  support@textblaster.com
                </a>
              </p>
              <p className="text-muted-foreground">
                <strong>Sales Inquiries:</strong>{' '}
                <a href="mailto:sales@textblaster.com" className="text-primary hover:underline">
                  sales@textblaster.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}