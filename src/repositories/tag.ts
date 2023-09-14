import { TagPostData, TagNewData, TagData } from "../dtos/tag";
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
 * @param tagId
 * @returns The tag if found or null otherwise.
 */
export const readTagById = async (tagId: string): Promise<TagData | null> => {
  const tag = await Tag.findById(tagId);
  return tag ? tag.mapToTagData() : null;
};

/**
 * Get the tags for a blog
 * @param blogId
 * @returns The tags under the blog with the given id.
 */
export const readTagsByBlogId = async (blogId: string): Promise<TagData[]> => {
  const tags = await Tag.find({ blogId });
  return tags.map((t) => t.mapToTagData());
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
  return updatedTag ? updatedTag.mapToTagData() : null;
};

/**
 * Delete a tag
 * @param id
 * @returns The deleted tag data.
 */
export const deleteTag = async (id: string): Promise<TagData | null> => {
  const deletedTag = await Tag.findByIdAndDelete(id);
  return deletedTag ? deletedTag.mapToTagData() : null;
};
