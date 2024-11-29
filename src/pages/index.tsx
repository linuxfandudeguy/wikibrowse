import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

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
  const [suggestions, setSuggestions] = useState<{ title: string; url: string }[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState<boolean>(false);

  const searchWikipedia = async () => {
    if (!query.trim()) {
      setError("Please enter a search term.");
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
      const data: any = await response.json();

      if (!data.query) {
        setError("No results found.");
        return;
      }

      const pages = data.query.pages;
      const page = Object.values(pages)[0];

      if (!page || page.missing) {
        setError("No results found.");
      } else {
        setResult({
          title: page.title,
          extract: page.extract || "No description available.",
          image: page.thumbnail ? page.thumbnail.source : null,
          references: page.extlinks || [],
        });
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
      return;
    }

    setIsSuggestionsVisible(true);
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=${searchTerm}`
      );
      const data: any = await response.json();

      const titles = data[1]; // Titles are at index 1
      const urls = data[3];   // URLs are at index 3

      // Process titles and URLs into a usable format
      const processedSuggestions = titles.map((title: string, index: number) => ({
        title,
        url: urls[index] || "",
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
      setIsLandingPage(false);
    }
    fetchSuggestions(newQuery);
  };

  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    setIsSuggestionsVisible(false);
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
                    onClick={() => handleSuggestionClick(suggestion.title)} // Set clicked suggestion as query
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
                        width={500}
                        height={300}
                        className="w-full h-auto mb-4 rounded-lg"
                      />
                    )}
                    <h2 className="text-2xl font-bold text-black">{result.title}</h2>
                    <div
                      className="mt-2 text-black"
                      dangerouslySetInnerHTML={{ __html: result.extract }}
                    />
                  </div>

                  {/* References */}
                  <div className="border-l pl-6">
                    <h3 className="text-lg font-semibold mb-4 text-black">References:</h3>
                    {result.references.length > 0 ? (
                      <ul className="space-y-2">
                        {result.references.map((ref, index) => (
                          <li key={index}>
                            <a
                              href={ref["*"]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500"
                            >
                              {formatURL(ref["*"])}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No references found.</p>
                    )}
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
