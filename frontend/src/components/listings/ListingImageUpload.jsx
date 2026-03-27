import { useState } from "react";
import { uploadMultipleImages } from "../../api/upload.service";

const ListingImageUploader = ({ value = [], onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleFileChange = async (e) => {
    const files = e.target.files;

    if (!files || !files.length) return;

    setUploading(true);
    setServerError("");

    try {
      const response = await uploadMultipleImages(files, "subletmatch/listings");
      const uploadedImages = response.data || [];
      onChange([...(value || []), ...uploadedImages]);
    } catch (error) {
      setServerError(
        error?.response?.data?.message || "Failed to upload images."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = (publicId) => {
    const filtered = (value || []).filter((img) => img.publicId !== publicId);
    onChange(filtered);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Listing Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 underline"
        />
        <p className="mt-1 text-xs text-gray-500">
          Upload JPG, PNG, or WEBP images. Maximum 10 images per upload request.
        </p>
      </div>

      {uploading ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Uploading images...
        </div>
      ) : null}

      {serverError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      ) : null}

      {value?.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {value.map((image) => (
            <div
              key={image.publicId}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <img
                src={image.url}
                alt="Listing"
                className="h-32 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(image.publicId)}
                className="w-full border-t px-3 py-2 text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ListingImageUploader;