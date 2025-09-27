"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { BsUpload, BsEye, BsEyeSlash, BsLock } from "react-icons/bs";
import Loading from "@/components/Others/Loading";
import { format } from "date-fns";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { store } from "@/redux/store";
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useChangePasswordMutation,
} from "@/redux/api/auth/authApi";

export default function ProfileForm() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { user } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.user
  );

  const { data, isLoading, error, refetch } = useGetUserProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProfileImageMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (data?.data) {
      setFormData({
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        location: data.data.location || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [data]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return toast.error("Seleziona prima un'immagine");
    try {
      const fd = new FormData();
      fd.append("profileImage", selectedImage);
      await uploadImage(fd).unwrap();
      toast.success("Immagine del profilo aggiornata con successo!");
      setSelectedImage(null);
      setPreviewImage(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Caricamento immagine fallito");
    }
  };

  const handleSaveChanges = async () => {
    try {
      let hasChanges = false;

      // Only update profile if firstName, lastName, or location changed
      const updateData: any = {};
      if (formData.firstName !== data?.data.firstName)
        updateData.firstName = formData.firstName;
      if (formData.lastName !== data?.data.lastName)
        updateData.lastName = formData.lastName;
      if (formData.location !== data?.data.location)
        updateData.location = formData.location;

      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData).unwrap();
        toast.success("Profilo aggiornato con successo!");
        hasChanges = true;
        refetch();
      }

      // Only change password if both old and new passwords are filled
      if (formData.oldPassword && formData.newPassword) {
        await changePassword({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }).unwrap();
        toast.success("Password cambiata con successo!");
        setFormData((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.error("Nessuna modifica da salvare");
        return;
      }

      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Qualcosa è andato storto");
    }
  };

  const handleCancel = () => {
    if (data?.data) {
      setFormData({
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        location: data.data.location || "",
        oldPassword: "",
        newPassword: "",
      });
    }
    setSelectedImage(null);
    setPreviewImage(null);
    setIsEditing(false);
  };

  const getProfileImage = () => {
    if (previewImage) return previewImage;
    if (data?.data?.image) return data.data.image;
    if (user?.image) return user.image;
    return "/images/profile.jpg";
  };

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-center text-red-500">
        Caricamento profilo fallito
      </div>
    );

  return (
    <div className="bg-card p-4 md:p-6 lg:p-6">
      <div className="bg-white p-4 md:p-6 lg:p-8 rounded-[20px]">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-accent mb-2">
            Informazioni Personali
          </h2>
          <p className="text-info">
            Carica la tua foto e le informazioni personali qui
          </p>
          <hr className="mt-4 border-1 border-gray-200" />
        </div>

        {/* Photo */}
        <div>
          <div className="mb-8 flex md:flex-row flex-col items-center md:justify-between justify-start">
            <div>
              <h3 className="text-lg font-medium text-accent mb-2">
                La Tua Foto
              </h3>
              <p className="text-sm text-info mb-4">
                Questa foto sarà visualizzata nel tuo profilo
              </p>
            </div>
            <div className="flex md:flex-row flex-col-reverse items-center gap-6">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary/90 cursor-pointer"
                >
                  <BsUpload className="text-xl" /> Carica Foto
                </button>
                {selectedImage && (
                  <button
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    className="bg-primary/90 text-white px-6 py-3 rounded-lg hover:bg-primary/80"
                  >
                    {isUploading ? "Caricamento..." : "Salva Immagine"}
                  </button>
                )}
              </div>
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                <Image
                  src={getProfileImage()}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-8 border-b border-gray-200 pb-8 pt-8 flex items-center">
          <div className="w-1/3">
            <label className="block text-base font-semibold text-accent">
              Nome
            </label>
          </div>
          <div className="w-2/3 flex gap-4">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Nome"
            />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Cognome"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-8 border-b border-gray-200 pb-8 flex items-center">
          <div className="w-1/3">
            <label className="block text-base font-semibold text-accent">
              Email
            </label>
          </div>
          <div className="w-2/3 relative">
            <input
              type="email"
              value={data?.data?.email}
              readOnly
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg cursor-not-allowed"
            />
            <BsLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Location */}
        <div className="mb-8 border-b border-gray-200 pb-8 flex items-center">
          <div className="w-1/3">
            <label className="block text-base font-semibold text-accent">
              Posizione
            </label>
          </div>
          <div className="w-2/3">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Posizione"
            />
          </div>
        </div>

        {/* Membership */}
        <div className="mb-8 border-b border-gray-200 pb-8 flex items-center">
          <div className="w-1/3">
            <label className="block text-base font-semibold text-accent">
              Fine Abbonamento
            </label>
          </div>
          {data?.data?.Subscription[0]?.endDate ? (
            <div className="w-2/3 flex gap-4">
              <input
                type="text"
                value={format(
                  new Date(data?.data?.Subscription[0].endDate),
                  "MMM dd, yyyy"
                )}
                readOnly
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <input
                type="text"
                value={data?.data?.Subscription[0].plan.publicName}
                readOnly
                className="w-1/2 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          ) : (
            "N/A"
          )}
        </div>

        {/* Change Password */}
        <div className="mb-8 border-b border-gray-200 pb-8 flex flex-col md:flex-row md:items-center">
          {/* Label */}
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <label className="block text-base font-semibold text-accent">
              Cambia Password
            </label>
          </div>

          {/* Inputs */}
          <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-4">
            {/* Old Password */}
            <div className="w-full md:w-1/2 relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={formData.oldPassword}
                onChange={(e) =>
                  handleInputChange("oldPassword", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Vecchia Password"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showOldPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>

            {/* New Password */}
            <div className="w-full md:w-1/2 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Nuova Password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showNewPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            disabled={isUpdating || isUploading || isChangingPassword}
            className="px-6 py-3 border border-accent text-accent rounded-lg cursor-pointer"
          >
            Annulla
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={
              isUpdating || isUploading || isChangingPassword || !isEditing
            }
            className="px-6 py-3 bg-primary text-white rounded-lg cursor-pointer"
          >
            {isUpdating || isChangingPassword ? "Salvataggio..." : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}
