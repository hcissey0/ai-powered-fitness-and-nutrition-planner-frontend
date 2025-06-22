"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Activity, Save } from "lucide-react";
import { toast } from "sonner";
import { FuturisticCard } from "@/components/futuristic-card";
import { AnimatedBackground } from "@/components/animated-background";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Kwame Asante",
    email: "kwame.asante@email.com",
    age: "28",
    weight: "72.5",
    height: "175",
    gender: "male",
    activityLevel: "moderately-active",
    fitnessGoal: "lose-weight",
  });

  const updateProfileData = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile Updated",
        { description: "Your profile has been successfully updated." }
      );
    }, 1000);
  };

  return (
    <div className=" min-h-full relative">
    
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className=" container p relative z-10">
          {/* Profile */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-neon-green bg-clip-text text-transparent">
                Profile Settings ⚙️
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage your account and fitness preferences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Profile Overview */}
                <FuturisticCard glowColor="blue">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse" />
                      Profile Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mb-4 ring-2 ring-primary/50">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-base sm:text-lg bg-gradient-to-r from-primary to-accent text-white">
                          KA
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {profileData.fullName}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {profileData.email}
                      </p>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-white">
                          Current Weight
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/50 bg-primary/10 text-primary"
                        >
                          {profileData.weight} kg
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-white">
                          Height
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs border-accent/50 bg-accent/10 text-accent"
                        >
                          {profileData.height} cm
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-white">
                          BMI
                        </span>
                        <Badge className="bg-gradient-to-r from-neon-green to-primary text-white text-xs">
                          {(
                            Number.parseFloat(profileData.weight) /
                            Math.pow(
                              Number.parseFloat(profileData.height) / 100,
                              2
                            )
                          ).toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </FuturisticCard>
                              

              {/* Profile Settings */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Personal Information */}
                  <FuturisticCard glowColor="green">
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                        <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-neon-green animate-pulse" />
                        Personal Information
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                        Update your basic profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="fullName"
                            className="text-xs sm:text-sm text-white"
                          >
                            Full Name
                          </Label>
                          <Input
                            id="fullName"
                            value={profileData.fullName}
                            onChange={(e) =>
                              updateProfileData("fullName", e.target.value)
                            }
                            className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-xs sm:text-sm text-white"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              updateProfileData("email", e.target.value)
                            }
                            className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
                            value={profileData.age}
                            onChange={(e) =>
                              updateProfileData("age", e.target.value)
                            }
                            className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="weight"
                            className="text-xs sm:text-sm text-white"
                          >
                            Weight (kg)
                          </Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={profileData.weight}
                            onChange={(e) =>
                              updateProfileData("weight", e.target.value)
                            }
                            className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                          />
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
                            value={profileData.height}
                            onChange={(e) =>
                              updateProfileData("height", e.target.value)
                            }
                            className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs sm:text-sm text-white">
                          Gender
                        </Label>
                        <Select
                          value={profileData.gender}
                          onValueChange={(value) =>
                            updateProfileData("gender", value)
                          }
                          >
                          <SelectTrigger className="h-9 sm:h-10 text-sm glass border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/20">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </FuturisticCard>

                          
                {/* Fitness Preferences */}
                  <FuturisticCard glowColor="pink">
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                        <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-pulse" />
                        Fitness Preferences
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                        Update your activity level and fitness goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm text-white">
                          Activity Level
                        </Label>
                        <RadioGroup
                          value={profileData.activityLevel}
                          onValueChange={(value) =>
                            updateProfileData("activityLevel", value)
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-2 sm:p-3 glass border border-white/10 rounded-lg hover:border-primary/30 transition-colors">
                            <RadioGroupItem
                              value="sedentary"
                              id="sedentary-profile"
                              className="border-white/30 text-primary"
                            />
                            <Label
                              htmlFor="sedentary-profile"
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
                              value="lightly-active"
                              id="lightly-active-profile"
                              className="border-white/30 text-primary"
                            />
                            <Label
                              htmlFor="lightly-active-profile"
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
                              value="moderately-active"
                              id="moderately-active-profile"
                              className="border-white/30 text-primary"
                            />
                            <Label
                              htmlFor="moderately-active-profile"
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
                              value="very-active"
                              id="very-active-profile"
                              className="border-white/30 text-primary"
                            />
                            <Label
                              htmlFor="very-active-profile"
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
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-xs sm:text-sm text-white">
                          Fitness Goal
                        </Label>
                        <RadioGroup
                          value={profileData.fitnessGoal}
                          onValueChange={(value) =>
                            updateProfileData("fitnessGoal", value)
                          }
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-2 sm:p-3 glass border border-white/10 rounded-lg hover:border-accent/30 transition-colors">
                            <RadioGroupItem
                              value="lose-weight"
                              id="lose-weight-profile"
                              className="border-white/30 text-accent"
                            />
                            <Label
                              htmlFor="lose-weight-profile"
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
                              value="maintain-weight"
                              id="maintain-weight-profile"
                              className="border-white/30 text-accent"
                            />
                            <Label
                              htmlFor="maintain-weight-profile"
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
                              value="gain-muscle"
                              id="gain-muscle-profile"
                              className="border-white/30 text-accent"
                            />
                            <Label
                              htmlFor="gain-muscle-profile"
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
                      </div>
                    </CardContent>
                  </FuturisticCard>

                {/* Save Button */}
                
                  <FuturisticCard glowColor="purple">
                    <CardContent className="pt-4 sm:pt-6">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full cyber-button h-9 sm:h-10 text-white font-semibold"
                        size="sm"
                      >
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        {isLoading ? "Saving Changes..." : "Save Changes"}
                      </Button>
                    </CardContent>
                  </FuturisticCard>
                
              </div>
            </div>
      
        </div>
      </div>
  );
}
