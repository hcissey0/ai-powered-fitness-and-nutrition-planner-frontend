// components/onboarding-dialog.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Activity,
  Target,
  Utensils,
  Zap,
  HeartPulseIcon,
  CheckCircle,
  IconNode,
} from "lucide-react";
import ImageUploadAvatar from "./image-upload-avatar";
import { Textarea } from "./ui/textarea";
import { createProfile } from "@/lib/api-service";
import { Profile } from "@/interfaces";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error-handler";
import { useAuth } from "@/context/auth-context";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

interface OnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
  onClose?: () => void;
}

interface Step {
  id: number;
  title: string;
  icon: any;
}

const steps: Step[] = [
  { id: 1, title: "Personal Information", icon: User },
  { id: 2, title: "Activity Level", icon: Activity },
  { id: 3, title: "Fitness Goal", icon: Target },
  { id: 4, title: "Dietary Preferences", icon: Utensils },
  { id: 5, title: "Didsabilities & Health Conditions", icon: HeartPulseIcon },
  { id: 6, title: "Tracking & Notification", icon: CheckCircle },
];

export function OnboardingDialog({
  open,
  onComplete,
  onClose,
}: OnboardingDialogProps) {
  const { refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof Profile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !!formData.age &&
          !!formData.current_weight &&
          !!formData.height &&
          !!formData.gender
        );
      case 2:
        return !!formData.activity_level;
      case 3:
        return !!formData.goal;
      case 4:
      case 5:
      case 6:
        return true; // The rest are optional
      default:
        return false;
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      // Ensure numeric types are correct
      const payload = {
        ...formData,
        age: Number(formData.age),
        current_weight: Number(formData.current_weight),
        height: Number(formData.height),
      };
      await createProfile(payload);
      toast.success("Profile created successfully!");
      await refreshUser(); // Refresh user data to get the new profile
      onComplete();
    } catch (error) {
      handleApiError(error, "Profile Creation Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields for this step.");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose?.()}>
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto glass">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
            Welcome to Your Fitness Journey!
          </DialogTitle>
          <DialogDescription>
            Let's set up your profile for a personalized experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Render step content based on currentStep */}
              {currentStep === 1 && (
                <Step1
                  step={steps.find((s) => s.id === currentStep) as any}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {currentStep === 2 && (
                <Step2
                  step={steps.find((s) => s.id === currentStep) as any}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {currentStep === 3 && (
                <Step3
                  step={steps.find((s) => s.id === currentStep) as any}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {currentStep === 4 && (
                <Step4
                  step={steps.find((s) => s.id === currentStep) as any}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {currentStep === 5 && (
                <Step5
                  step={steps.find((s) => s.id === currentStep) as any}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {currentStep === 6 && (
                <Step6
                  step={steps.find((s) => s.id === currentStep) as any}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="cyber-button"
          >
            {isLoading
              ? "Saving..."
              : currentStep === totalSteps
              ? "Finish Setup"
              : "Next"}
            {isLoading ? (
              <Zap className="h-4 w-4 ml-2 animate-spin" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface StepProps {
  step: Step;
  formData: Partial<Profile>;
  updateFormData: (field: keyof Profile, value: any) => void;
}

// Sub-components for each step for better organization and readability
const Step1 = ({ step, formData, updateFormData }: StepProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <step.icon className="h-5 w-5 text-primary" />
      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
    </div>
    <div className="flex flex-col items-center">
      <ImageUploadAvatar
        defaultImage={formData.image as string}
        onImageChange={(image) => updateFormData("image", image)}
      />
      {!formData.image && (
        <p className="text-xs text-muted-foreground">click to add image</p>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="e.g: 25"
          value={formData.age || ""}
          onChange={(e) => updateFormData("age", e.target.value)}
          className="glass"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="current_weight">Weight (kg)</Label>
        <Input
          id="current_weight"
          type="number"
          placeholder="e.g: 70"
          value={formData.current_weight || ""}
          onChange={(e) => updateFormData("current_weight", e.target.value)}
          className="glass"
        />
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <Label htmlFor="height">Height (cm)</Label>
      <Input
        id="height"
        type="number"
        placeholder="e.g: 175"
        value={formData.height || ""}
        onChange={(e) => updateFormData("height", e.target.value)}
        className="glass"
      />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Gender</Label>
      <Select
        value={formData.gender as string}
        onValueChange={(value) => updateFormData("gender", value)}
      >
        <SelectTrigger className="glass">
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent className="glass-popover">
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const Step2 = ({ step, formData, updateFormData }: StepProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <step.icon className="h-5 w-5 text-primary" />
      <h3 className="text-lg font-semibold text-foreground">
        {step.title}
      </h3>{" "}
    </div>
    <RadioGroup
      value={formData.activity_level}
      onValueChange={(value) => updateFormData("activity_level", value)}
      className="space-y-2"
    >
      {(
        [
          "sedentary",
          "lightly_active",
          "moderately_active",
          "very_active",
          "athlete",
        ] as const
      ).map((level) => (
        <Label
          key={level}
          htmlFor={level}
          className="flex items-center space-x-2 p-3 glass rounded-lg hover:border-primary transition-colors cursor-pointer"
        >
          <RadioGroupItem value={level} id={level} />
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {level.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>
            <p className="text-xs text-muted-foreground">
              {/* Descriptions can be added here */}
            </p>
          </div>
        </Label>
      ))}
    </RadioGroup>
  </div>
);

const Step3 = ({ step, formData, updateFormData }: StepProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Target className="h-5 w-5 text-primary" />
      <h3 className="text-lg font-semibold text-foreground">Fitness Goal</h3>
    </div>
    <RadioGroup
      value={formData.goal}
      onValueChange={(value) => updateFormData("goal", value)}
      className="space-y-2"
    >
      {(
        ["weight_loss", "maintenance", "muscle_gain", "endurance"] as const
      ).map((goal) => (
        <Label
          key={goal}
          htmlFor={goal}
          className="flex items-center space-x-2 p-3 glass rounded-lg hover:border-primary transition-colors cursor-pointer"
        >
          <RadioGroupItem value={goal} id={goal} />
          <div className="flex-1">
            <p className="font-medium text-foreground">
              {goal.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </p>
          </div>
        </Label>
      ))}
    </RadioGroup>
  </div>
);

const Step4 = ({ step, formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2">
      <step.icon className="h-5 w-5 text-primary" />
      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
    </div>
    <div className="flex flex-col gap-3">
      <Label
        htmlFor="dietary_preferences"
        className="flex flex-col items-start"
      >
        <div className="font-semibold">Dietary Restrictions:</div>
        <div className="text-xs text-muted-foreground">
          comma-separated (e.g., vegetarian, vegan, gluten-free, halal, etc.)
        </div>
      </Label>
      <Textarea
        id="dietary_preferences"
        value={formData.dietary_preferences || ""}
        onChange={(e) => updateFormData("dietary_preferences", e.target.value)}
        className="glass"
      />
    </div>
    <div className="flex flex-col gap-3">
      <Label htmlFor="allergies" className="flex flex-col items-start">
        <div className="font-semibold">Allergies:</div>
        <div className="text-xs text-muted-foreground">
          comma-separated (e.g. groundnuts, corn, etc.)
        </div>
      </Label>
      <Textarea
        id="allergies"
        value={formData.allergies || ""}
        onChange={(e) => updateFormData("allergies", e.target.value)}
        className="glass"
      />
    </div>
    <div className="flex flex-col gap-3">
      <Label htmlFor="liked_foods" className="flex flex-col items-start">
        <div className="font-semibold">Foods you like best:</div>
        <div className="text-xs text-muted-foreground">
          comma-separated (e.g. gob3, koko, etc.)
        </div>
      </Label>
      <Textarea
        id="liked_foods"
        value={formData.liked_foods || ""}
        onChange={(e) => updateFormData("liked_foods", e.target.value)}
        className="glass"
      />
    </div>
    <div className="flex flex-col gap-3">
      <Label htmlFor="disliked_foods" className="flex flex-col items-start">
        <div className="font-semibold">Foods you don't like:</div>
        <div className="text-xs text-muted-foreground">
          comma-separated (e.g. banku, waakye, etc.)
        </div>
      </Label>
      <Textarea
        id="disliked_foods"
        value={formData.disliked_foods || ""}
        onChange={(e) => updateFormData("disliked_foods", e.target.value)}
        className="glass"
      />
    </div>
    <Separator orientation="horizontal" className="mt-5" />
    <p className="text-xs text-muted-foreground">
      This helps our AI tailor your meal plans perfectly.
    </p>
  </div>
);

const Step5 = ({ step, formData, updateFormData }: StepProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <step.icon className="h-5 w-5 text-primary" />
      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
    </div>
    <div className="flex flex-col gap-3">
      <Label htmlFor="disabilities" className="flex flex-col items-start">
        <div className="font-semibold">Disabilities:</div>
        <div className="text-xs text-muted-foreground">
          comma-separated (e.g. short-sighted, deaf etc.)
        </div>
      </Label>
      <Textarea
        id="disabilities"
        value={formData.disabilities || ""}
        onChange={(e) => updateFormData("disabilities", e.target.value)}
        className="glass"
      />
    </div>
    <div className="flex flex-col gap-3">
      <Label htmlFor="medical_conditions" className="flex flex-col items-start">
        <div className="font-semibold">Health conditions:</div>
        <div className="text-xs text-muted-foreground">
          comma-separated (e.g. hypertension, athsma etc.)
        </div>
      </Label>
      <Textarea
        id="medical_conditions"
        value={formData.medical_conditions || ""}
        onChange={(e) => updateFormData("medical_conditions", e.target.value)}
        className="glass"
      />
    </div>
  </div>
);

const Step6 = ({ step, formData, updateFormData }: StepProps) => (
  <div className="space-y-8">
    <div className="flex items-center gap-2">
      <step.icon className="h-5 w-5 text-primary" />
      <h3 className="font-semibold">{step.title}</h3>
    </div>
    <div className="flex items-center justify-between gap-4">
      <Label className="flex flex-col items-start">
        <div className="font-semibold">Enable Tracking</div>
        <div className="text-xs text-muted-foreground">
          Allow the tracking of meals and exercises.
        </div>
      </Label>
      <Switch
        checked={formData.tracking_enabled}
        onCheckedChange={(checked) =>
          updateFormData("tracking_enabled", checked)
        }
      />
    </div>

    <div className="flex items-center justify-between gap-4">
      <Label className="flex flex-col items-start">
        <div className="font-semibold">Enable Notifications</div>
        <div className="text-xs text-muted-foreground">
          Allow app to send notificaitons.
        </div>
      </Label>
      <Switch
        checked={formData.notifications_enabled}
        onCheckedChange={(checked) =>
          updateFormData("notifications_enabled", checked)
        }
      />
    </div>
  </div>
);
