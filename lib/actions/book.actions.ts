"use server";

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/bookSegment.model";

export const checkBookExists = async (title: string) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      };
    }

    return { exists: false };
  } catch (error) {
    console.error("Error checking book existence:", error);
    return { exists: false, error: error };
  }
};

export const createBook = async (data: CreateBook) => {
  try {
    await connectToDatabase();

    const slug = generateSlug(data.title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        success: true,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    // Check subscription limits before creating the book
    const book = await Book.create({ ...data, slug, totalSegments: 0 });

    return {
      success: true,
      data: serializeData(book),
    };
  } catch (error) {
    console.error("Error creating book:", error);
    return { success: false, error: error };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
) => {
  try {
    await connectToDatabase();

    console.log(
      `Saving ${segments.length} segments for book ${bookId} and clerk ${clerkId}...`,
    );

    const segmentsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        segmentIndex,
        pageNumber,
        wordCount,
        bookId,
        clerkId,
        content: text,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);

    await Book.findByIdAndUpdate(bookId, {
      totalSegments: segmentsToInsert.length,
    });

    console.log(
      `Successfully saved ${segmentsToInsert.length} segments for book ${bookId}.`,
    );

    return {
      success: true,
      data: { segmentsCreated: segmentsToInsert.length },
    };
  } catch (error) {
    console.error("Error saving book segments:", error);

    await BookSegment.deleteMany({ book: bookId });
    await Book.findById(bookId);
    console.log(
      "Deleted book and segments due to error during segment saving.",
    );

    return { success: false, error: error };
  }
};
