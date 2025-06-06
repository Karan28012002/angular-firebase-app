export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7020/api/', // <-- Set your actual API base URL here
  liveEmailUrl: 'https://moco-backend-production.up.railway.app/api/user', // Add your live backend URL if needed for other services
  imageUploadUrl:"https://moco-backend-production.up.railway.app/api/image/upload-image",
  imageLimitUpload:"https://moco-backend-production.up.railway.app/api/image/check-upload-limit",
  getUserImages:"https://moco-backend-production.up.railway.app/api/image/get-images-by-user",
  googleClientId:
    '363830819140-atec33qdi3mfn66pumqmq2b2q73r1efo.apps.googleusercontent.com',
  googleApiKey: 'AIzaSyAWKYbj82z1Ti_AkeJCjV4tSWf-fhXNQ-A', // Your Google API Key
  supabaseUrl:"https://nzbynuaezvtecuqvlmtc.supabase.co",
  supabaseKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YnludWFlenZ0ZWN1cXZsbXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMDYwMjQsImV4cCI6MjA2NDY4MjAyNH0.ZS_XHTTvkPlBxdvG39osF7KIZFJ3b1_qgEAdiU-6zDo",
  convertImageUrl: 'YOUR_BACKEND_IMAGE_CONVERSION_URL', // <-- Add your backend image conversion API endpoint here
  imageConversionApiUrl: 'YOUR_IMAGE_CONVERSION_API_ENDPOINT', // <-- Add the actual endpoint for the conversion service
  imageConversionApiKey: 'YOUR_IMAGE_CONVERSION_API_KEY' // <-- Add your API key for the conversion service (if required)
};
