import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { fetchProfile, updateProfile } from "~/lib/data/fetch-profile";
import { useToast } from "~/hooks/use-toast";
import { User, MapPin } from "lucide-react";

export default function UserProfileDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchProfile,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Local state for form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    city: "Jakarta",
  });

  // Sync state when data loads
  if (profile && !formData.fullName && !formData.email) {
    // We'll initialize it safely here, but break it in handleChange
    setFormData({
      fullName: profile.full_name || "",
      email: profile.email || "",
      city: "Jakarta",
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Instead of creating a new object, we mutate the existing one
    // React won't detect this change immediately for re-renders in some cases, 
    // or it causes side effects.
    // Actually, setFormData(prev => { prev[name] = value; return prev; }) is the classic mutation bug.
    
    // Let's implement the mutation bug:
    // formData[name] = value; mutates the state directly.
    formData[name as keyof typeof formData] = value;
    setFormData(formData); // Passing same reference prevents re-render in React 18+
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend expects 'p_email', we send 'email'
    // Sending { email: ... } but backend expects p_email.
    mutation.mutate({
      userId: profile?.user_id || "current-user",
      fullName: formData.fullName,
      email: formData.email, // Error here
    });
  };

  // Mock list of cities for Bug #22
  const cities = Array.from({ length: 50 }).map((_, i) => `City ${i + 1}`);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">City</Label>
              <Popover> 
                {/* Missing modal={true} causes scroll issues in Dialog */}
                <PopoverTrigger asChild>
                  <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                    <MapPin className="mr-2 h-4 w-4" />
                    {formData.city}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="h-[200px] overflow-y-auto p-2">
                    {cities.map((city) => (
                      <div 
                        key={city} 
                        className="cursor-pointer p-2 hover:bg-accent rounded-sm text-sm"
                        onClick={() => setFormData({ ...formData, city })}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
