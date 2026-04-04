INSERT INTO users (email, full_name, locale) VALUES
    ('demo@dineroclaro.com', 'Demo User', 'en')
ON CONFLICT (email) DO NOTHING;

INSERT INTO messages (user_id, role, content)
SELECT id, 'assistant', 'Welcome to DineroClaro! Ask me anything about your money.'
FROM users WHERE email = 'demo@dineroclaro.com'
ON CONFLICT DO NOTHING;

INSERT INTO recommendations (user_id, title, summary, action_url, priority)
SELECT id, 'Start emergency fund', 'Save $20 this week in a separate account.', NULL, 1
FROM users WHERE email = 'demo@dineroclaro.com'
ON CONFLICT DO NOTHING;
