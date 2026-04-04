export interface Recommendation {
  id: string;
  category: string;
  name: string;
  provider: string;
  description: string;
  tags: string;
  target_goal: string;
  target_life_stage: string;
  featured: boolean;
}

export interface UserRecommendation {
  id: string;
  user_id: string;
  recommendation_id: string;
  dismissed: boolean;
  saved: boolean;
  shown_at: Date;
}
