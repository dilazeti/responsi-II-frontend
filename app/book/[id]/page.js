"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookDetail({ params }) {
  const { id } = params; // Ambil ID dari URL
  const [book, setBook] = useState(null); // Detail buku
  const [loading, setLoading] = useState(true); // Status loading
  const router = useRouter(); // Untuk navigasi

  const fetchBookDetail = async () => {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch book details");
      const data = await res.json();
      setBook(data.volumeInfo); // Simpan detail buku
    } catch (error) {
      console.error("Error fetching book details:", error);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetail();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading book details...</p>;
  }

  if (!book) {
    return (
      <div className="text-center min-h-screen flex items-center justify-center">
        <div>
          <p className="text-red-500 text-lg mb-4">Failed to load book details.</p>
          <button
            className="bg-accent text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => router.push("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center font-spectral"
      style={{ backgroundColor: "#FFFFFF", color: "#000" }}
    >
      <div className="flex w-4/5 bg-white shadow-lg rounded overflow-hidden">
        {/* Gambar Buku */}
        {book.imageLinks?.thumbnail ? (
          <img
            src={book.imageLinks.thumbnail}
            alt={book.title}
            className="w-1/3 object-cover"
          />
        ) : (
          <div className="w-1/3 flex items-center justify-center bg-gray-200 text-gray-500">
            No Image
          </div>
        )}

        {/* Detail Buku */}
        <div className="w-2/3 p-6 flex flex-col justify-between">
          <div>
            {/* Judul */}
            <h1 className="text-3xl font-bold mb-2">{book.title || "Untitled"}</h1>
            {/* Penulis */}
            <p className="text-sm text-gray-500 mb-4">
              {book.authors?.join(", ") || "Unknown Author"}
            </p>
            {/* Deskripsi */}
            {book.description ? (
              <p className="text-gray-700 mb-4">{book.description}</p>
            ) : (
              <p className="text-gray-500 mb-4">No description available.</p>
            )}
          </div>

          {/* Link Terkait */}
          {book.infoLink && (
            <a
              href={book.infoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:text-gray-700"
            >
              More Info
            </a>
          )}

          {/* Tombol Back */}
          <button
            onClick={() => router.push("/")}
            className="bg-accent text-white px-4 py-2 rounded hover:bg-gray-700 mt-4 self-start"
          >
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
