"use client";

import { useEffect, useState } from "react";
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
import {
  User,
  Settings,
  Activity,
  Save,
  Target,
  User2Icon,
  Loader2,
  Dumbbell,
} from "lucide-react";
import { toast } from "sonner";
import { FuturisticCard } from "@/components/futuristic-card";
import { AnimatedBackground } from "@/components/animated-background";
import {
  getProfile,
  updateProfile,
  updateUser,
  getDailyProgress,
} from "@/lib/api-service";
import { Profile } from "@/interfaces";
import { useAuth } from "@/context/auth-context";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadAvatar from "@/components/image-upload-avatar";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { ProgressCalendar } from "@/components/progress-calendar";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Initialize with empty/default values instead of depending on user immediately
  const [profileData, setProfileData] = useState<Partial<Profile>>({});
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [onbordingOpen, setOnbordingOpen] = useState(false);

  // Effect to update state when user data becomes available
  useEffect(() => {
    if (user) {
      // Update user-related fields
      setFirst_name(user.first_name || "");
      setLast_name(user.last_name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");

      // Update profile data
      if (user.profile) {
        setProfileData(user.profile as Profile);
      } else {
        // If no profile exists, show onboarding
        setOnbordingOpen(true);
        setProfileData({}); // Reset to empty object
      }
    }
  }, [user]); // Depend on user object

  // Separate effect for onboarding logic
  useEffect(() => {
    if (user && !user.profile) {
      setOnbordingOpen(true);
    }
  }, [user]);

  const updateProfileData = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update profile data via API
      const updatedProfile = await updateProfile({
        ...profileData,
        // Convert string values to proper types
        age: profileData.age ? Number(profileData.age) : null,
        current_weight: profileData.current_weight
          ? Number(profileData.current_weight)
          : null,
        height: profileData.height ? Number(profileData.height) : null,
      });

      // Update local state with the response
      setProfileData(updatedProfile);

      toast.success("Profile Updated", {
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUserDetails = async () => {
    setIsLoading(true);
    try {
      // Update user details via API
      const updatedUser = await updateUser({
        first_name,
        last_name,
        username,
        email,
      });

      toast.success("Personal Information Updated", {
        description: "Your personal information has been successfully updated.",
      });
    } catch (error) {
      console.error("User update error:", error);
      toast.error("Error", {
        description: "Failed to update personal information. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while user data is being fetched
  if (!user) {
    return (
      <div className="min-h-full relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-white mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex justify-center relative">
      <div className="relative ">
        {/* Profile */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-neon-green bg-clip-text text-transparent">
            Profile Settings ⚙️
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account and fitness preferences
          </p>
        </div>
          {/* Profile Overview */}
        <div className="mb-4">
          {/* <div className="space-y-4 sm:space-y-6"></div> */}
          <FuturisticCard className="w-full" glowColor="blue">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col items-center text-center">
                <ImageUploadAvatar
                  defaultImage={profileData?.image as string}
                  onImageChange={(image) =>
                    updateProfileData("image", image as string)
                  }
                  disabled
                />
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {first_name && last_name
                    ? `${first_name} ${last_name}`
                    : "Complete your profile"}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {username || "Username"} • {email || "Email"}
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
                    {profileData?.current_weight || "0"} kg
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
                    {profileData?.height || "0"} cm
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium text-white">
                    BMI
                  </span>
                  <Badge className="bg-gradient-to-r from-neon-green to-primary text-white text-xs">
                    {profileData?.bmi || "0"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </FuturisticCard>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">

          {/* Profile Settings */}
          {/* <div className=" space-y-4 sm:space-y-6"></div> */}
          {/* Personal Information */}
          <FuturisticCard className="w-full md:w-sm" glowColor="green">
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
                <div className="col-span-2">
                  <ImageUploadAvatar
                    defaultImage={profileData?.image as string}
                    onImageChange={(image) =>
                      updateProfileData("image", image as string)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="first_name"
                    className="text-xs sm:text-sm text-white"
                  >
                    First Name
                  </Label>
                  <Input
                    id="first_name" // Fixed typo: was "first_ame"
                    value={first_name}
                    onChange={(e) => setFirst_name(e.target.value)}
                    className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="last_name"
                    className="text-xs sm:text-sm text-white"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    value={last_name}
                    onChange={(e) => setLast_name(e.target.value)}
                    className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-xs sm:text-sm text-white"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                  />
                </div>
              </div>
              {/* <div>
                <Button
                  onClick={handleSaveUserDetails}
                  disabled={isLoading}
                  className="cyber-button w-full h-9 sm:h-10 text-white font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Save Personal Info
                    </>
                  )}
                </Button>
              </div> */}
            </CardContent>
          </FuturisticCard>

          {/* Profile Information */}
          <FuturisticCard className="w-full md:w-sm" glowColor="green">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                <User2Icon className="h-4 w-4 sm:h-5 sm:w-5 text-neon-green animate-pulse" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Update your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
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
                    value={profileData?.age || ""}
                    onChange={(e) => updateProfileData("age", e.target.value)}
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
                    value={profileData?.current_weight || ""}
                    onChange={(e) =>
                      updateProfileData("current_weight", e.target.value)
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
                    value={profileData?.height || ""}
                    onChange={(e) =>
                      updateProfileData("height", e.target.value)
                    }
                    className="h-9 sm:h-10 text-sm glass border-white/20 text-white placeholder:text-muted-foreground focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-white">Gender</Label>
                <Select
                  value={profileData?.gender || ""}
                  onValueChange={(value) => updateProfileData("gender", value)}
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
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-neon-green animate-pulse" />
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Dietary Preferences
                  </h3>
                </div>
                <Label>
                  <p className="text-sm text-muted-foreground mb-1">
                    Please provide any dietary preferences or restrictions
                    (e.g., vegetarian, vegan, gluten-free, lactose intolerant).
                    <br />
                  </p>
                </Label>
                <Textarea
                  value={profileData?.dietary_preferences || ""}
                  onChange={(e) =>
                    updateProfileData("dietary_preferences", e.target.value)
                  }
                  className="glass min-h-44"
                  placeholder="Enter your dietary preferences..."
                />
                <p className="text-xs sm:text-xs text-muted-foreground mt-1">
                  This will help us tailor your meal plans to your needs.
                </p>
              </div>
            </CardContent>
          </FuturisticCard>

          {/* Fitness Preferences */}
          <FuturisticCard className="w-full md:w-sm" glowColor="pink">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-pulse" />
                Activity Level
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Update your activity level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <RadioGroup
                value={profileData?.activity_level || ""}
                onValueChange={(value) =>
                  updateProfileData("activity_level", value)
                }
                className="space-y-2"
              >
                <div
                  className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-accent/10 transition-colors ${
                    profileData?.activity_level === "sedentary"
                      ? "gradient-bg"
                      : ""
                  }`}
                >
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
                <div
                  className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-accent/10 transition-colors ${
                    profileData?.activity_level === "lightly_active"
                      ? "gradient-bg"
                      : ""
                  }`}
                >
                  <RadioGroupItem
                    value="lightly_active"
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
                <div
                  className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-accent/10 transition-colors ${
                    profileData?.activity_level === "moderately_active"
                      ? "gradient-bg"
                      : ""
                  }`}
                >
                  <RadioGroupItem
                    value="moderately_active"
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
                <div
                  className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-accent/10 transition-colors ${
                    profileData?.activity_level === "very_active"
                      ? "gradient-bg"
                      : ""
                  }`}
                >
                  <RadioGroupItem
                    value="very_active"
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
            </CardContent>
          </FuturisticCard>

          <FuturisticCard className="w-full md:w-sm" glowColor="pink">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-pulse" />
                Fitness Goal
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Update your fitness goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <RadioGroup
                value={profileData?.goal || ""}
                onValueChange={(value) => updateProfileData("goal", value)}
                className="space-y-2"
              >
                <div
                  className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-accent/10 transition-colors ${
                    profileData?.goal === "weight_loss" ? "gradient-bg" : ""
                  }`}
                >
                  <RadioGroupItem
                    value="weight_loss"
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
                <div
                  className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-accent/10 transition-colors ${
                    profileData?.goal === "maintenance" ? "gradient-bg" : ""
                  }`}
                >
                  <RadioGroupItem
                    value="maintenance"
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
                <div
                  className={`flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-accent/10 transition-colors ${
                    profileData?.goal === "muscle_gain" ? "gradient-bg" : ""
                  }`}
                >
                  <RadioGroupItem
                    value="muscle_gain"
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
            </CardContent>
          </FuturisticCard>
        </div>
        <div className="mt-4 flex justify-center">
          {/* Save Button */}
          <Button
            onClick={()=> {handleSave();handleSaveUserDetails()}}
            disabled={isLoading}
            className="max-w-xl md:w-sm cyber-button h-9 sm:h-10 text-white font-semibold"
            size="sm"
          >
            {isLoading ? (
              <Loader2
                className={`h-3 w-3 sm:h-4 sm:w-4 mr-2 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            ) : (
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-ping" />
            )}
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </div>
      <OnboardingDialog
        open={onbordingOpen}
        onComplete={() => {
          setOnbordingOpen(false);
          // toast.success("onboarding completed");
        }}
        onClose={() => {
          setOnbordingOpen(false);
          // toast.error("onboarding closed");
        }}
      />
    </div>
  );
}
