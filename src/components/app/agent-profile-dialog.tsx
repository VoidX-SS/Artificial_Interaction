
"use client";

import { Dispatch, SetStateAction } from "react";
import { AgentProfile, AgentSoul, AgentMatrix, Gender } from "@/lib/types";
import { I18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pencil, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

    const handleSoulAdvancedChange = (field: keyof AgentSoul['advanced']['socialPosition'], value: string | number) => {
     setProfile(prev => ({
      ...prev,
      soul: {
        ...prev.soul,
        advanced: {
            ...prev.soul.advanced,
            socialPosition: {
                ...prev.soul.advanced.socialPosition,
                [field]: value,
            }
        }
      }
    }));
  }

  const handleRelationshipsChange = (value: string) => {
       setProfile(prev => ({
      ...prev,
      soul: {
        ...prev.soul,
        advanced: {
            ...prev.soul.advanced,
            relationships: value,
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
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t.editAgent} {agentNum}: {profile.soul.basic.persona.name}</DialogTitle>
           <div className="flex items-center gap-4 pt-1">
                <p className="text-sm text-muted-foreground">{t.editAgentDesc}</p>
                <Button variant="outline" size="sm" onClick={handleSyncMatrixToSoul} disabled={isGenerating}>
                    <RefreshCcw className="mr-2 h-3 w-3" />
                    {t.syncProfile}
                </Button>
           </div>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-4 -mx-6 px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                {/* SOUL Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>{t.persona}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputWithLabel label={t.agentName} value={profile.soul.basic.persona.name} onChange={e => handleSoulChange('basic', 'persona', 'name', e.target.value)} disabled={isGenerating} />
                                <InputWithLabel label={t.age} type="number" value={profile.soul.basic.persona.age} onChange={e => handleSoulChange('basic', 'persona', 'age', parseInt(e.target.value) || 0)} disabled={isGenerating} />
                                <InputWithLabel label={t.nationality} value={profile.soul.basic.persona.nationality} onChange={e => handleSoulChange('basic', 'persona', 'nationality', e.target.value)} disabled={isGenerating} />
                                <InputWithLabel label={t.location} value={profile.soul.basic.persona.location} onChange={e => handleSoulChange('basic', 'persona', 'location', e.target.value)} disabled={isGenerating} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t.gender}</Label>
                                <RadioGroup value={profile.soul.basic.persona.gender} onValueChange={(value: Gender) => handleSoulChange('basic', 'persona', 'gender', value)} className="flex space-x-4" disabled={isGenerating}>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="male" id={`male-${agentNum}`} /><Label htmlFor={`male-${agentNum}`}>{t.male}</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="female" id={`female-${agentNum}`} /><Label htmlFor={`female-${agentNum}`}>{t.female}</Label></div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>{t.personality}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <SliderWithLabel label={t.curiosityIndex} value={[profile.soul.basic.curiosityIndex]} onValueChange={v => handleSimpleSoulChange('basic', 'curiosityIndex', v[0])} disabled={isGenerating} />
                            <TextareaWithLabel label={t.summaryDiary} placeholder={t.personalityPlaceholder} value={profile.soul.basic.summaryDiary} onChange={e => handleSimpleSoulChange('basic', 'summaryDiary', e.target.value)} rows={8} disabled={isGenerating}/>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>{t.socialPosition}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InputWithLabel label={t.job} value={profile.soul.advanced.socialPosition.job} onChange={e => handleSoulAdvancedChange('job', e.target.value)} disabled={isGenerating} />
                                <InputWithLabel label={t.financialStatus} value={profile.soul.advanced.socialPosition.financialStatus} onChange={e => handleSoulAdvancedChange('financialStatus', e.target.value)} disabled={isGenerating} />
                            </div>
                            <SliderWithLabel label={t.qualityOfLife} value={[profile.soul.advanced.socialPosition.qualityOfLife]} onValueChange={v => handleSoulAdvancedChange('qualityOfLife', v[0])} disabled={isGenerating} />
                            <SliderWithLabel label={t.happinessIndex} value={[profile.soul.advanced.socialPosition.happinessIndex]} onValueChange={v => handleSoulAdvancedChange('happinessIndex', v[0])} disabled={isGenerating} />
                            <TextareaWithLabel label={t.relationships} value={profile.soul.advanced.relationships} onChange={e => handleRelationshipsChange(e.target.value)} disabled={isGenerating}/>
                        </CardContent>
                    </Card>
                </div>

                {/* MATRIX Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>{t.emotionIndex}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <SliderWithLabel label={t.health} value={[profile.matrix.emotionIndex.health]} onValueChange={v => handleMatrixChange('emotionIndex', 'health', v[0])} disabled={isGenerating} />
                            <SliderWithLabel label={t.appearance} value={[profile.matrix.emotionIndex.appearance]} onValueChange={v => handleMatrixChange('emotionIndex', 'appearance', v[0])} disabled={isGenerating} />
                            <SliderWithLabel label={t.iq} max={200} value={[profile.matrix.emotionIndex.iq]} onValueChange={v => handleMatrixChange('emotionIndex', 'iq', v[0])} disabled={isGenerating} />
                            <SliderWithLabel label={t.eq} max={200} value={[profile.matrix.emotionIndex.eq]} onValueChange={v => handleMatrixChange('emotionIndex', 'eq', v[0])} disabled={isGenerating} />
                            <SliderWithLabel label={t.antipathy} value={[profile.matrix.emotionIndex.antipathy]} onValueChange={v => handleMatrixChange('emotionIndex', 'antipathy', v[0])} disabled={isGenerating} />
                            <InputWithLabel label={t.nextIntention} value={profile.matrix.emotionIndex.nextIntention} onChange={e => handleMatrixChange('emotionIndex', 'nextIntention', e.target.value)} disabled={isGenerating} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>{t.matrixFavor}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ScrollArea>

        <DialogFooter className="mt-auto border-t pt-4 -mx-6 px-6">
          <DialogClose asChild>
            <Button>{t.done}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InputWithLabel(props: React.ComponentProps<typeof Input> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input {...rest} />
    </div>
  );
}

function TextareaWithLabel(props: React.ComponentProps<typeof Textarea> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea rows={2} {...rest} />
    </div>
  );
}

function SliderWithLabel(props: React.ComponentProps<typeof Slider> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div className="space-y-2 pt-1">
       <div className="flex justify-between items-center">
            <Label className="text-sm">{label}</Label>
            <span className="text-sm font-medium text-primary">{props.value?.[0]}</span>
        </div>
      <Slider {...rest} />
    </div>
  );
}

    

    