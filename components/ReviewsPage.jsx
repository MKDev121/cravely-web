"use client"

import { useEffect, useState } from 'react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [upvotes, setUpvotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(data);
        // Initialize upvotes from DB
        const upvoteMap = {};
        data.forEach((r, i) => {
          upvoteMap[i] = r.upvotes || 0;
        });
        setUpvotes(upvoteMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  function handleUpvote(index) {
    setUpvotes(prev => ({ ...prev, [index]: (prev[index] || 0) + 1 }));
    // Optionally, send upvote to backend here
  }

  if (loading) return <div className="page-content">Loading reviews...</div>;
  if (error) return <div className="page-content">Error: {error}</div>;

  return (
    <div className="page-content" key="reviews">
      <div className="section-label">Reviews</div>
      <h2 className="section-title">What students are saying</h2>
      <p className="section-desc">
        Real reviews from verified college students. No fake ratings, no paid promotions.
      </p>

      <div style={{ marginBottom: '16px' }}>
        <span className="wip-badge">Review submission form coming soon</span>
      </div>

      <div className="reviews-grid">
        {reviews.length === 0 ? (
          <div>No reviews available.</div>
        ) : (
          reviews.map((r, i) => (
            <div className="review-card" key={r._id || i}>
            <div className="review-header">
              <div className="reviewer">
                <div className="reviewer-avatar" style={{
                  background: i === 0 ? '#E8652D' : i === 1 ? '#F59E0B' : '#1A1A2E'
                }}>
                  {r.initials}
                </div>
                <div>
                  <div className="reviewer-name">{r.name}</div>
                  <div className="reviewer-date">{r.date}</div>
                </div>
              </div>
              <div className="review-stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} style={{ opacity: s < r.stars ? 1 : 0.2 }}>{'\u2605'}</span>
                ))}
              </div>
            </div>

            <p className="review-text">{r.text}</p>

            <div className="review-tags">
              {r.tags.map((tag, t) => (
                <span className="review-tag" key={t}>{tag}</span>
              ))}
            </div>

            <div className="review-actions">
              <button className="review-action-btn" onClick={() => handleUpvote(i)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
                  <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                </svg>
                Helpful ({upvotes[i] || 0})
              </button>
              <button className="review-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                Reply
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
        <p>Photo reviews and the review form are not built yet.</p>
      </div>
    </div>
  )
}
