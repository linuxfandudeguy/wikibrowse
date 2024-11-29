import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

// Define types for the API response
interface Thumbnail {
  source: string;
}

interface Page {
  title: string;
  extract: string;
  thumbnail?: Thumbnail;
  missing?: boolean;
  extlinks?: { "*": string }[];
}

interface QueryResult {
  query?: { pages: Record<string, Page> };
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
      const data: QueryResult = await response.json();

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
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (isLandingPage) {
      setIsLandingPage(false); // Hide landing page once user starts typing
    }
  };

  const exampleSearchTerms = [
    "Albert Einstein",
    "Great Wall of China",
    "JavaScript",
    "Mount Everest",
    "Wikipedia",
    "Tailwind CSS",
    "TypeScript",
    "Next.js",
    "Vercel",
    "Github",
  ];

  return (
    <>
      <Head>
        <title>WikiBrowse</title>
      </Head>
      <div className="h-screen w-screen bg-gray-900">
        <div className="h-full w-full max-w-screen-lg bg-gray-800 shadow-lg rounded-lg flex flex-col mx-auto">
          {/* Title Bar */}
          <div className="bg-gray-700 px-4 py-2 flex items-center justify-between border-b border-gray-600">
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <h1 className="font-semibold text-white">WikiBrowse</h1>
          </div>

          {/* Search Bar */}
          <div className="flex items-center px-6 py-4 border-b border-gray-600">
            <input
              type="text"
              className="flex-grow border rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          {/* Landing Page Content */}
          {isLandingPage && (
            <div className="flex-grow p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to WikiBrowse!</h2>
              <p className="text-white mb-4">
                WikiBrowse is a browser based off of Wikipedia that helps you find information quickly.
              </p>
              <p className="text-white mb-4">Start by typing a search term or try one of these example search terms:</p>
              <ul className="list-disc text-left mx-auto space-y-2 max-w-sm">
                {exampleSearchTerms.map((term, index) => (
                  <li key={index} className="text-white">{term}</li>
                ))}
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
                    <h2 className="text-2xl font-bold text-white">{result.title}</h2>
                    <div
                      className="mt-2 text-white"
                      dangerouslySetInnerHTML={{ __html: result.extract }}
                    />
                  </div>

                  {/* References */}
                  <div className="border-l pl-6">
                    <h3 className="text-lg font-semibold mb-4 text-white">Results:</h3>
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
                            className="text-blue-500 break-words"
                          >
                            <span className="font-bold">{ref["*"]}</span>
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
