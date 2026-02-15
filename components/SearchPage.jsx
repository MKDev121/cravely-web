'use client'

import { useEffect, useState } from 'react'

export default function SearchPage() {

  const [activeFilter, setActiveFilter] = useState('all')
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch('/api/search-results');
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, []);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'under100', label: 'Under \u20B9100' },
    { id: 'toprated', label: 'Top Rated' },
    { id: 'nearby', label: 'Nearby' },
    { id: 'offers', label: 'With Offers' },
  ]



  if (loading) return <div className="page-content">Loading results...</div>;
  if (error) return <div className="page-content">Error: {error}</div>;

  return (
    <div className="page-content" key="search">
      <div className="section-label">Search</div>
      <h2 className="section-title">What are you craving?</h2>
      <p className="section-desc">
        Search any dish and compare prices, ratings, and distance across restaurants near you.
      </p>

      <div className="search-box">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder='Try "momos", "biryani", "maggi"...' />
      </div>

      <div className="filter-row">
        {filters.map(f => (
          <button
            key={f.id}
            className={'filter-chip' + (activeFilter === f.id ? ' active' : '')}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="section-label">Results for "Momos"</div>
      <div className="result-list">
        {results.length === 0 ? (
          <div>No results found.</div>
        ) : (
          results.map((r, i) => (
            <div className="result-card" key={r._id || i}>
              <div className="result-top">
                <div>
                  <div className="result-name">{r.name}</div>
                  <div className="result-dish">{r.dish}</div>
                </div>
                <div className="result-price">{r.price}</div>
              </div>
              <div className="result-bottom">
                <span className="result-meta">
                  <span className="star">{'\u2605'}</span> {r.rating} ({r.reviews})
                </span>
                <span className="result-meta">{r.distance}</span>
              </div>
              {r.offer && <div className="offer-badge">{r.offer}</div>}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <span className="wip-badge">More filters coming soon</span>
      </div>
    </div>
  )
}
