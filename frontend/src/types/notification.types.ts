export type NotificationType =
  | 'payment_due'
  | 'lesson_reminder'
  | 'credit_alert'
  | 'recommendation'
  | 'general';

export interface PushNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  sent_at: Date;
}
