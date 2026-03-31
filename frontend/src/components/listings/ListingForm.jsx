import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ListingImageUploader from "./ListingImageUpload";

const ListingForm = ({
  initialValues = null,
  onSubmit,
  submitText = "Save listing",
  loading = false,
}) => {
  const [images, setImages] = useState(initialValues?.images || []);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      currency: "USD",
      location: "",
      propertyType: "apartment",
      availabilityDate: "",
      availabilityEndDate: "",
      listedBy: "landlord",
      lifestyleTags: [],
      bedrooms: "",
      bathrooms: "",
      squareFeet: "",
      parking: false,
      petsAllowed: false,
      furnished: false,
    },
  });

  const lifestyleTags = watch("lifestyleTags") || [];

  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title || "",
        description: initialValues.description || "",
        price: initialValues.price || "",
        currency: initialValues.currency || "USD",
        location: initialValues.location || "",
        propertyType: initialValues.propertyType || "apartment",
        availabilityDate: initialValues.availabilityDate
          ? new Date(initialValues.availabilityDate).toISOString().split("T")[0]
          : "",
        availabilityEndDate: initialValues.availabilityEndDate
          ? new Date(initialValues.availabilityEndDate).toISOString().split("T")[0]
          : "",
        listedBy: initialValues.listedBy || "landlord",
        lifestyleTags: initialValues.lifestyleTags || [],
        bedrooms: initialValues.bedrooms || "",
        bathrooms: initialValues.bathrooms || "",
        squareFeet: initialValues.squareFeet || "",
        parking: initialValues.parking || false,
        petsAllowed: initialValues.petsAllowed || false,
        furnished: initialValues.furnished || false,
      });
      setImages(initialValues.images || []);
    }
  }, [initialValues, reset]);

  const handleTagToggle = (tag) => {
    const currentTags = watch("lifestyleTags") || [];

    if (currentTags.includes(tag)) {
      setValue(
        "lifestyleTags",
        currentTags.filter((t) => t !== tag)
      );
    } else {
      setValue("lifestyleTags", [...currentTags, tag]);
    }
  };

  const submitHandler = async (values) => {
    setServerError("");

    try {
      await onSubmit({
        ...values,
        price: Number(values.price),
        bedrooms: values.bedrooms ? Number(values.bedrooms) : undefined,
        bathrooms: values.bathrooms ? Number(values.bathrooms) : undefined,
        squareFeet: values.squareFeet ? Number(values.squareFeet) : undefined,
        images,
      });
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to save listing."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Basic Information Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#242B38] mb-4">Basic Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className={`w-full rounded-lg border pl-10 pr-4 py-3 outline-none focus:ring-2 transition-all ${
                  errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
                }`}
                placeholder="e.g., Modern private room in Brooklyn"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Location *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className={`w-full rounded-lg border pl-10 pr-4 py-3 outline-none focus:ring-2 transition-all ${
                  errors.location ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
                }`}
                placeholder="Brooklyn, NYC"
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Price and Currency */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                {...register("price", { required: "Price is required" })}
                className={`w-full rounded-lg border pl-7 pr-4 py-3 outline-none focus:ring-2 transition-all ${
                  errors.price ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
                }`}
                placeholder="1200"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              {...register("currency")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#242B38] mb-4">Property Details</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Property Type *
            </label>
            <select
              {...register("propertyType", { required: "Property type is required" })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
            >
              <option value="apartment">Apartment</option>
              <option value="studio">Studio</option>
              <option value="shared_room">Shared Room</option>
              <option value="private_room">Private Room</option>
              <option value="house">House</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Listed By *
            </label>
            <select
              {...register("listedBy", { required: "Listed by is required" })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
            >
              <option value="landlord">Landlord</option>
              <option value="private_lister">Private Lister</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Available From *
            </label>
            <input
              type="date"
              {...register("availabilityDate", { required: "Availability date is required" })}
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 transition-all ${
                errors.availabilityDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
              }`}
            />
            {errors.availabilityDate && (
              <p className="mt-1 text-sm text-red-600">{errors.availabilityDate.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Available To (Optional)
            </label>
            <input
              type="date"
              {...register("availabilityEndDate")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Rooms & Amenities */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#242B38] mb-4">Rooms & Amenities</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <input
              type="number"
              {...register("bedrooms")}
              min="0"
              step="1"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
              placeholder="Number of bedrooms"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bathrooms
            </label>
            <input
              type="number"
              {...register("bathrooms")}
              min="0"
              step="0.5"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
              placeholder="Number of bathrooms"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Square Feet
            </label>
            <input
              type="number"
              {...register("squareFeet")}
              min="0"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-[#3BC0E9] focus:border-transparent"
              placeholder="Square footage"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...register("parking")} className="w-4 h-4 text-[#3BC0E9] rounded" />
            Parking Available
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...register("petsAllowed")} className="w-4 h-4 text-[#3BC0E9] rounded" />
            Pets Allowed
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...register("furnished")} className="w-4 h-4 text-[#3BC0E9] rounded" />
            Fully Furnished
          </label>
        </div>
      </div>

      {/* Lifestyle Tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#242B38] mb-4">Lifestyle Tags</h2>
        <div className="flex flex-wrap gap-4">
          {["sober", "bipoc", "lgbtq_friendly", "students", "professionals", "families"].map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lifestyleTags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
                className="w-4 h-4 text-[#3BC0E9] rounded"
              />
              {tag.replace(/_/g, ' ').toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#242B38] mb-4">Description</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            rows="6"
            {...register("description", { required: "Description is required" })}
            className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 transition-all ${
              errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#3BC0E9] focus:border-transparent'
            }`}
            placeholder="Describe the property clearly. Include features, amenities, nearby attractions, and any house rules..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {watch("description")?.length || 0}/2000 characters
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#242B38] mb-4">Property Images</h2>
        <ListingImageUploader value={images} onChange={setImages} />
        <p className="mt-2 text-xs text-gray-500">
          Upload up to 10 images. First image will be used as the cover photo.
        </p>
      </div>

      {/* Error Message */}
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-[#3BC0E9] to-[#95BDCB] text-white rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </span>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;