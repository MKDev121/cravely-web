'use client'


import { useEffect, useState } from 'react';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('/api/offers');
        if (!res.ok) throw new Error('Failed to fetch offers');
        const data = await res.json();
        setOffers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  if (loading) return <div className="page-content">Loading offers...</div>;
  if (error) return <div className="page-content">Error: {error}</div>;

  return (
    <div className="page-content" key="offers">
      <div className="section-label">Live Offers</div>
      <h2 className="section-title">Deals near your campus</h2>
      <p className="section-desc">
        Time-bound, student-only offers funded by restaurants. Claim before they expire.
      </p>

      <div className="offers-grid">
        {offers.length === 0 ? (
          <div>No offers available.</div>
        ) : (
          offers.map((o, i) => (
            <div className="offer-card" key={o._id || i}>
              <div className="offer-restaurant">{o.restaurant}</div>
              <div className="offer-title">{o.title}</div>
              <div className="offer-detail">{o.detail}</div>
              <div className="offer-footer">
                <span className="offer-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {o.time}
                </span>
                <button className="offer-claim-btn">Claim</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="divider"></div>

      <div style={{ marginBottom: '12px' }}>
        <span className="wip-badge">Geo-fencing not implemented</span>
      </div>

      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <p>Location-based offer filtering is not built yet.</p>
      </div>
    </div>
  )
}
