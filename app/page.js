"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import router

export default function Home() {
  const [query, setQuery] = useState(""); // Query pencarian
  const [books, setBooks] = useState([]); // Daftar buku
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [totalPages, setTotalPages] = useState(1); // Total halaman
  const [isSearching, setIsSearching] = useState(false); // Apakah sedang mencari
  const router = useRouter(); // Untuk navigasi

  const limit = 6; // Jumlah buku per halaman

  // Fetch buku default: "Rou Bao Bu Chi Rou"
  const fetchDefaultBook = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=Rou%20Bao%20Bu%20Chi%20Rou&startIndex=0&maxResults=${limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setBooks(data.items || []);
      setTotalPages(Math.ceil((data.totalItems || 0) / limit));
    } catch (error) {
      console.error("Error fetching default book:", error);
    }
  };

  const fetchBooks = async (page = 1, search = false) => {
    const startIndex = (page - 1) * limit;
    const url = search
      ? `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${limit}`
      : `https://www.googleapis.com/books/v1/volumes?q=fiction&startIndex=${startIndex}&maxResults=${limit}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();

      setBooks(data.items || []);
      setTotalPages(Math.ceil((data.totalItems || 0) / limit));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchDefaultBook(); // Fetch buku default saat pertama kali dimuat
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      setIsSearching(true);
      fetchBooks(1, true); // Mulai dari halaman 1
    }
  };

  const handlePagination = (page) => {
    fetchBooks(page, isSearching); // Fetch halaman tertentu
  };

  return (
    <main
      className="min-h-screen flex font-spectral"
      style={{ backgroundColor: "#FFFFFF", color: "#000" }}
    >
      {/* Side Banner */}
      <div
        className="w-2/5 bg-cover"
        style={{
          backgroundImage: "url('/banner2.webp')", // Ganti dengan path gambar banner
        }}
      ></div>

      {/* Content Area */}
      <div className="w-3/5 p-6">
        <h1 className="text-3xl font-200 text-center mb-6">Book Library</h1>
        <div className="max-w-2xl mx-auto">
          {/* Input Pencarian */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-base"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Search
            </button>
          </div>

          {/* Informasi Status */}
          <p className="text-sm text-gray-500 mb-6">
            {isSearching
              ? `Showing results for "${query}"`
              : "Showing default book: Rou Bao Bu Chi Rou"}
          </p>

          {/* Daftar Buku */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => router.push(`/book/${book.id}`)} // Navigasi ke halaman detail
                className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-100"
              >
                {/* Gambar Buku */}
                {book.volumeInfo.imageLinks?.thumbnail ? (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title || "No title"}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 mb-4">
                    No Image
                  </div>
                )}
                {/* Judul Buku */}
                <h2 className="text-lg font-200 mb-2">
                  {book.volumeInfo.title || "Untitled"}
                </h2>
                {/* Penulis */}
                <p className="text-sm text-gray-700 mb-1">
                  {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                </p>
                {/* Tanggal Terbit */}
                <p className="text-xs text-gray-500">
                  {book.volumeInfo.publishedDate || "Year not available"}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePagination(currentPage - 1)}
              className={`px-4 py-2 bg-gray-300 rounded ${
                currentPage === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-400"
              }`}
            >
              Previous
            </button>
            <p className="text-sm">
              Page {currentPage} of {totalPages}
            </p>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePagination(currentPage + 1)}
              className={`px-4 py-2 bg-gray-300 rounded ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-400"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
