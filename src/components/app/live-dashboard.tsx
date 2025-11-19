
"use client";

import { useState, useEffect } from "react";
import { AgentProfile } from "@/lib/types";
import { I18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Heart, Loader, StopCircle, Zap, BrainCircuit, Smile, Angry } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LiveDashboardProps {
  agent1: AgentProfile;
  agent2: AgentProfile;
  t: I18n;
  onStop: () => void;
  isStopping: boolean;
}

export function LiveDashboard({ agent1, agent2, t, onStop, isStopping }: LiveDashboardProps) {
  const avgConnection = (agent1.matrix.matrixConnection.connection + agent2.matrix.matrixConnection.connection) / 2;
  const avgTrust = (agent1.matrix.matrixConnection.trust + agent2.matrix.matrixConnection.trust) / 2;
  const avgIntimacy = (agent1.matrix.matrixConnection.intimacy + agent2.matrix.matrixConnection.intimacy) / 2;
  const avgDependency = (agent1.matrix.matrixConnection.dependency + agent2.matrix.matrixConnection.dependency) / 2;

  return (
    <div className="flex h-screen flex-col border-r bg-card">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 animate-pulse text-yellow-500"/>
          {t.liveDashboard}
        </h1>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
            <AgentMatrixDisplay agentNum={1} profile={agent1} t={t} />
            <AgentMatrixDisplay agentNum={2} profile={agent2} t={t} />
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300">
                          <Heart className="h-5 w-5" />
                      </div>
                      {t.matrixConnection}
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <ProgressWithLabel label={t.connection} value={avgConnection} />
                  <ProgressWithLabel label={t.trust} value={avgTrust} />
                  <ProgressWithLabel label={t.intimacy} value={avgIntimacy} />
                  <ProgressWithLabel label={t.dependency} value={avgDependency} />
              </CardContent>
            </Card>
        </div>
      </ScrollArea>
       <footer className="shrink-0 border-t p-4">
            <Button variant="destructive" className="w-full" onClick={onStop} disabled={isStopping}>
              {isStopping ? <Loader className="animate-spin" /> : <StopCircle />}
              {t.stopConversation}
            </Button>
      </footer>
    </div>
  );
}

interface AgentMatrixDisplayProps {
    agentNum: 1 | 2;
    profile: AgentProfile;
    t: I18n;
}

function AgentMatrixDisplay({ agentNum, profile, t }: AgentMatrixDisplayProps) {
    const { emotionIndex } = profile.matrix;
    const { happinessIndex } = profile.soul.advanced.socialPosition;
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setIsUpdating(true);
        const timer = setTimeout(() => setIsUpdating(false), 750); // Duration of the blink animation
        return () => clearTimeout(timer);
    }, [profile.matrix]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                     <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${agentNum === 1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'}`}>
                        <Bot className="h-5 w-5" />
                    </div>
                    {profile.soul.basic.persona.name}
                    <div className={cn(
                        "h-3 w-3 rounded-full bg-green-500 transition-all",
                        isUpdating && "animate-blink"
                    )}></div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <h4 className="font-semibold">{t.emotionIndex}</h4>
                <ProgressWithLabel label={t.health} value={emotionIndex.health} />
                <ProgressWithLabel label={t.appearance} value={emotionIndex.appearance} />
                <ProgressWithLabel label={t.iq} value={emotionIndex.iq} max={200}/>
                <ProgressWithLabel label={t.eq} value={emotionIndex.eq} max={200}/>
                <ProgressWithLabel label={t.happinessIndex} value={happinessIndex} />
                <ProgressWithLabel label={t.antipathy} value={emotionIndex.antipathy} />
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.nextIntention}</span>
                  </div>
                  <p className="text-sm font-medium p-2 bg-muted rounded-md h-10 flex items-center">
                    {emotionIndex.nextIntention || "..."}
                  </p>
                </div>
            </CardContent>
        </Card>
    )
}

interface ProgressWithLabelProps {
    label: string;
    value: number;
    max?: number;
}

function ProgressWithLabel({ label, value, max = 100 }: ProgressWithLabelProps) {
    const percentage = max === 100 ? value : Math.round((value / max) * 100);
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span>{value}</span>
            </div>
            <Progress value={percentage} />
        </div>
    )
}

    