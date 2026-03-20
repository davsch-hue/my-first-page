import { useState } from 'react';

function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  function handleSearch(e) {
    e.preventDefault();

    if (!search.trim()) {
      setError('Please type something to search for.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    fetch(`https://openlibrary.org/search.json?q=${search}&limit=5`)
      .then(res => {
        if (!res.ok) throw new Error('Something went wrong');
        return res.json();
      })
      .then(data => {
        setResults(data.docs);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch results. Please try again.');
        setLoading(false);
      });
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h1>Book Search</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for a book..."
          style={{ flex: 1, padding: '8px 12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '6px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}>
          Search
        </button>
      </form>

      {error && (
        <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>
      )}

      {loading && <p>Searching...</p>}

      {!loading && hasSearched && results.length === 0 && !error && (
        <p style={{ color: '#666' }}>No results found for "{search}".</p>
      )}

      {results.map((book, index) => (
        <div key={index} style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 4px' }}>{book.title}</p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {book.author_name ? book.author_name[0] : 'Unknown author'} · {book.first_publish_year}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;