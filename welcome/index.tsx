
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Camera, Video, ArrowRight, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-sm font-medium text-primary">Powered by AI</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent animate-fade-up">
            Transform Your Media with AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up animation-delay-100">
            Compress videos and resize images instantly using advanced AI technology. 
            Save space without compromising quality.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up animation-delay-200">
            <Button size="lg" className="rounded-full gap-2">
              Start Processing <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI algorithms help you optimize your media files while maintaining quality.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6 p-3 rounded-full bg-primary/10 inline-block">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Video Compression</h3>
                <p className="text-muted-foreground mb-6">
                  Compress your videos without losing quality using our advanced AI algorithms. Save storage space and bandwidth.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Reduce file size up to 80%</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Maintain original visual quality</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Super fast processing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-muted/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="mb-6 p-3 rounded-full bg-primary/10 inline-block">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Smart Image Resizing</h3>
                <p className="text-muted-foreground mb-6">
                  Resize your images to any aspect ratio while preserving the important content using AI-powered cropping.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Intelligent content-aware scaling</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Multiple aspect ratios support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>Batch processing capability</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

       {/* Stats Section */}
       <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-4xl font-bold text-primary mb-2">2.5M+</h3>
              <p className="text-muted-foreground">Files Processed</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-primary mb-2">95%</h3>
              <p className="text-muted-foreground">Compression Rate</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold text-primary mb-2">10TB+</h3>
              <p className="text-muted-foreground">Storage Saved</p>
            </div>
          </div>
        </div>
      </section>

       {/* CTA Section */}
       <section className="py-20 px-4 bg-primary/5 rounded-3xl mx-4 my-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to optimize your media?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of users who are already saving storage space and improving their media workflow.
          </p>
          <Button size="lg" className="rounded-full">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">CloudAI</h2>
            </div>
            <p className="text-muted-foreground">&copy; 2025 CloudAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
