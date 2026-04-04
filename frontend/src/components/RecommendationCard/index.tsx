import React from 'react';

interface Props {
  title: string;
  summary: string;
  actionUrl?: string | null;
}

export default function RecommendationCard({ title, summary, actionUrl }: Props) {
  return (
    <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: 8 }}>
      <h3 style={{ margin: '0 0 0.5rem 0' }}>{title}</h3>
      <p style={{ margin: 0 }}>{summary}</p>
      {actionUrl && (
        <p style={{ marginTop: '0.5rem' }}>
          <a href={actionUrl} target="_blank" rel="noreferrer">
            Take action
          </a>
        </p>
      )}
    </div>
  );
}
