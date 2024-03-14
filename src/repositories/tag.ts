import { TagPostData, TagNewData, TagData } from "../dtos/tag";
import Article from "../models/article";
import Tag from "../models/tag";

/**
 * Create a tag
 * @param tag
 * @returns The tag created
 */
export const createTag = async (tag: TagNewData): Promise<TagData> => {
  const newTag = new Tag(tag);
  await newTag.save();
  return newTag.mapToTagData();
};

/**
 * Get a tag by id
 * If blogId exists, restrict to getting the tag with the id under the blog.
 * @param tagId
 * @param blogId
 * @returns The tag if found or null otherwise.
 */
export const readTagById = async (
  id: string,
  blogId?: string
): Promise<TagData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const tag = await Tag.findOne(filter);
  return tag?.mapToTagData() || null;
};

/**
 * Get the tags for a blog.
 * If blogId not provided, get all tags.
 * @param blogId
 * @returns The tags under the blog with the given id.
 */
export const readTags = async (blogId: string): Promise<TagData[]> => {
  const filter: { blogId?: string } = {};
  if (blogId) filter.blogId = blogId;
  const tags = await Tag.find(filter);
  return (tags || []).map((t) => t.mapToTagData());
};

/**
 * Update a tag by id
 * blogId is optional. If it exists, it restricts to updating the tag under a particular blog.
 * @param id
 * @param tag
 * @param blogId
 * @returns Updated tag or null if the tag is not found.
 */
export const updateTag = async (
  id: string,
  tag: Partial<TagPostData>,
  blogId?: string
): Promise<TagData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const updatedTag = await Tag.findOneAndUpdate(
    filter,
    {
      $set: tag,
    },
    {
      runValidators: true,
      returnDocument: "after",
    }
  );
  return updatedTag?.mapToTagData() || null;
};

/**
 * Delete a tag
 * @param id
 * @param blogId Optional. If blogId is given, find the tag in the blog.
 * @returns The deleted tag data.
 */
export const deleteTag = async (
  id: string,
  blogId?: string
): Promise<TagData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const deletedTag = await Tag.findOneAndDelete(filter);
  return deletedTag?.mapToTagData() || null;
};

/**
 * Given blog id and a tag name, find out the tag by name in the given blog.
 * @param tagName,
 * @param blogId Optional. If blogId is given, find the tag in the blog.
 * @returns The tag found or null if not found
 */
export const findTagByName = async (
  tagName: string,
  blogId?: string
): Promise<TagData | null> => {
  const filter: { name: string; blogId?: string } = { name: tagName };
  if (blogId) filter.blogId = blogId;
  const tag = await Tag.findOne(filter);
  return tag?.mapToTagData() || null;
};

export const tagHasArticlesReferenced = async (
  id: string,
  blogId: string
): Promise<boolean> => {
  const count = await Article.countDocuments({
    blogId,
    tagIds: { $in: [id] },
  });
  return count >= 1;
};
