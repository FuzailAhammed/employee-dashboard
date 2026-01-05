import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { INDIAN_STATES } from "@/lib/employeeUtils";

const EmployeeForm = ({ open, onOpenChange, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    profileImage: "",
    state: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        gender: initialData.gender || "",
        dob: initialData.dob || "",
        profileImage: initialData.profileImage || "",
        state: initialData.state || "",
        isActive: initialData.isActive ?? true,
      });
      setImagePreview(initialData.profileImage || "");
    } else {
      setFormData({
        fullName: "",
        gender: "",
        dob: "",
        profileImage: "",
        state: "",
        isActive: true,
      });
      setImagePreview("");
    }
    setErrors({});
  }, [initialData, open]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: "Image must be less than 2MB" }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, profileImage: result }));
        setErrors((prev) => ({ ...prev, profileImage: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 2) newErrors.fullName = "Name must be at least 2 characters";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      if (dobDate >= today) newErrors.dob = "DOB must be in the past";
    }
    if (!formData.state) newErrors.state = "State is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Employee" : "Add New Employee"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={imagePreview} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {formData.fullName ? formData.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "?"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90"
              >
                <Camera className="w-4 h-4 text-primary-foreground" />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {errors.profileImage && (
              <p className="text-sm text-destructive">{errors.profileImage}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter full name"
            />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender *</Label>
            <Select
              value={formData.gender}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData((prev) => ({ ...prev, dob: e.target.value }))}
            />
            {errors.dob && <p className="text-sm text-destructive">{errors.dob}</p>}
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label>State *</Label>
            <Select
              value={formData.state}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, state: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active Status</Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {initialData ? "Update" : "Add"} Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
