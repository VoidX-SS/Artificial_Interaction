
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
  Pencil,
  Languages,
  Palette,
  Clock,
} from 'lucide-react';

import type { Theme, Message } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { i18n, Language, type I18n } from '@/lib/i18n';
import { Switch } from '@/components/ui/switch';

interface ControlPanelProps {
  apiKey: string;
  setApiKey: (e: ChangeEvent<HTMLInputElement>) => void;
  topic: string;
  setTopic: Dispatch<SetStateAction<string>>;
  agent1Name: string;
  setAgent1Name: Dispatch<SetStateAction<string>>;
  agent2Name: string;
  setAgent2Name: Dispatch<SetStateAction<string>>;
  personality1: string;
  setPersonality1: Dispatch<SetStateAction<string>>;
  personality2: string;
  setPersonality2: Dispatch<SetStateAction<string>>;
  temperature: number[];
  setTemperature: Dispatch<SetStateAction<number[]>>;
  maxWords: number[];
  setMaxWords: Dispatch<SetStateAction<number[]>>;
  exchanges: number[];
  setExchanges: Dispatch<SetStateAction<number[]>>;
  isGenerating: boolean;
  isStopping: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onGeneratePersonality: (agentNum: 1 | 2) => void;
  onSave: () => void;
  onLoad: () => void;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  chatLog: Message[];
  t: I18n;
  leisurelyChat: boolean;
  setLeisurelyChat: Dispatch<SetStateAction<boolean>>;
}

export function ControlPanel({
  apiKey,
  setApiKey,
  topic,
  setTopic,
  agent1Name,
  setAgent1Name,
  agent2Name,
  setAgent2Name,
  personality1,
  setPersonality1,
  personality2,
  setPersonality2,
  temperature,
  setTemperature,
  maxWords,
  setMaxWords,
  exchanges,
  setExchanges,
  isGenerating,
  isStopping,
  onStart,
  onStop,
  onReset,
  onGeneratePersonality,
  onSave,
  onLoad,
  language,
  setLanguage,
  theme,
  setTheme,
  chatLog,
  t,
  leisurelyChat,
  setLeisurelyChat,
}: ControlPanelProps) {
  return (
    <div className="flex h-screen flex-col border-r bg-card">
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <h1 className="text-lg font-semibold">{t.controls}</h1>
        <SettingsDialog 
            language={language}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
            leisurelyChat={leisurelyChat}
            setLeisurelyChat={setLeisurelyChat}
            t={t}
        />
      </header>
      <ScrollArea className="flex-1">
          <div className="flex flex-col gap-6 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> {t.conversationSetup}
                </CardTitle>
                <CardDescription>{t.conversationSetupDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="topic">{t.topic}</Label>
                  <Textarea
                    id="topic"
                    placeholder={t.topicPlaceholder}
                    value={topic}
                    onChange={(e) => {
                        setTopic(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    rows={1}
                    className="resize-none overflow-hidden"
                    disabled={isGenerating}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <AgentCard
                agentNum={1}
                name={agent1Name}
                setName={setAgent1Name}
                personality={personality1}
                setPersonality={setPersonality1}
                onGeneratePersonality={onGeneratePersonality}
                isGenerating={isGenerating}
                t={t}
              />
              <AgentCard
                agentNum={2}
                name={agent2Name}
                setName={setAgent2Name}
                personality={personality2}
                setPersonality={setPersonality2}
                onGeneratePersonality={onGeneratePersonality}
                isGenerating={isGenerating}
                t={t}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> {t.modelParameters}
                </CardTitle>
                <CardDescription>{t.modelParametersDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ParameterSlider
                  label={t.temperature}
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={2}
                  step={0.1}
                  description={t.temperatureDesc}
                  disabled={isGenerating}
                />
                <ParameterSlider
                  label={t.maxWords}
                  value={maxWords}
                  onValueChange={setMaxWords}
                  min={10}
                  max={2000}
                  step={10}
                  description={t.maxWordsDesc}
                  disabled={isGenerating}
                />
                <ParameterSlider
                  label={t.exchanges}
                  value={exchanges}
                  onValueChange={setExchanges}
                  min={1}
                  max={100}
                  step={1}
                  description={t.exchangesDesc}
                  disabled={isGenerating}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" /> {t.apiKey}
                </CardTitle>
                <CardDescription>{t.apiKeyDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  id="api-key"
                  type="password"
                  placeholder={t.apiKeyPlaceholder}
                  value={apiKey}
                  onChange={setApiKey}
                  disabled={isGenerating}
                />
              </CardContent>
            </Card>
          </div>
      </ScrollArea>
      <footer className="shrink-0 border-t p-4">
        <div className="flex w-full flex-col gap-2">
            <div className="flex w-full gap-2">
            {isGenerating ? (
                <Button variant="destructive" className="w-full" onClick={onStop} disabled={isStopping}>
                {isStopping ? <Loader className="animate-spin" /> : <StopCircle />}
                {t.stop}
                </Button>
            ) : (
                <Button className="w-full" onClick={onStart}>
                <Play />
                {chatLog.length > 0 ? t.continueConversation : t.startConversation}
                </Button>
            )}
            <Button variant="outline" onClick={onReset} disabled={isGenerating}>
                <RefreshCw />
            </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={onLoad} disabled={isGenerating}>
                    <Upload /> {t.load}
                </Button>
                <Button variant="secondary" onClick={onSave} disabled={isGenerating || !chatLog.length}>
                    <Save /> {t.save}
                </Button>
            </div>
        </div>
      </footer>
    </div>
  );
}

function AgentCard({
    agentNum,
    name,
    setName,
    personality,
    setPersonality,
    onGeneratePersonality,
    isGenerating,
    t,
  }: {
    agentNum: 1 | 2;
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    personality: string;
    setPersonality: Dispatch<SetStateAction<string>>;
    onGeneratePersonality: (agentNum: 1 | 2) => void;
    isGenerating: boolean;
    t: I18n;
  }) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className={agentNum === 1 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div>
                  <CardTitle>{name}</CardTitle>
                  <CardDescription>{t.agentPersonalityDesc}</CardDescription>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isGenerating}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t.editAgent} {agentNum}</DialogTitle>
                  <DialogDescription>
                    {t.editAgentDesc}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${agentNum}`}>{t.agentName}</Label>
                    <Input
                      id={`name-${agentNum}`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`personality-${agentNum}`}>{t.personality}</Label>
                    <Textarea
                      id={`personality-${agentNum}`}
                      placeholder={t.personalityPlaceholder}
                      value={personality}
                      onChange={(e) => {
                          setPersonality(e.target.value);
                      }}
                      rows={8}
                      disabled={isGenerating}
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onGeneratePersonality(agentNum)} disabled={isGenerating}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t.generatePersonality}
                  </Button>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>{t.done}</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
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

function SettingsDialog({ language, setLanguage, theme, setTheme, leisurelyChat, setLeisurelyChat, t }: {
    language: Language;
    setLanguage: Dispatch<SetStateAction<Language>>;
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
    leisurelyChat: boolean;
    setLeisurelyChat: Dispatch<SetStateAction<boolean>>;
    t: I18n;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t.settings}</DialogTitle>
                    <DialogDescription>
                        {t.settingsDesc}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2"><Languages/> {t.language}</Label>
                       <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vi">Tiếng Việt</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2"><Palette/> {t.theme}</Label>
                        <RadioGroup value={theme} onValueChange={(value: string) => setTheme(value as Theme)} className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <Label htmlFor="light">{t.light}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="dark" id="dark" />
                                <Label htmlFor="dark">{t.dark}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="system" id="system" />
                                <Label htmlFor="system">{t.system}</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2"><Clock /> {t.leisurelyChat}</Label>
                         <div className="flex items-center space-x-2">
                            <Switch
                                id="leisurely-mode"
                                checked={leisurelyChat}
                                onCheckedChange={setLeisurelyChat}
                            />
                            <Label htmlFor="leisurely-mode" className="text-sm font-normal text-muted-foreground">
                                {t.leisurelyChatDesc}
                            </Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>{t.done}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

    