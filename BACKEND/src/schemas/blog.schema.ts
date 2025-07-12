import { z } from "zod";
export const blogSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1, "Title cannot be empty"),
  content: z.string({ required_error: "Content is required" }).min(1, "Content cannot be empty"),
  image: z.string({ required_error: "Image is required" }).min(1, "Image cannot be empty"),
  synopsis: z.string({ required_error: "Synopsis is required" }).min(1, "Synopsis cannot be empty"),
});