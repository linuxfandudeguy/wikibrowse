import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image"; // Import the Image component

// Define types for the API response
interface Thumbnail {
  source: string;
}

interface Page {
  title: string;
  extract: string; // This will now include raw HTML
  thumbnail?: Thumbnail;
  missing?: boolean; // The missing property exists on a page if the page doesn't exist
  extlinks?: { "*": string }[];
}

interface QueryResult {
  query?: { pages: Record<string, Page> }; // Make the query property optional
}

interface SuggestionResult {
  // Using the exact format you provided
  query: {
    search: string[];
    title: string[];
    description: string[];
    url: string[];
  };
}

interface SearchResult {
  title: string;
  extract: string;
  image: string | null;
  references: { ["*"]: string }[];
}

const Home: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<{ title: string; url: string }[]>([]); // Store suggestions
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState<boolean>(false); // To show/hide suggestions

  const searchWikipedia = async () => {
    if (!query.trim()) {
      setError("Please enter a search term. WikiSearch is a browser based off of Wikipedia.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages|extlinks&titles=${query}&exintro=1&pithumbsize=500`
      );
      const data: QueryResult = await response.json();

      // Check if data.query exists
      if (!data.query) {
        setError("No results found. Try another search.");
        return;
      }

      const pages = data.query.pages;
      const page = Object.values(pages)[0];

      // TypeScript now knows that `page` can have `missing`, `title`, `extract`, etc.
      if (!page || page.missing) {
        setError("No results found. Try another search.");
      } else {
        setResult({
          title: page.title,
          extract: page.extract || "No description available.",
          image: page.thumbnail ? page.thumbnail.source : null,
          references: page.extlinks || [],
        });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions from Wikipedia API based on input query
  const fetchSuggestions = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
      return;
    }

    setIsSuggestionsVisible(true); // Show suggestions when there's a query
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${searchTerm}`
      );
      const data: SuggestionResult = await response.json();

      // Process the data into the format you provided
      const processedSuggestions = data.query.title.map((title, index) => ({
        title,
        url: data.query.url[index],
      }));

      setSuggestions(processedSuggestions);
    } catch {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  const formatURL = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (isLandingPage) {
      setIsLandingPage(false); // Hide landing page once user starts typing
    }
    fetchSuggestions(newQuery); // Fetch suggestions as the user types
  };

  const handleSuggestionClick = (title: string) => {
    setQuery(title); // Set the clicked suggestion as query
    setIsSuggestionsVisible(false); // Hide suggestions after selection
  };

  return (
    <>
      <Head>
        <title>WikiSearch</title>
      </Head>
      <div className="h-screen w-screen bg-gray-100">
        <div className="h-full w-full max-w-screen-lg bg-white shadow-lg rounded-lg flex flex-col mx-auto">
          {/* Title Bar */}
          <div className="bg-gray-200 px-4 py-2 flex items-center justify-between border-b border-gray-300">
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <h1 className="font-semibold text-black">WikiBrowse</h1>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center px-6 py-4 border-b border-gray-300">
            <input
              type="text"
              className="flex-grow border rounded-lg px-4 py-2"
              placeholder="Enter a search term"
              value={query}
              onChange={handleSearchInput}
            />
            <button
              onClick={searchWikipedia}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-4"
            >
              Search
            </button>

            {/* Autofill Suggestions */}
            {isSuggestionsVisible && suggestions.length > 0 && (
              <ul className="absolute bg-white border w-full mt-2 max-h-60 overflow-y-auto shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion.title)} // Set the clicked suggestion as query
                  >
                    <a
                      href={suggestion.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      {suggestion.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Landing Page Content */}
          {isLandingPage && (
            <div className="flex-grow p-6 text-center">
              <h2 className="text-2xl font-bold text-black mb-4">Welcome to WikiBrowse!</h2>
              <p className="text-black mb-4">
                WikiBrowse is a browser based off of Wikipedia that helps you find information quickly.
              </p>
              <p className="text-black mb-4">Start by typing a search term or try one of these example search terms:</p>
              <ul className="list-disc text-left mx-auto space-y-2 max-w-sm">
                <li>Albert Einstein</li>
                <li>Great Wall of China</li>
                <li>JavaScript</li>
                <li>Mount Everest</li>
                <li>Wikipedia</li>
              </ul>
            </div>
          )}

          {/* Results */}
          {!isLandingPage && (
            <div className="flex-grow p-6 overflow-y-auto">
              {loading && <p className="text-center text-gray-500">Loading...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}
              {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main Content */}
                  <div>
                    {result.image && (
                      <Image
                        src={result.image}
                        alt={result.title}
                        width={500} // Define width
                        height={300} // Define height
                        className="w-full h-auto mb-4 rounded-lg"
                      />
                    )}
                    <h2 className="text-2xl font-bold text-black">{result.title}</h2>
                    <div
                      className="mt-2 text-black"
                      dangerouslySetInnerHTML={{ __html: result.extract }} // Render the extract as HTML
                    />
                  </div>

                  {/* References */}
                  <div className="border-l pl-6">
                    <h3 className="text-lg font-semibold mb-4 text-black">
                      References:
                    </h3>
                    <ul className="space-y-4">
                      {result.references.map((ref, index) => (
                        <li
                          key={index}
                          className="p-4 border rounded-lg hover:shadow-lg transition"
                        >
                          <a
                            href={ref["*"]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            <span className="font-bold">{formatURL(ref["*"])}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
