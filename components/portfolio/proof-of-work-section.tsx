"use client";

import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Card, CardContent } from '@/components/ui/card';
import SectionBorder from './section-border';

interface ProofOfWorkSectionProps {
  username: string;
}

export function ProofOfWorkSection({ username }: ProofOfWorkSectionProps) {
  const [mounted, setMounted] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    setMounted(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const theme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  };

  const isMobile = dimensions.width < 640;
  const isTablet = dimensions.width >= 640 && dimensions.width < 1024;

  const blockSize = isMobile ? 11 : isTablet ? 14 : 16;
  const blockMargin = isMobile ? 2 : isTablet ? 4 : 5;
  const fontSize = isMobile ? 10 : isTablet ? 12 : 13;

  if (!mounted) {
    return (
      <section className="relative w-full py-8 sm:py-12 md:py-16">
        <SectionBorder className="absolute bottom-0 left-0 right-0" />
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h2 className="font-bold text-2xl md:text-4xl tracking-tight text-foreground">
              Contributions
            </h2>
            <p className="text-muted-foreground mt-1 mb-4">
              Activity over the past year
            </p>
          </div>
          <Card className="border-border">
            <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] bg-muted/50 animate-pulse rounded-md" />
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full py-8 sm:py-12 md:py-16">
      <SectionBorder className="absolute bottom-0 left-0 right-0" />
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="font-bold text-2xl md:text-4xl tracking-tight text-foreground">
            Contributions
          </h2>
          <p className="text-muted-foreground mt-1 mb-4">
            Activity over the past year
          </p>
        </div>

        <Card className="border-border">
          <CardContent className="p-3 sm:p-6 md:p-8 lg:p-10 xl:p-12">
            <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className={`${isMobile ? "min-w-[600px]" : "w-full"} flex justify-center`}>
                <GitHubCalendar
                  username={username}
                  fontSize={fontSize}
                  blockSize={blockSize}
                  blockMargin={blockMargin}
                  showWeekdayLabels={!isMobile}
                  colorScheme="light"
                  theme={{
                    light: theme.light,
                    dark: theme.dark,
                  }}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

