export interface Lesson {
  id: string;
  module_name: string;
  language: string;
  level: string;
  category: string;
  screen_route: string;
  xp_reward: number;
  duration_minutes: number;
}

export interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  completion_pct: number;
  xp_earned: number;
  completed_at: Date;
}
