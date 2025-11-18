
"use client";

import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import {
  Bot,
  Play,
  StopCircle,
  RefreshCw,
  Save,
  Upload,
  Sparkles,
  Loader,
  Settings,
  KeyRound,
  FileText,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ControlPanelProps {
  apiKey: string;
  setApiKey: (e: ChangeEvent<HTMLInputElement>) => void;
  topic: string;
  setTopic: Dispatch<SetStateAction<string>>;
  personality1: string;
  setPersonality1: Dispatch<SetStateAction<string>>;
  personality2: string;
  setPersonality2: Dispatch<SetStateAction<string>>;
  temperature: number[];
  setTemperature: Dispatch<SetStateAction<number[]>>;
  maxTokens: number[];
  setMaxTokens: Dispatch<SetStateAction<number[]>>;
  exchanges: number[];
  setExchanges: Dispatch<SetStateAction<number[]>>;
  isGenerating: boolean;
  isStopping: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onGeneratePersonality: (agentNum: 1 | 2) => void;
}

export function ControlPanel({
  apiKey,
  setApiKey,
  topic,
  setTopic,
  personality1,
  setPersonality1,
  personality2,
  setPersonality2,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  exchanges,
  setExchanges,
  isGenerating,
  isStopping,
  onStart,
  onStop,
  onReset,
  onGeneratePersonality,
}: ControlPanelProps) {
  return (
    <div className="flex h-full flex-col border-r bg-card">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <h1 className="text-lg font-semibold">Dualogue Controls</h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Conversation Setup
                </CardTitle>
                <CardDescription>Define the starting point for the AI agents.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic / Starting Prompt</Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., The ethics of artificial intelligence..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={4}
                    disabled={isGenerating}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <AgentCard
                agentNum={1}
                personality={personality1}
                setPersonality={setPersonality1}
                onGeneratePersonality={onGeneratePersonality}
                isGenerating={isGenerating}
              />
              <AgentCard
                agentNum={2}
                personality={personality2}
                setPersonality={setPersonality2}
                onGeneratePersonality={onGeneratePersonality}
                isGenerating={isGenerating}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Model Parameters
                </CardTitle>
                <CardDescription>Fine-tune the behavior of the AI models.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ParameterSlider
                  label="Temperature"
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={1}
                  step={0.1}
                  description="Controls randomness. Lower is more deterministic."
                  disabled={isGenerating}
                />
                <ParameterSlider
                  label="Max Tokens"
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  min={64}
                  max={1024}
                  step={8}
                  description="Maximum length of each AI response."
                  disabled={isGenerating}
                />
                <ParameterSlider
                  label="Exchanges"
                  value={exchanges}
                  onValueChange={setExchanges}
                  min={1}
                  max={10}
                  step={1}
                  description="Number of back-and-forth turns in the conversation."
                  disabled={isGenerating}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" /> API Key
                </CardTitle>
                <CardDescription>Enter your Google AI API key to power the conversation.</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={setApiKey}
                  disabled={isGenerating}
                />
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
      <footer className="shrink-0 border-t p-4">
        <div className="flex w-full flex-col gap-2">
            <div className="flex w-full gap-2">
            {isGenerating ? (
                <Button variant="destructive" className="w-full" onClick={onStop} disabled={isStopping}>
                {isStopping ? <Loader className="animate-spin" /> : <StopCircle />}
                Stop
                </Button>
            ) : (
                <Button className="w-full" onClick={onStart}>
                <Play />
                Start Conversation
                </Button>
            )}
            <Button variant="outline" onClick={onReset} disabled={isGenerating}>
                <RefreshCw />
            </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" disabled>
                    <Upload /> Load
                </Button>
                <Button variant="secondary" disabled>
                    <Save /> Save
                </Button>
            </div>
        </div>
      </footer>
    </div>
  );
}

function AgentCard({
    agentNum,
    personality,
    setPersonality,
    onGeneratePersonality,
    isGenerating
  }: {
    agentNum: 1 | 2;
    personality: string;
    setPersonality: Dispatch<SetStateAction<string>>;
    onGeneratePersonality: (agentNum: 1 | 2) => void;
    isGenerating: boolean;
  }) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className={agentNum === 1 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                <Bot />
              </AvatarFallback>
            </Avatar>
            <div className='w-full'>
                <CardTitle>Agent {agentNum}</CardTitle>
                <CardDescription>Define this agent's personality.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id={`personality-${agentNum}`}
            placeholder={`e.g., A skeptical philosopher...`}
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            rows={4}
            disabled={isGenerating}
          />
          <Button variant="ghost" size="sm" onClick={() => onGeneratePersonality(agentNum)} disabled={isGenerating}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
        </CardContent>
      </Card>
    )
}

function ParameterSlider({
    label,
    value,
    onValueChange,
    description,
    disabled,
    ...props
  }: {
    label: string;
    value: number[];
    onValueChange: (value: number[]) => void;
    description: string;
    disabled: boolean;
  } & React.ComponentProps<typeof Slider>) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <Label>{label}</Label>
                <span className="text-sm text-muted-foreground">{value[0]}</span>
            </div>
            <Slider
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                {...props}
            />
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    )
}
