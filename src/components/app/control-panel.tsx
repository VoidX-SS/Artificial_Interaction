

"use client";

import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import {
  Bot,
  Play,
  StopCircle,
  RefreshCw,
  Save,
  Upload,
  Settings,
  FileText,
  Languages,
  Palette,
  Clock,
  Users,
  Download,
  KeyRound,
  WandSparkles
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
import { AgentProfileSheet } from './agent-profile-sheet';
import { AgentProfile } from '@/lib/types';
import { Loader } from 'lucide-react';


interface ControlPanelProps {
  topic: string;
  setTopic: Dispatch<SetStateAction<string>>;
  agent1Profile: AgentProfile;
  setAgent1Profile: Dispatch<SetStateAction<AgentProfile>>;
  agent2Profile: AgentProfile;
  setAgent2Profile: Dispatch<SetStateAction<AgentProfile>>;
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
  onSave: () => void;
  onLoad: () => void;
  onSaveProfiles: () => void;
  onLoadProfiles: () => void;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  chatLog: Message[];
  t: I18n;
  leisurelyChat: boolean;
  setLeisurelyChat: Dispatch<SetStateAction<boolean>>;
  deepInteraction: boolean;
  setDeepInteraction: Dispatch<SetStateAction<boolean>>;
  apiKey: string;
  setApiKey: Dispatch<SetStateAction<string>>;
}

export function ControlPanel({
  topic,
  setTopic,
  agent1Profile,
  setAgent1Profile,
  agent2Profile,
  setAgent2Profile,
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
  onSave,
  onLoad,
  onSaveProfiles,
  onLoadProfiles,
  language,
  setLanguage,
  theme,
  setTheme,
  chatLog,
  t,
  leisurelyChat,
  setLeisurelyChat,
  deepInteraction,
  setDeepInteraction,
  apiKey,
  setApiKey
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
            deepInteraction={deepInteraction}
            setDeepInteraction={setDeepInteraction}
            apiKey={apiKey}
            setApiKey={setApiKey}
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
                profile={agent1Profile}
                setProfile={setAgent1Profile}
                isGenerating={isGenerating}
                t={t}
              />
              <AgentCard
                agentNum={2}
                profile={agent2Profile}
                setProfile={setAgent2Profile}
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
                  max={50}
                  step={1}
                  description={t.exchangesDesc}
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
                    <Upload className="h-4 w-4" /> {t.loadSession}
                </Button>
                <Button variant="secondary" onClick={onSave} disabled={isGenerating || !chatLog.length}>
                    <Save className="h-4 w-4" /> {t.saveSession}
                </Button>
            </div>
             <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={onLoadProfiles} disabled={isGenerating}>
                    <Users className="h-4 w-4" /> {t.loadProfiles}
                </Button>
                <Button variant="secondary" onClick={onSaveProfiles} disabled={isGenerating}>
                    <Download className="h-4 w-4" /> {t.saveProfiles}
                </Button>
            </div>
        </div>
      </footer>
    </div>
  );
}

function AgentCard({
    agentNum,
    profile,
    setProfile,
    isGenerating,
    t,
  }: {
    agentNum: 1 | 2;
    profile: AgentProfile;
    setProfile: Dispatch<SetStateAction<AgentProfile>>;
    isGenerating: boolean;
    t: I18n;
  }) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className={agentNum === 1 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" : "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"}>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div>
                  <CardTitle>{profile.soul.basic.persona.name || `${t.agent} ${agentNum}`}</CardTitle>
                  <CardDescription>{t.agentProfileDesc}</CardDescription>
              </div>
            </div>
            <AgentProfileSheet
              agentNum={agentNum}
              profile={profile}
              setProfile={setProfile}
              isGenerating={isGenerating}
              t={t}
            />
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

function SettingsDialog({ language, setLanguage, theme, setTheme, leisurelyChat, setLeisurelyChat, deepInteraction, setDeepInteraction, apiKey, setApiKey, t }: {
    language: Language;
    setLanguage: Dispatch<SetStateAction<Language>>;
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
    leisurelyChat: boolean;
    setLeisurelyChat: Dispatch<SetStateAction<boolean>>;
    deepInteraction: boolean;
    setDeepInteraction: Dispatch<SetStateAction<boolean>>;
    apiKey: string;
    setApiKey: Dispatch<SetStateAction<string>>;
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
                        <Label className="flex items-center gap-2"><KeyRound /> {t.apiKey}</Label>
                        <Input 
                            type="password"
                            placeholder={t.apiKeyPlaceholder}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">{t.apiKeyDesc}</p>
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
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2"><WandSparkles /> {t.deepInteraction}</Label>
                         <div className="flex items-center space-x-2">
                            <Switch
                                id="deep-interaction-mode"
                                checked={deepInteraction}
                                onCheckedChange={setDeepInteraction}
                            />
                            <Label htmlFor="deep-interaction-mode" className="text-sm font-normal text-muted-foreground">
                                {t.deepInteractionDesc}
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

    

    
