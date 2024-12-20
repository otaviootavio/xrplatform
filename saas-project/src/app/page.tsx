import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Feature {
  title: string;
  description:
    string;
  icon: string;
}

export default function Home() {
  const features: Feature[] = [
    {
      title: "Reliable Infrastructure",
      description:
        "Our nodes are built on robust infrastructure to ensure 99.9% uptime.",
      icon: "/Infrastructure.svg",
    },
    {
      title: "Scalable Solutions",
      description: "From startups to enterprises, we scale with your needs.",
      icon: "/Scalable.svg",
    },
    {
      title: "Secure & Private",
      description:
        "Advanced encryption and data protection to keep your information safe.",
      icon: "/security.svg",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="relative w-full text-center min-h-[70vh] py-8 md:py-16 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_50%,_var(--tw-gradient-stops))] from-primary/15 via-primary/5 to-background opacity-100 mix-blend-normal flex flex-col justify-center dark:bg-[radial-gradient(60%_60%_at_50%_50%,_var(--tw-gradient-stops))] dark:from-primary/10 dark:via-background/90">
            <div className="relative z-10 max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6">
                Deploy <span className="text-primary">XRP Nodes</span> Easily
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8">
                Run XRP nodes in one click.
                <br className="hidden md:block" />
                We provide scalable rippled nodes on cloud.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                >
                  <Link href="/node">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full md:w-auto hover:bg-primary/5"
                >
                  <Link href="#learn-more">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-16 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group border border-primary/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="mb-4">
                      <div
                        className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center
                        group-hover:bg-primary/20 transition-colors duration-200"
                      >
                        <div className="w-12 h-12">
                          <div className="w-full h-full relative dark:invert dark:brightness-100 transition-all duration-200">
                            <Image
                              src={feature.icon}
                              alt={feature.title}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-center">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
