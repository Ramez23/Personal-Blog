import Post from "../models/postModel.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  const { title, content, category, tags } = req.body;

  if (!title || !content || title.trim() === "" || content.trim() === "") {
    return next(
      errorHandler(
        400,
        "Please provide all required fields (title and content)"
      )
    );
  }

  if (title.length < 5 || title.length > 100) {
    return next(
      errorHandler(400, "Title must be between 5 and 100 characters")
    );
  }

  if (content.length < 20) {
    return next(errorHandler(400, "Content must be at least 20 characters"));
  }

  if (category && category.length > 50) {
    return next(
      errorHandler(400, "Category name must not exceed 50 characters")
    );
  }

  if (
    tags &&
    (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))
  ) {
    return next(errorHandler(400, "Tags must be an array of strings"));
  }

  const slug = title
    .trim()
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
