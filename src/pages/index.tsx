import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import LanguagePicker from "../components/LanguagePicker"; // Import the LanguagePicker component

// Define types for the API response
interface Thumbnail {
  source: string;
}

interface ImageItem {
  title: string;
}

interface ImageInfo {
  url: string;
}

interface FilePage {
  imageinfo?: ImageInfo[];
}

interface Page {
  title: string;
  extract: string;
  thumbnail?: Thumbnail;
  missing?: boolean;
  extlinks?: { "*": string }[];
  images?: ImageItem[]; // Add images to the Page type
}

interface QueryResult {
  query?: { pages: Record<string, Page> };
}

interface SearchResult {
  title: string;
  extract: string;
  image: string | null;
  references: { ["*"]: string }[];
  images: string[]; // Array to store image URLs
}

const Home: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>("en"); // State to track selected language

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
        `https://${language}.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages|extlinks|images&titles=${query}&exintro=1&pithumbsize=500`
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
        // Fetch image URLs from imageinfo API
        const imageUrls: string[] = [];

        if (page.images) {
          for (const img of page.images) {
            const imageTitle = img.title.replace(/^File:/, ""); // Remove "File:" prefix
            // Use the imageinfo API to get the actual image URL
            const fileResponse = await fetch(
              `https://${language}.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url&titles=File:${encodeURIComponent(imageTitle)}`
            );
            const fileData = await fileResponse.json();

            // Use the FilePage type for the response
            const filePage = fileData.query?.pages;
            const file = filePage ? Object.values(filePage)[0] : null;

            // Check if file has imageinfo and is not null
            if (file && file.imageinfo && file.imageinfo[0]) {
              const fileInfo = file.imageinfo[0];
              const imageUrl = fileInfo.url; // Actual image URL

              // Check if the URL is valid and add it to the imageUrls array
              if (imageUrl) {
                imageUrls.push(imageUrl);
              }
            }
          }
        }

        setResult({
          title: page.title,
          extract: page.extract || "No description available.",
          image: page.thumbnail ? page.thumbnail.source : null,
          references: page.extlinks || [],
          images: imageUrls, // Store the image URLs in the result
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
    "GitHub",
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

          {/* Language Picker */}
          <div className="px-6 py-4 border-b border-gray-600">
            <LanguagePicker language={language} setLanguage={setLanguage} />
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
              <p className="text-white mb-4">
                Start by typing a search term or try one of these example search terms:
              </p>
              <p className="text-white mb-4">
                {exampleSearchTerms.join(" • ")}
              </p>
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
                        <li key={index} className="p-4 border rounded-lg hover:shadow-lg transition">
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

                  {/* Images Section */}
                  {result.images.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-white">Images:</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {result.images.map((imageUrl, index) => (
                          <div key={index} className="w-full h-auto rounded-lg overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={`Image ${index + 1}`}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
