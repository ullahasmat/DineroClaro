export interface AIAssistant {
  id: string;
  user_id: string;
  llm_model: string;
  language: string;
  active_screen: string;
  last_topic: string;
  life_stage_context: string;
  last_session: Date;
}

export type ConversationRole = 'user' | 'assistant' | 'system';

export interface Conversation {
  id: string;
  assistant_id: string;
  role: ConversationRole;
  message: string;
  screen_context: string;
  category: string;
  language_used: string;
  timestamp: Date;
}
