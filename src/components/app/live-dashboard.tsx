
"use client";

import { AgentProfile } from "@/lib/types";
import { I18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LiveDashboardProps {
  agent1: AgentProfile;
  agent2: AgentProfile;
  t: I18n;
}

export function LiveDashboard({ agent1, agent2, t }: LiveDashboardProps) {
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
        </div>
      </ScrollArea>
       <footer className="shrink-0 border-t p-4 text-center">
            <p className="text-sm text-muted-foreground">{t.liveDashboardDesc}</p>
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
    const { emotionIndex, matrixConnection } = profile.matrix;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                     <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${agentNum === 1 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'}`}>
                        <Bot className="h-5 w-5" />
                    </div>
                    {profile.soul.basic.persona.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <h4 className="font-semibold">{t.emotionIndex}</h4>
                <ProgressWithLabel label={t.health} value={emotionIndex.health} />
                <ProgressWithLabel label={t.appearance} value={emotionIndex.appearance} />
                <ProgressWithLabel label={t.antipathy} value={emotionIndex.antipathy} />
                <ProgressWithLabel label={t.happinessIndex} value={profile.soul.advanced.socialPosition.happinessIndex} />
                
                <h4 className="font-semibold mt-4">{t.matrixConnection}</h4>
                <ProgressWithLabel label={t.connection} value={matrixConnection.connection} />
                <ProgressWithLabel label={t.trust} value={matrixConnection.trust} />
                <ProgressWithLabel label={t.intimacy} value={matrixConnection.intimacy} />
                <ProgressWithLabel label={t.dependency} value={matrixConnection.dependency} />
            </CardContent>
        </Card>
    )
}

interface ProgressWithLabelProps {
    label: string;
    value: number;
}

function ProgressWithLabel({ label, value }: ProgressWithLabelProps) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span>{value}%</span>
            </div>
            <Progress value={value} />
        </div>
    )
}
