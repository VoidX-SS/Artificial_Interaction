
"use client";

import { Dispatch, SetStateAction } from "react";
import { AgentProfile, AgentSoul, AgentMatrix, Gender } from "@/lib/types";
import { I18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronsUpDown, Pencil, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface AgentProfileDialogProps {
  agentNum: 1 | 2;
  profile: AgentProfile;
  setProfile: Dispatch<SetStateAction<AgentProfile>>;
  isGenerating: boolean;
  t: I18n;
}

export function AgentProfileDialog({
  agentNum,
  profile,
  setProfile,
  isGenerating,
  t,
}: AgentProfileDialogProps) {
  const { toast } = useToast();

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
  
  const handleMatrixFavorChange = (field: keyof AgentMatrix['matrixFavor'], value: string) => {
    setProfile(prev => ({
        ...prev,
        matrix: {
            ...prev.matrix,
            matrixFavor: {
                ...prev.matrix.matrixFavor,
                [field]: value,
            }
        }
    }))
  }

  const handleSyncMatrixToSoul = () => {
    setProfile(prev => {
      const newSoul: AgentSoul = {
        ...prev.soul,
        advanced: {
          ...prev.soul.advanced,
          socialPosition: {
            ...prev.soul.advanced.socialPosition,
            happinessIndex: Math.round((prev.matrix.emotionIndex.health + prev.matrix.emotionIndex.appearance) / 2),
          },
        },
      };

      return {
        ...prev,
        soul: newSoul
      };
    });

    toast({
      title: t.profileSynced,
      description: t.profileSyncedDesc,
    });
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isGenerating}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t.editAgent} {agentNum}: {profile.soul.basic.persona.name}</DialogTitle>
          <DialogDescription>{t.editAgentDesc}</DialogDescription>
        </DialogHeader>
        <div className="mt-2">
            <Button variant="outline" size="sm" onClick={handleSyncMatrixToSoul} disabled={isGenerating}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                {t.syncProfile}
            </Button>
        </div>
        <Tabs defaultValue="soul" className="mt-4 flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 bg-accent">
            <TabsTrigger value="soul">{t.agentSoul}</TabsTrigger>
            <TabsTrigger value="matrix">{t.agentMatrix}</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-1 mt-4 pr-6">
            <TabsContent value="soul" className="py-4">
              <div className="space-y-6">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-accent px-3 py-2 font-semibold">
                    {t.persona}
                    <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4 border border-t-0 rounded-b-md">
                    <div className="grid grid-cols-2 gap-4">
                      <InputWithLabel label={t.agentName} value={profile.soul.basic.persona.name} onChange={e => handleSoulChange('basic', 'persona', 'name', e.target.value)} disabled={isGenerating} />
                      <InputWithLabel label={t.age} type="number" value={profile.soul.basic.persona.age} onChange={e => handleSoulChange('basic', 'persona', 'age', parseInt(e.target.value) || 0)} disabled={isGenerating} />
                      <InputWithLabel label={t.nationality} value={profile.soul.basic.persona.nationality} onChange={e => handleSoulChange('basic', 'persona', 'nationality', e.target.value)} disabled={isGenerating} />
                      <InputWithLabel label={t.location} value={profile.soul.basic.persona.location} onChange={e => handleSoulChange('basic', 'persona', 'location', e.target.value)} disabled={isGenerating} />
                    </div>
                     <div className="space-y-2">
                      <Label>{t.gender}</Label>
                      <RadioGroup 
                        value={profile.soul.basic.persona.gender} 
                        onValueChange={(value: Gender) => handleSoulChange('basic', 'persona', 'gender', value)}
                        className="flex space-x-4"
                        disabled={isGenerating}
                      >
                          <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id={`male-${agentNum}`} />
                              <Label htmlFor={`male-${agentNum}`}>{t.male}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id={`female-${agentNum}`} />
                              <Label htmlFor={`female-${agentNum}`}>{t.female}</Label>
                          </div>
                      </RadioGroup>
                    </div>
                    <SliderWithLabel label={t.curiosityIndex} value={[profile.soul.basic.curiosityIndex]} onValueChange={v => handleSimpleSoulChange('basic', 'curiosityIndex', v[0])} disabled={isGenerating} />
                    <div className="space-y-2">
                        <Label>{t.summaryDiary}</Label>
                        <Textarea placeholder={t.personalityPlaceholder} value={profile.soul.basic.summaryDiary} onChange={e => handleSimpleSoulChange('basic', 'summaryDiary', e.target.value)} rows={8} disabled={isGenerating}/>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-accent px-3 py-2 font-semibold">
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
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-accent px-3 py-2 font-semibold">
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

                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-accent px-3 py-2 font-semibold">
                     {t.matrixFavor}
                    <ChevronsUpDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4 border border-t-0 rounded-b-md">
                     <div className="grid grid-cols-2 gap-4">
                        <InputWithLabel label={t.dob} value={profile.matrix.matrixFavor.dob} onChange={e => handleMatrixFavorChange('dob', e.target.value)} disabled={isGenerating} />
                        <InputWithLabel label={t.zodiac} value={profile.matrix.matrixFavor.zodiac} onChange={e => handleMatrixFavorChange('zodiac', e.target.value)} disabled={isGenerating} />
                     </div>
                     <InputWithLabel label={t.personalityType} value={profile.matrix.matrixFavor.personalityType} onChange={e => handleMatrixFavorChange('personalityType', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.thinkingStyle} value={profile.matrix.matrixFavor.thinkingStyle} onChange={e => handleMatrixFavorChange('thinkingStyle', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.strengths} value={profile.matrix.matrixFavor.strengths} onChange={e => handleMatrixFavorChange('strengths', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.weaknesses} value={profile.matrix.matrixFavor.weaknesses} onChange={e => handleMatrixFavorChange('weaknesses', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.hobbies} value={profile.matrix.matrixFavor.hobbies} onChange={e => handleMatrixFavorChange('hobbies', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.dislikes} value={profile.matrix.matrixFavor.dislikes} onChange={e => handleMatrixFavorChange('dislikes', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.dreams} value={profile.matrix.matrixFavor.dreams} onChange={e => handleMatrixFavorChange('dreams', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.coreBeliefs} value={profile.matrix.matrixFavor.coreBeliefs} onChange={e => handleMatrixFavorChange('coreBeliefs', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.lifePhilosophy} value={profile.matrix.matrixFavor.lifePhilosophy} onChange={e => handleMatrixFavorChange('lifePhilosophy', e.target.value)} disabled={isGenerating} />
                     <TextareaWithLabel label={t.pastTrauma} value={profile.matrix.matrixFavor.pastTrauma} onChange={e => handleMatrixFavorChange('pastTrauma', e.target.value)} disabled={isGenerating} />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-auto border-t pt-6">
          <DialogClose asChild>
            <Button>{t.done}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
