import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customQuotes, setCustomQuotes] = useState([]); // Store custom quotes

  // Function to fetch a quote from the primary API
  const fetchPrimaryAPI = async () => {
    const options = {
      method: 'GET',
      url: 'https://quotes15.p.rapidapi.com/quotes/random/',
      params: { language_code: 'en' },
      headers: {
        'x-rapidapi-key': '3699ffec2fmsh48faaa49ce54eb8p160c50jsn419629aefbba',
        'x-rapidapi-host': 'quotes15.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      setQuote(response.data.content || 'No quote found.');
      setAuthor(response.data.originator.name || 'Unknown Author');
      setError('');
    } catch (err) {
      console.warn('Primary API failed. Switching to backup API...', err.message);
      fetchBackupAPI(); // Retry with backup API
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch a quote from the backup API
  const fetchBackupAPI = async () => {
    try {
      const response = await axios.get('https://api.quotable.io/random');
      setQuote(response.data.content || 'No quote found.');
      setAuthor(response.data.author || 'Unknown Author');
      setError('');
    } catch (err) {
      console.error('Backup API also failed.', err.message);
      setError('Failed to fetch quote. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Main function to fetch a quote
  const fetchQuote = async () => {
    setLoading(true);
    setError('');
    await fetchPrimaryAPI(); // Start with the primary API
  };

  // Function to copy the quote to the clipboard
  const copyQuote = () => {
    navigator.clipboard.writeText(`${quote} - ${author}`);
    alert('Quote copied to clipboard!');
  };

  // Function to add a new custom quote
  const addQuote = () => {
    const newQuote = prompt('Enter a new quote:');
    const newAuthor = prompt('Enter the author:');
    if (newQuote && newAuthor) {
      setCustomQuotes([...customQuotes, { quote: newQuote, author: newAuthor }]);
      alert('Quote added successfully!');
    } else {
      alert('Both quote and author are required!');
    }
  };

  // Function to delete the current quote
  const deleteQuote = () => {
    setQuote('');
    setAuthor('');
    alert('Quote deleted!');
  };

  // Fetch a quote on component mount
  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Random Quote Generator</h1>
        {loading ? (
          <div className="text-lg text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-lg">{error}</div>
        ) : (
          <>
            <p className="text-xl italic text-gray-700 mb-4">"{quote}"</p>
            <p className="text-lg text-gray-600 mb-4">- {author}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={fetchQuote}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-200"
              >
                Get New Quote
              </button>
              <button
                onClick={copyQuote}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Copy Quote
              </button>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={addQuote}
                className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
              >
                Add Quote
              </button>
              <button
                onClick={deleteQuote}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
              >
                Delete Quote
              </button>
            </div>
          </>
        )}
        {/* Display custom quotes */}
        {customQuotes.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Custom Quotes:</h2>
            {customQuotes.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-gray-700">"{item.quote}"</p>
                <p className="text-sm text-gray-600">- {item.author}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
