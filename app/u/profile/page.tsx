// /u/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
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
import { User, Settings, Activity, Save, Target, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfile, updateUser } from "@/lib/api-service";
import { Profile, User as UserInterface } from "@/interfaces";
import { useAuth } from "@/context/auth-context";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadAvatar from "@/components/image-upload-avatar";
import { handleApiError } from "@/lib/error-handler";

type UserDetails = Pick<
  UserInterface,
  "first_name" | "last_name" | "username" | "email"
>;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [userDetails, setUserDetails] = useState<Partial<UserDetails>>({});
  const [profileData, setProfileData] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (user) {
      setUserDetails({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        email: user.email || "",
      });
      if (user.profile) {
        setProfileData(user.profile);
      }
    }
  }, [user]);

  const handleProfileChange = (field: keyof Profile, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserDetailsChange = (field: keyof UserDetails, value: string) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const profilePayload = {
        ...profileData,
        age: Number(profileData.age) || null,
        current_weight: Number(profileData.current_weight) || null,
        height: Number(profileData.height) || null,
      };

      await Promise.all([
        updateProfile(profilePayload),
        updateUser(userDetails),
      ]);

      await refreshUser();
      toast.success("Profile Saved", {
        description: "Your information has been successfully updated.",
      });
    } catch (error) {
      handleApiError(error, "Failed to save profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const userInitial =
    (user?.first_name?.charAt(0).toUpperCase() as string +
      user?.last_name?.charAt(0).toUpperCase()) || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and fitness preferences.
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Overview and User Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage
                  src={profileData.image || undefined}
                  alt={user?.username}
                />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {userDetails.first_name} {userDetails.last_name}
                </h3>
                <p className="text-muted-foreground">{userDetails.email}</p>
              </div>
              <div className="w-full flex justify-around pt-2">
                <div className="text-center">
                  <div className="font-bold">
                    {profileData.current_weight || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">kg</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profileData.height || "-"}</div>
                  <div className="text-xs text-muted-foreground">cm</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">
                    {profileData.bmi?.toFixed(1) || "-"}
                  </div>
                  <div className="text-xs text-muted-foreground">BMI</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> Personal
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={userDetails.first_name}
                    onChange={(e) =>
                      handleUserDetailsChange("first_name", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={userDetails.last_name}
                    onChange={(e) =>
                      handleUserDetailsChange("last_name", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={userDetails.username}
                  onChange={(e) =>
                    handleUserDetailsChange("username", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) =>
                    handleUserDetailsChange("email", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2: Fitness Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Fitness Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploadAvatar
                defaultImage={profileData.image as string}
                onImageChange={(image) => handleProfileChange("image", image)}
              />
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profileData.age || ""}
                    onChange={(e) => handleProfileChange("age", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profileData.current_weight || ""}
                    onChange={(e) =>
                      handleProfileChange("current_weight", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profileData.height || ""}
                    onChange={(e) =>
                      handleProfileChange("height", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Gender</Label>
                <Select
                  value={profileData.gender as string}
                  onValueChange={(v) => handleProfileChange("gender", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender..." />
                  </SelectTrigger>
                  <SelectContent className="glass-popover">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Dietary Preferences</Label>
                <Textarea
                  value={profileData.dietary_preferences || ""}
                  onChange={(e) =>
                    handleProfileChange("dietary_preferences", e.target.value)
                  }
                  placeholder="e.g., vegetarian, no nuts..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Activity & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Activity Level</Label>
                <RadioGroup
                  value={profileData.activity_level}
                  onValueChange={(v) =>
                    handleProfileChange("activity_level", v)
                  }
                  className="space-y-1"
                >
                  {[
                    "sedentary",
                    "lightly_active",
                    "moderately_active",
                    "very_active",
                  ].map((level) => (
                    <Label
                      key={level}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                    >
                      <RadioGroupItem value={level} />{" "}
                      {level
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Fitness Goal</Label>
                <RadioGroup
                  value={profileData.goal}
                  onValueChange={(v) => handleProfileChange("goal", v)}
                  className="space-y-1"
                >
                  {["weight_loss", "maintenance", "muscle_gain"].map((goal) => (
                    <Label
                      key={goal}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                    >
                      <RadioGroupItem value={goal} />{" "}
                      {goal
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="cyber-button min-w-40"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
