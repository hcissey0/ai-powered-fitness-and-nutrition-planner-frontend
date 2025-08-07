// /u/profile/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
import { User, Settings, Activity, Save, Target, Loader2, Utensils, HeartPulseIcon, CheckCircle, Trash, UserCog2, Timer, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import { updateProfile, updateUser } from "@/lib/api-service";
import { Profile, User as UserInterface } from "@/interfaces";
import { useAuth } from "@/context/auth-context";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadAvatar from "@/components/image-upload-avatar";
import { handleApiError } from "@/lib/error-handler";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import _ from 'lodash';


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

type UserDetails = Pick<
  UserInterface,
  "first_name" | "last_name" | "username" | "email"
>;

export default function ProfilePage() {
  const { user, refreshUser, deleteMyAccount } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [ confirmDeleteEmail, setConfirmDeleteEmail] = useState('');
  const [userDetails, setUserDetails] = useState<Partial<UserDetails>>({});
  const [profileData, setProfileData] = useState<Partial<Profile>>({});

  const originalProfileData = useMemo(() => user?.profile, [user])

  useEffect(() => {
    if (user) {
      setUserDetails({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        email: user.email || "",
      });
      if (user.profile) {
        console.log(user)
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
        <h1 className="text-3xl flex gap-4 items-center font-bold">
          <UserCog2 className="h-9 w-9 text-primary" />
          Profile & Settings
        </h1>
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
                    className="glass"
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
                    className="glass"
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
                  className="glass"
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
                  className="glass"
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
              <div className="flex flex-col items-center">
                <ImageUploadAvatar
                  defaultImage={profileData.image as string}
                  onImageChange={(image) => handleProfileChange("image", image)}
                />
                {!profileData.image && (
                  <p className="text-xs text-muted-foreground">
                    click to add image
                  </p>
                )}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profileData.age || ""}
                    onChange={(e) => handleProfileChange("age", e.target.value)}
                    className="glass"
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
                    className="glass"
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
                    className="glass"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Gender</Label>
                <Select
                  value={profileData.gender as string}
                  onValueChange={(v) => handleProfileChange("gender", v)}
                >
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="Select gender..." />
                  </SelectTrigger>
                  <SelectContent className="glass-popover">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Activity level and fitness goal */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Activity & Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label className="font-semibold">Activity Level:</Label>
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
                    "athlete",
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
                <Label className="font-semibold">Fitness Goal:</Label>
                <RadioGroup
                  value={profileData.goal}
                  onValueChange={(v) => handleProfileChange("goal", v)}
                  className="space-y-1"
                >
                  {[
                    "weight_loss",
                    "maintenance",
                    "muscle_gain",
                    "endurance",
                  ].map((goal) => (
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

        <div className="lg:col-span-3 flex flex-col lg:grid lg:grid-cols-2 gap-6">
          {/* Dietary Preferences */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" /> Dietary
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="dietary_preferences"
                  className="flex flex-col items-start"
                >
                  <div className="font-semibold">Dietary Restrictions:</div>
                  <div className="text-xs text-muted-foreground">
                    comma-separated (e.g., vegetarian, vegan, gluten-free,
                    halal, etc.)
                  </div>
                </Label>
                <Textarea
                  id="dietary_preferences"
                  value={profileData.dietary_preferences || ""}
                  onChange={(e) =>
                    handleProfileChange("dietary_preferences", e.target.value)
                  }
                  className="glass"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="allergies"
                  className="flex flex-col items-start"
                >
                  <div className="font-semibold">Allergies:</div>
                  <div className="text-xs text-muted-foreground">
                    comma-separated (e.g. groundnuts, corn, etc.)
                  </div>
                </Label>
                <Textarea
                  id="allergies"
                  value={profileData.allergies || ""}
                  onChange={(e) =>
                    handleProfileChange("allergies", e.target.value)
                  }
                  className="glass"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="liked_foods"
                  className="flex flex-col items-start"
                >
                  <div className="font-semibold">Foods you like best:</div>
                  <div className="text-xs text-muted-foreground">
                    comma-separated (e.g. gob3, koko, etc.)
                  </div>
                </Label>
                <Textarea
                  id="liked_foods"
                  value={profileData.liked_foods || ""}
                  onChange={(e) =>
                    handleProfileChange("liked_foods", e.target.value)
                  }
                  className="glass"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="disliked_foods"
                  className="flex flex-col items-start"
                >
                  <div className="font-semibold">Foods you don't like:</div>
                  <div className="text-xs text-muted-foreground">
                    comma-separated (e.g. banku, waakye, etc.)
                  </div>
                </Label>
                <Textarea
                  id="disliked_foods"
                  value={profileData.disliked_foods || ""}
                  onChange={(e) =>
                    handleProfileChange("disliked_foods", e.target.value)
                  }
                  className="glass"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulseIcon className="h-5 w-5 text-primary" /> Disabilities
                & Health Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="disabilities"
                  className="flex flex-col items-start"
                >
                  <div className="font-semibold">Disabilities:</div>
                  <div className="text-xs text-muted-foreground">
                    comma-separated (e.g. short-sighted, deaf etc.)
                  </div>
                </Label>
                <Textarea
                  id="disabilities"
                  value={profileData.disabilities || ""}
                  onChange={(e) =>
                    handleProfileChange("disabilities", e.target.value)
                  }
                  className="glass"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="medical_conditions"
                  className="flex flex-col items-start"
                >
                  <div className="font-semibold">Health conditions:</div>
                  <div className="text-xs text-muted-foreground">
                    comma-separated (e.g. hypertension, athsma etc.)
                  </div>
                </Label>
                <Textarea
                  id="medical_conditions"
                  value={profileData.medical_conditions || ""}
                  onChange={(e) =>
                    handleProfileChange("medical_conditions", e.target.value)
                  }
                  className="glass"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex items-center justify-between gap-4 glass p-5 rounded-xl">
          <Label className="flex flex-col items-start">
            <div className="font-semibold">Enable Tracking</div>
            <div className="text-xs text-muted-foreground">
              Allow the tracking of meals and exercises.
            </div>
          </Label>
          <Switch
            checked={profileData.tracking_enabled}
            onCheckedChange={(checked) =>
              handleProfileChange("tracking_enabled", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between gap-4 glass p-5 rounded-xl">
          <Label className="flex flex-col items-start">
            <div className="font-semibold">Track after rest timer</div>
            <div className="text-xs text-muted-foreground">
              Automatically track exercise after rest timer goes off.
            </div>
          </Label>
          <Switch
            disabled={!profileData.tracking_enabled}
            checked={profileData.track_after_rest_timer}
            onCheckedChange={(checked) =>
              handleProfileChange("track_after_rest_timer", checked)
            }
          />
        </div>
        <div className="flex items-center justify-between gap-4 glass p-5 rounded-xl">
          <Label className="flex flex-col items-start">
            <div className="font-semibold">Start rest timer after exercise</div>
            <div className="text-xs text-muted-foreground">
              Automatically track exercise after rest timer goes off.
            </div>
          </Label>
          <Switch
            disabled={!profileData.tracking_enabled}
            checked={profileData.start_rest_timer_after_exercise}
            onCheckedChange={(checked) =>
              handleProfileChange("start_rest_timer_after_exercise", checked)
            }
          />
        </div>
        <div className="flex items-center justify-between gap-4 glass p-5 rounded-xl">
          <Label className="flex flex-col items-start">
            <div className="font-semibold">Enable Calendar Notifications</div>
            <div className="text-xs text-muted-foreground">
              Allow Google Calendar to send notifications.
            </div>
          </Label>
          <Switch
            checked={profileData.notification_reminders_enabled}
            onCheckedChange={(checked) =>
              handleProfileChange("notification_reminders_enabled", checked)
            }
          />
        </div>
        <div className="flex items-center justify-between gap-4 glass p-5 rounded-xl">
          <Label className="flex flex-col items-start">
            <div className="font-semibold">Enable Email Reminders</div>
            <div className="text-xs text-muted-foreground">
              Allow Google Calendar to send Email on Nutrition and Workout plans added.
            </div>
          </Label>
          <Switch
            checked={profileData.email_reminders_enabled}
            onCheckedChange={(checked) =>
              handleProfileChange("email_reminders_enabled", checked)
            }
          />
        </div>
        <div className="flex items-center justify-between gap-4 glass p-5 rounded-xl">
          <Label className="flex flex-col items-start">
            <div className="font-semibold">Time before Email Notification</div>
            <div className="text-xs text-muted-foreground">
              Time before Google Calendar to send Email for a Workout or Nutrition event.
            </div>
          </Label>
          <Input 
          disabled={!profileData.email_reminders_enabled}
          type="number"
          min={1}
          step={1}
          value={profileData.minutes_before_email_reminder}
          // defaultValue={30}
          onChange={(e) => handleProfileChange('minutes_before_email_reminder', e.target.value)}
          className="glass max-w-20"
          />
          
        </div>
      </div>

      <div>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-4 text-primary" /> Timings
            </CardTitle>
          </CardHeader>
          <CardContent className="grid lg:grid-cols-2 gap-6">
            <div className="flex items-center justify-between gap-4">
              <Label className="flex flex-col font-bold items-start">
                🌅 BreakFast Time:
              </Label>
              <div className="flex justify-end">
                <Input
                  type="time"
                  id="breakfast_time"
                  step="1"
                  defaultValue={profileData.breakfast_time}
                  onChange={(e) =>
                    handleProfileChange("breakfast_time", e.target.value)
                  }
                  className="glass appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="lunch_time"
                className="flex flex-col items-start font-bold"
              >
                ☀️ Lunch Time:
              </Label>
              <div className="flex justify-end">
                <Input
                  type="time"
                  id="lunch_time"
                  step="1"
                  defaultValue={profileData.lunch_time}
                  onChange={(e) => handleProfileChange("lunch_time", e.target.value)}
                  className="glass appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="snack_time"
                className="flex flex-col items-start font-bold"
              >
                🍎 Snack Time:
              </Label>
              <div className="flex justify-end">
                <Input
                  type="time"
                  id="snack_time"
                  step="1"
                  defaultValue={profileData.snack_time}
                  onChange={(e) => handleProfileChange("snack_time", e.target.value)}
                  className="glass appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="dinner_time"
                className="flex flex-col items-start font-bold"
              >
                🌙 Dinner Time:
              </Label>
              <div className="flex justify-end">
                <Input
                  type="time"
                  id="dinner_time"
                  step="1"
                  defaultValue={profileData.dinner_time}
                  onChange={(e) =>
                    handleProfileChange("dinner_time", e.target.value)
                  }
                  className="glass appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label
                htmlFor="workout_time"
                className="flex gap-2 items-start font-bold"
              >
                <Dumbbell className="w-4 h-4 text-primary" /> Workout Time:
              </Label>
              <div className="flex justify-end">
                <Input
                  type="time"
                  id="workout_time"
                  step="1"
                  defaultValue={profileData.workout_time}
                  onChange={(e) =>
                    handleProfileChange("workout_time", e.target.value)
                  }
                  className="glass appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"destructive"}
              className="bg-red-500 text-foreground"
            >
              <Trash />
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete your account?
              </DialogTitle>
              <DialogDescription className="text-xs">
                This action is irreversible
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Label>Type your email to confirm</Label>
              <Input
                className="glass"
                value={confirmDeleteEmail}
                onChange={(e) => setConfirmDeleteEmail(e.target.value)}
              />
            </div>
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button
                  variant={"default"}
                  className="bg-transparent hover:bg-primary-700 text-foreground"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={async () => {
                  await deleteMyAccount();
                  toast.success("Account deleted successfully");
                }}
                variant={"destructive"}
                className="bg-red-500 hover:bg-red-900 text-foreground"
                disabled={!(userDetails.email === confirmDeleteEmail)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          onClick={handleSave}
          disabled={isLoading || _.isEqual(originalProfileData, profileData)}
          className="cyber-button text-foreground min-w-40 self-end"
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
