export interface AppUser {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  preferred_language: string;
  onboarding_status: string;
  device_token?: string;
  created_at: Date;
}
