import { Router, Request, Response } from "express";
import { TagData, TagPostData } from "../dtos/tag";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";
import parseError, { APIError } from "../utils/parseError";
import {
  createTag,
  deleteTag,
  findTagByName,
  readTagsByBlogId,
  updateTag,
} from "../repositories/tag";
import { TAG } from "../settings/constants";

type TagResponse =
  | {
      tag: TagData;
    }
  | {
      tags: TagData[];
    };

const router = Router();

router.get("/check", (req, res) => {
  res.send("Tag router is working.");
});

/**
 * Get all tags for a blog
 */
router.get("/", async (req: Request, res: Response<TagResponse | APIError>) => {
  const { blog } = req;
  try {
    if (!blog)
      return res.json({
        tags: [],
      });
    const tags = await readTagsByBlogId(blog.id);
    res.json({ tags });
  } catch (err: any) {
    res.status(500).json(parseError(err));
  }
});

/**
 * Create a tag for a blog
 */
router.post(
  "/",
  [authenticate, userOwnsBlog],
  async (
    req: Request<any, any, { tag: TagPostData }>,
    res: Response<TagResponse | APIError>
  ) => {
    try {
      const { blog } = req;
      const { tag } = req.body;
      const foundTag = await findTagByName(tag.name, blog?.id);
      if (foundTag) throw new Error(TAG.NAME_IN_USE);
      const newTag = await createTag({
        ...tag,
        blogId: blog?.id,
      });
      res.json({ tag: newTag });
    } catch (err: any) {
      res.status(500).json(parseError(err));
    }
  }
);

/**
 * Update a tag
 */
router.put(
  "/:tagId",
  [authenticate, userOwnsBlog],
  async (
    req: Request<
      { address?: string; blogId?: string; tagId: string },
      any,
      { tag: Partial<TagPostData> }
    >,
    res: Response<TagResponse | APIError>
  ) => {
    try {
      const { blog } = req;
      const { tagId } = req.params;
      const { tag } = req.body;
      if (tag.name && blog?.id) {
        const foundTag = await findTagByName(tag.name, blog.id);
        if (foundTag && foundTag.id !== tagId) {
          throw new Error(TAG.NAME_IN_USE);
        }
      }
      const updatedTag = await updateTag(tagId, tag, blog?.id);
      if (!updatedTag) return res.status(404).send();
      res.json({
        tag: updatedTag,
      });
    } catch (err) {
      res.status(500).json(parseError(err));
    }
  }
);

/**
 * Delete a blog
 */
router.delete(
  "/:tagId",
  [authenticate, userOwnsBlog],
  async (
    req: Request<{ address?: string; blogId?: string; tagId: string }>,
    res: Response<TagResponse | APIError>
  ) => {
    try {
      const deletedTag = await deleteTag(req.params.tagId);
      if (!deletedTag) return res.status(404).send();
      res.json({ tag: deletedTag });
    } catch (err: any) {
      res.status(500).json(parseError(err));
    }
  }
);

export default router;