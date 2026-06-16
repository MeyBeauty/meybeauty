export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImageToCloudinary(file) {
  if (!file) throw new Error('Fichier manquant');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let msg = 'Upload Cloudinary impossible';
    try {
      const data = await res.json();
      msg = data?.error?.message || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const data = await res.json();
  return data?.secure_url || data?.url || '';
}
