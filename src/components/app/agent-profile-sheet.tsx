
"use client";

import { Dispatch, SetStateAction } from "react";
import { AgentProfile, AgentSoul, AgentMatrix } from "@/lib/types";
import { I18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Pencil, Sparkles } from "lucide-react";

interface AgentProfileSheetProps {
  agentNum: 1 | 2;
  profile: AgentProfile;
  setProfile: Dispatch<SetStateAction<AgentProfile>>;
  onGeneratePersonality: (agentNum: 1 | 2) => void;
  isGenerating: boolean;
  t: I18n;
}

export function AgentProfileSheet({
  agentNum,
  profile,
  setProfile,
  onGeneratePersonality,
  isGenerating,
  t,
}: AgentProfileSheetProps) {

  const handleSoulChange = <T extends keyof AgentSoul, U extends keyof AgentSoul[T]>(
    category: T,
    subCategory: U,
    field: keyof AgentSoul[T][U],
    value: any
  ) => {
    setProfile(prev => {
      const newSoul = { ...prev.soul };
      (newSoul[category][subCategory] as any)[field] = value;
      return { ...prev, soul: newSoul };
    });
  };

  const handleSimpleSoulChange = <T extends keyof AgentSoul, U extends keyof AgentSoul[T]>(
    category: T,
    field: U,
    value: AgentSoul[T][U]
  ) => {
     setProfile(prev => ({
      ...prev,
      soul: {
        ...prev.soul,
        [category]: {
          ...prev.soul[category],
          [field]: value
        }
      }
    }));
  }

  const handleSoulAdvancedChange = (field: keyof AgentSoul['advanced'], value: string | number) => {
     setProfile(prev => ({
      ...prev,
      soul: {
        ...prev.soul,
        advanced: {
          ...prev.soul.advanced,
          [field]: value
        }
      }
    }));
  }

  const handleMatrixChange = <T extends keyof AgentMatrix, U extends keyof AgentMatrix[T]>(
    category: T,
    field: U,
    value: AgentMatrix[T][U]
  ) => {
    setProfile(prev => ({
      ...prev,
      matrix: {
        ...prev.matrix,
        [category]: {
          ...prev.matrix[category],
          [field]: value
        }
      }
    }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isGenerating}>
          <Pencil className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>{t.editAgent} {agentNum}: {profile.soul.basic.persona.name}</SheetTitle>
          <SheetDescription>{t.editAgentDesc}</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="soul" className="mt-4 flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="soul">{t.agentSoul}</TabsTrigger>
            <TabsTrigger value="matrix">{t.agentMatrix}</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-1 mt-4 pr-4">
            <TabsContent value="soul" className="py-4">
              <div className="space-y-6">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 font-semibold">
                    {t.basic}
                    <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4 border border-t-0 rounded-b-md">
                    <h4 className="font-semibold">{t.persona}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <InputWithLabel label={t.agentName} value={profile.soul.basic.persona.name} onChange={e => handleSoulChange('basic', 'persona', 'name', e.target.value)} disabled={isGenerating} />
                      <InputWithLabel label={t.age} type="number" value={profile.soul.basic.persona.age} onChange={e => handleSoulChange('basic', 'persona', 'age', parseInt(e.target.value) || 0)} disabled={isGenerating} />
                      <InputWithLabel label={t.nationality} value={profile.soul.basic.persona.nationality} onChange={e => handleSoulChange('basic', 'persona', 'nationality', e.target.value)} disabled={isGenerating} />
                      <InputWithLabel label={t.location} value={profile.soul.basic.persona.location} onChange={e => handleSoulChange('basic', 'persona', 'location', e.target.value)} disabled={isGenerating} />
                    </div>
                    <SliderWithLabel label={t.curiosityIndex} value={[profile.soul.basic.curiosityIndex]} onValueChange={v => handleSimpleSoulChange('basic', 'curiosityIndex', v[0])} disabled={isGenerating} />
                    <div className="space-y-2">
                        <Label>{t.summaryDiary}</Label>
                        <Textarea placeholder={t.personalityPlaceholder} value={profile.soul.basic.summaryDiary} onChange={e => handleSimpleSoulChange('basic', 'summaryDiary', e.target.value)} rows={8} disabled={isGenerating}/>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onGeneratePersonality(agentNum)} disabled={isGenerating}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t.generatePersonality}
                    </Button>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 font-semibold">
                    {t.advanced}
                    <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4 border border-t-0 rounded-b-md">
                     <h4 className="font-semibold">{t.socialPosition}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <InputWithLabel label={t.job} value={profile.soul.advanced.socialPosition.job} onChange={e => handleSoulChange('advanced', 'socialPosition', 'job', e.target.value)} disabled={isGenerating} />
                        <InputWithLabel label={t.financialStatus} value={profile.soul.advanced.socialPosition.financialStatus} onChange={e => handleSoulChange('advanced', 'socialPosition', 'financialStatus', e.target.value)} disabled={isGenerating} />
                      </div>
                      <SliderWithLabel label={t.qualityOfLife} value={[profile.soul.advanced.socialPosition.qualityOfLife]} onValueChange={v => handleSoulChange('advanced', 'socialPosition', 'qualityOfLife', v[0])} disabled={isGenerating} />
                      <SliderWithLabel label={t.happinessIndex} value={[profile.soul.advanced.socialPosition.happinessIndex]} onValueChange={v => handleSoulChange('advanced', 'socialPosition', 'happinessIndex', v[0])} disabled={isGenerating} />
                     <div className="space-y-2">
                        <Label>{t.relationships}</Label>
                        <Textarea value={profile.soul.advanced.relationships} onChange={e => handleSoulAdvancedChange('relationships', e.target.value)} disabled={isGenerating}/>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>

            <TabsContent value="matrix" className="py-4">
               <div className="space-y-6">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 font-semibold">
                    {t.emotionIndex}
                    <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4 border border-t-0 rounded-b-md">
                    <SliderWithLabel label={t.health} value={[profile.matrix.emotionIndex.health]} onValueChange={v => handleMatrixChange('emotionIndex', 'health', v[0])} disabled={isGenerating} />
                    <SliderWithLabel label={t.appearance} value={[profile.matrix.emotionIndex.appearance]} onValueChange={v => handleMatrixChange('emotionIndex', 'appearance', v[0])} disabled={isGenerating} />
                    <SliderWithLabel label={t.iq} max={200} value={[profile.matrix.emotionIndex.iq]} onValueChange={v => handleMatrixChange('emotionIndex', 'iq', v[0])} disabled={isGenerating} />
                    <SliderWithLabel label={t.eq} max={200} value={[profile.matrix.emotionIndex.eq]} onValueChange={v => handleMatrixChange('emotionIndex', 'eq', v[0])} disabled={isGenerating} />
                    <SliderWithLabel label={t.antipathy} value={[profile.matrix.emotionIndex.antipathy]} onValueChange={v => handleMatrixChange('emotionIndex', 'antipathy', v[0])} disabled={isGenerating} />
                    <InputWithLabel label={t.nextIntention} value={profile.matrix.emotionIndex.nextIntention} onChange={e => handleMatrixChange('emotionIndex', 'nextIntention', e.target.value)} disabled={isGenerating} />
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 font-semibold">
                    {t.matrixConnection}
                    <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4 border border-t-0 rounded-b-md">
                    <SliderWithLabel label={t.connection} value={[profile.matrix.matrixConnection.connection]} onValueChange={v => handleMatrixChange('matrixConnection', 'connection', v[0])} disabled={isGenerating} />
                    <SliderWithLabel label={t.trust} value={[profile.matrix.matrixConnection.trust]} onValueChange={v => handleMatrixChange('matrixConnection', 'trust', v[0])} disabled={isGenerating} />
                    <SliderWithLabel label={t.intimacy} value={[profile.matrix.matrixConnection.intimacy]} onValueChange={v => handleMatrixChange('matrixConnection', 'intimacy', v[0])} disabled={isGenerating} />
                    <SliderWithLabel label={t.dependency} value={[profile.matrix.matrixConnection.dependency]} onValueChange={v => handleMatrixChange('matrixConnection', 'dependency', v[0])} disabled={isGenerating} />
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 font-semibold">
                     {t.matrixFavor}
                    <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4 border border-t-0 rounded-b-md">
                     <div className="grid grid-cols-2 gap-4">
                        <InputWithLabel label={t.dob} value={profile.matrix.matrixFavor.dob} onChange={e => handleMatrixChange('matrixFavor', 'dob', e.target.value)} disabled={isGenerating} />
                        <InputWithLabel label={t.zodiac} value={profile.matrix.matrixFavor.zodiac} onChange={e => handleMatrixChange('matrixFavor', 'zodiac', e.target.value)} disabled={isGenerating} />
                     </div>
                     <InputWithLabel label={t.personalityType} value={profile.matrix.matrixFavor.personalityType} onChange={e => handleMatrixChange('matrixFavor', 'personalityType', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.thinkingStyle} value={profile.matrix.matrixFavor.thinkingStyle} onChange={e => handleMatrixChange('matrixFavor', 'thinkingStyle', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.strengths} value={profile.matrix.matrixFavor.strengths} onChange={e => handleMatrixChange('matrixFavor', 'strengths', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.weaknesses} value={profile.matrix.matrixFavor.weaknesses} onChange={e => handleMatrixChange('matrixFavor', 'weaknesses', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.hobbies} value={profile.matrix.matrixFavor.hobbies} onChange={e => handleMatrixChange('matrixFavor', 'hobbies', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.dislikes} value={profile.matrix.matrixFavor.dislikes} onChange={e => handleMatrixChange('matrixFavor', 'dislikes', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.dreams} value={profile.matrix.matrixFavor.dreams} onChange={e => handleMatrixChange('matrixFavor', 'dreams', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.coreBeliefs} value={profile.matrix.matrixFavor.coreBeliefs} onChange={e => handleMatrixChange('matrixFavor', 'coreBeliefs', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.lifePhilosophy} value={profile.matrix.matrixFavor.lifePhilosophy} onChange={e => handleMatrixChange('matrixFavor', 'lifePhilosophy', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.pastTrauma} value={profile.matrix.matrixFavor.pastTrauma} onChange={e => handleMatrixChange('matrixFavor', 'pastTrauma', e.target.value)} disabled={isGenerating} />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <SheetFooter className="mt-auto border-t pt-6">
          <SheetClose asChild>
            <Button>{t.done}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function InputWithLabel(props: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <div className="space-y-2">
      <Label>{props.label}</Label>
      <Input {...props} />
    </div>
  );
}

function TextareaWithLabel(props: React.ComponentProps<typeof Textarea> & { label: string }) {
  return (
    <div className="space-y-2">
      <Label>{props.label}</Label>
      <Textarea rows={2} {...props} />
    </div>
  );
}

function SliderWithLabel(props: React.ComponentProps<typeof Slider> & { label: string }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between">
            <Label>{props.label}</Label>
            <span className="text-sm text-muted-foreground">{props.value?.[0]}</span>
        </div>
      <Slider {...props} />
    </div>
  );
}

    