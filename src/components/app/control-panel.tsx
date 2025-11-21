
"use client";

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
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
  WandSparkles,
  Heart,
  Archive,
  FileUp,
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
  relationship: string;
  setRelationship: Dispatch<SetStateAction<string>>;
  pronouns: string;
  setPronouns: Dispatch<SetStateAction<string>>;
  agent1Profile: AgentProfile;
  setAgent1Profile: Dispatch<SetStateAction<AgentProfile>>;
  agent2Profile: AgentProfile;
  setAgent2Profile: Dispatch<SetStateAction<AgentProfile>>;
  onMatrixConnectionChange: (newValues: AgentProfile['matrix']['matrixConnection']) => void;
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
  apiKey2: string;
  setApiKey2: Dispatch<SetStateAction<string>>;
}

export function ControlPanel({
  topic,
  setTopic,
  relationship,
  setRelationship,
  pronouns,
  setPronouns,
  agent1Profile,
  setAgent1Profile,
  agent2Profile,
  setAgent2Profile,
  onMatrixConnectionChange,
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
  setApiKey,
  apiKey2,
  setApiKey2,
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
            apiKey2={apiKey2}
            setApiKey2={setApiKey2}
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
              <CardContent className="space-y-4">
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
                 <div className="space-y-2">
                  <Label htmlFor="relationship">{t.relationship}</Label>
                  <Textarea
                    id="relationship"
                    placeholder={t.relationshipPlaceholder}
                    value={relationship}
                    onChange={(e) => {
                        setRelationship(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    rows={1}
                    className="resize-none overflow-hidden"
                    disabled={isGenerating}
                  />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pronouns">{t.pronouns}</Label>
                        <Input
                            id="pronouns"
                            placeholder={t.pronounsPlaceholder}
                            value={pronouns}
                            onChange={(e) => setPronouns(e.target.value)}
                            disabled={isGenerating}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>{t.matrixConnection}</Label>
                        <MatrixConnectionDialog 
                            initialValues={agent1Profile.matrix.matrixConnection} 
                            onSave={onMatrixConnectionChange}
                            t={t}
                        />
                    </div>
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
                 <LoadDialog t={t} onLoad={onLoad} onLoadProfiles={onLoadProfiles} disabled={isGenerating} />
                 <SaveDialog t={t} onSave={onSave} onSaveProfiles={onSaveProfiles} disabled={isGenerating || !chatLog.length} />
            </div>
        </div>
      </footer>
    </div>
  );
}

function SaveDialog({ t, onSave, onSaveProfiles, disabled }: { t: I18n; onSave: () => void; onSaveProfiles: () => void; disabled: boolean; }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full" disabled={disabled}>
            <Archive className="h-4 w-4" /> {t.save}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.saveTitle}</DialogTitle>
          <DialogDescription>
            {t.saveDesc}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
           <Button variant="outline" onClick={() => { onSave(); setOpen(false); }}>
            <FileText className="h-4 w-4" />
            {t.saveSession}
           </Button>
           <Button variant="outline" onClick={() => { onSaveProfiles(); setOpen(false); }}>
            <Users className="h-4 w-4" />
            {t.saveProfiles}
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LoadDialog({ t, onLoad, onLoadProfiles, disabled }: { t: I18n; onLoad: () => void; onLoadProfiles: () => void; disabled: boolean; }) {
    const [open, setOpen] = useState(false);
    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="secondary" className="w-full" disabled={disabled}>
                <FileUp className="h-4 w-4" /> {t.load}
            </Button>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.loadTitle}</DialogTitle>
          <DialogDescription>
            {t.loadDesc}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
           <Button variant="outline" onClick={() => { onLoad(); setOpen(false); }}>
            <FileText className="h-4 w-4" />
            {t.loadSession}
           </Button>
           <Button variant="outline" onClick={() => { onLoadProfiles(); setOpen(false); }}>
            <Users className="h-4 w-4" />
            {t.loadProfiles}
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
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

function SettingsDialog({ language, setLanguage, theme, setTheme, leisurelyChat, setLeisurelyChat, deepInteraction, setDeepInteraction, apiKey, setApiKey, apiKey2, setApiKey2, t }: {
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
    apiKey2: string;
    setApiKey2: Dispatch<SetStateAction<string>>;
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
                <ScrollArea className="max-h-[70vh] pr-6">
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
                            <Label className="flex items-center gap-2"><KeyRound /> {t.apiKey} (Agent 1)</Label>
                            <Input 
                                type="password"
                                placeholder={t.apiKeyPlaceholder}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">{t.apiKeyDesc}</p>
                        </div>
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2"><KeyRound /> {t.apiKey} (Agent 2)</Label>
                            <Input 
                                type="password"
                                placeholder={t.apiKeyPlaceholder}
                                value={apiKey2}
                                onChange={(e) => setApiKey2(e.target.value)}
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
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>{t.done}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


function MatrixConnectionDialog({ initialValues, onSave, t }: {
  initialValues: AgentProfile['matrix']['matrixConnection'];
  onSave: (newValues: AgentProfile['matrix']['matrixConnection']) => void;
  t: I18n;
}) {
  const [connection, setConnection] = useState(initialValues.connection);
  const [trust, setTrust] = useState(initialValues.trust);
  const [intimacy, setIntimacy] = useState(initialValues.intimacy);
  const [dependency, setDependency] = useState(initialValues.dependency);

  useEffect(() => {
    setConnection(initialValues.connection);
    setTrust(initialValues.trust);
    setIntimacy(initialValues.intimacy);
    setDependency(initialValues.dependency);
  }, [initialValues]);

  const handleSave = () => {
    onSave({ connection, trust, intimacy, dependency });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <Heart className="mr-2 h-4 w-4" />
          <span>{t.editMatrixConnection}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.editMatrixConnection}</DialogTitle>
          <DialogDescription>{t.editMatrixConnectionDesc}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <ParameterSlider
            label={t.connection}
            value={[connection]}
            onValueChange={(v) => setConnection(v[0])}
            description={t.connectionDesc}
            disabled={false}
          />
          <ParameterSlider
            label={t.trust}
            value={[trust]}
            onValueChange={(v) => setTrust(v[0])}
            description={t.trustDesc}
            disabled={false}
          />
          <ParameterSlider
            label={t.intimacy}
            value={[intimacy]}
            onValueChange={(v) => setIntimacy(v[0])}
            description={t.intimacyDesc}
            disabled={false}
          />
          <ParameterSlider
            label={t.dependency}
            value={[dependency]}
            onValueChange={(v) => setDependency(v[0])}
            description={t.dependencyDesc}
            disabled={false}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSave}>{t.done}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    