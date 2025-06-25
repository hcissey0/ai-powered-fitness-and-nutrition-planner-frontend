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
  Zap,
} from "lucide-react";
import ImageUploadAvatar from "./image-upload-avatar";
import { Textarea } from "./ui/textarea";
import { createProfile } from "@/lib/api-service";
import { Profile } from "@/interfaces";
import { toast } from "sonner";
import axios from "axios";

interface OnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
  onClose?: () => void; // Add optional onClose prop
}

export function OnboardingDialog({
  open,
  onComplete,
  onClose,
}: OnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "" as unknown as number,
    image: "",
    current_weight: "" as unknown as number,
    height: "" as unknown as number,
    gender: "",
    activity_level: "",
    dietary_preferences: "",
    goal: "",
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && onClose) {
      onClose();
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    if (formData.age <= 0) {
      toast.error("Please age is required.");
      setIsLoading(false);
      return;
    }
    formData.age = parseInt(formData.age as unknown as string);
    if (formData.current_weight <= 0) {
      toast.error("Please current weight is required.");
      setIsLoading(false);
      return;
    }
    formData.current_weight = parseInt(
      formData.current_weight as unknown as string
    );
    if (formData.height <= 0) {
      toast.error("Please height is required.");
      setIsLoading(false);
      return;
    }
    formData.height = parseInt(formData.height as unknown as string);
    if (formData.gender === "") {
      toast.error("Please select your gender");
      setIsLoading(false);
      return;
    }
    if (formData.activity_level === "") {
      toast.error("Please select your activity level");
      setIsLoading(false);
      return;
    }
    if (formData.goal === "") {
      toast.error("Please select your fitness goal");
      setIsLoading(false);
      return;
    }
    try {
      const profile = await createProfile(formData as Partial<Profile>);
      toast.success("Profile created successfully!");
      onComplete(); // Call the onComplete callback to notify parent component
    } catch (error) {
      let errorMessage = "An unexpected error occurred."; // Default message

      // Check if it's an Axios error and has a response from the server
      if (axios.isAxiosError(error) && error.response) {
        // Your backend sends { "error": "Your message here" }
        // So we access error.response.data.error
        // We add a fallback in case the 'error' key doesn't exist for some reason
        errorMessage = error.response.data.error || error.message;
      } else if (error instanceof Error) {
        // Handle other types of errors (e.g., network errors)
        errorMessage = error.message;
      }

      toast.error("Profile Creation failed.", {
        description: errorMessage, // Use the extracted message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
      // toast.success("Onboarding complete! Your profile has been created.");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[95vw] h-150 sm:h-170 max-h-[90vh] overflow-y-auto glass border border-white/20">
        <DialogHeader className="">
          <DialogTitle className="text-center text-lg sm:text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to FitGH!
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base text-muted-foreground">
            {"Let's set up your personalized fitness journey"}
          </DialogDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/10" />
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 sm:space-y-6">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Personal Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <ImageUploadAvatar
                      defaultImage={formData.image}
                      onImageChange={(image) =>
                        updateFormData("image", image as string)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="age"
                        className="text-xs sm:text-sm text-white"
                      >
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => updateFormData("age", e.target.value)}
                        className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="current_weight"
                        className="text-xs sm:text-sm text-white"
                      >
                        Current Weight (kg)
                      </Label>
                      <Input
                        id="current_weight"
                        type="number"
                        placeholder="70"
                        value={formData.current_weight}
                        onChange={(e) =>
                          updateFormData("current_weight", e.target.value)
                        }
                        className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="height"
                      className="text-xs sm:text-sm text-white"
                    >
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => updateFormData("height", e.target.value)}
                      className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm text-white">
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                    >
                      <SelectTrigger className="h-9 sm:h-10 text-sm glass border-white/20 text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/20">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-pulse" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Activity Level
                    </h3>
                  </div>

                  <RadioGroup
                    value={formData.activity_level}
                    onValueChange={(value) =>
                      updateFormData("activity_level", value)
                    }
                    className="space-y-2 sm:space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-2 sm:p-3 glass border border-white/10 rounded-lg hover:border-primary/30 transition-colors">
                      <RadioGroupItem
                        value="sedentary"
                        id="sedentary"
                        className="border-white/30 text-primary"
                      />
                      <Label
                        htmlFor="sedentary"
                        className="flex-1 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium text-white">
                            Sedentary
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Little to no exercise
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 sm:p-3 glass border border-white/10 rounded-lg hover:border-primary/30 transition-colors">
                      <RadioGroupItem
                        value="lightly_active"
                        id="lightly_active"
                        className="border-white/30 text-primary"
                      />
                      <Label
                        htmlFor="lightly_active"
                        className="flex-1 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium text-white">
                            Lightly Active
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Light exercise 1-3 days/week
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 sm:p-3 glass border border-white/10 rounded-lg hover:border-primary/30 transition-colors">
                      <RadioGroupItem
                        value="moderately_active"
                        id="moderately_active"
                        className="border-white/30 text-primary"
                      />
                      <Label
                        htmlFor="moderately_active"
                        className="flex-1 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium text-white">
                            Moderately Active
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Moderate exercise 3-5 days/week
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 sm:p-3 glass border border-white/10 rounded-lg hover:border-primary/30 transition-colors">
                      <RadioGroupItem
                        value="very_active"
                        id="very_active"
                        className="border-white/30 text-primary"
                      />
                      <Label
                        htmlFor="very_active"
                        className="flex-1 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium text-white">
                            Very Active
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Hard exercise 6-7 days/week
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-neon-green animate-pulse" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Fitness Goal
                    </h3>
                  </div>

                  <RadioGroup
                    value={formData.goal}
                    onValueChange={(value) => updateFormData("goal", value)}
                    className="space-y-2 sm:space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-2 sm:p-3 glass border border-white/10 rounded-lg hover:border-accent/30 transition-colors">
                      <RadioGroupItem
                        value="weight_loss"
                        id="weight_loss"
                        className="border-white/30 text-accent"
                      />
                      <Label
                        htmlFor="weight_loss"
                        className="flex-1 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium text-white">
                            Lose Weight
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Reduce body weight and fat
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 sm:p-3 glass border border-white/10 rounded-lg hover:border-accent/30 transition-colors">
                      <RadioGroupItem
                        value="maintenance"
                        id="maintenance"
                        className="border-white/30 text-accent"
                      />
                      <Label
                        htmlFor="maintenance"
                        className="flex-1 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium text-white">
                            Maintain Weight
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Stay at current weight
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 sm:p-3 glass border border-white/10 rounded-lg hover:border-accent/30 transition-colors">
                      <RadioGroupItem
                        value="muscle_gain"
                        id="muscle_gain"
                        className="border-white/30 text-accent"
                      />
                      <Label
                        htmlFor="muscle_gain"
                        className="flex-1 cursor-pointer"
                      >
                        <div>
                          <p className="text-sm sm:text-base font-medium text-white">
                            Gain Muscle
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Build muscle mass and strength
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              )}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-neon-green animate-pulse" />
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Dietary Preferences
                    </h3>
                  </div>
                  <Label>
                    <p className="text-sm  text-muted-foreground mb-1">
                      Please provide any dietary preferences or restrictions
                      (e.g., vegetarian, vegan, gluten-free, lactose
                      intolerant).
                      <br />
                    </p>
                  </Label>
                  <Textarea
                    value={formData.dietary_preferences}
                    onChange={(e) =>
                      updateFormData("dietary_preferences", e.target.value)
                    }
                    className="glass min-h-44"
                  />
                  <p className="text-xs sm:text-xs text-muted-foreground mt-1">
                    This will help us tailor your meal plans to your needs.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              size="sm"
              className="h-9 sm:h-10 glass border-white/20 text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="cyber-button h-9 sm:h-10 text-white font-semibold"
              size="sm"
            >
              <span className="hidden sm:inline">
                {isLoading
                  ? "Creating..."
                  : currentStep === totalSteps
                  ? "Finish Setup"
                  : "Next"}
              </span>
              <span className="sm:hidden">
                {isLoading
                  ? "..."
                  : currentStep === totalSteps
                  ? "Finish"
                  : "Next"}
              </span>
              {currentStep !== totalSteps && !isLoading && (
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
              )}
              {currentStep === totalSteps && !isLoading && (
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 animate-ping" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
