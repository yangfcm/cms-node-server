import { Router, Request, Response, NextFunction } from "express";
import { TagData, TagPostData } from "../dtos/tag";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";
import {
  createTag,
  deleteTag,
  findTagByName,
  readTags,
  readTagById,
  updateTag,
} from "../repositories/tag";
import { TAG } from "../settings/constants";
import { APIError } from "../utils/parseError";

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
router.get(
  "/",
  async (req: Request, res: Response<TagResponse>, next: NextFunction) => {
    const { blog } = req;
    try {
      const tags = await readTags(blog?.id);
      res.json({ tags });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * Get one tag by id
 */
router.get(
  "/:tagId",
  async (
    req: Request<{ tagId: string }>,
    res: Response<TagResponse>,
    next: NextFunction
  ) => {
    try {
      const { tagId } = req.params;
      const { blog } = req;
      const tag = await readTagById(tagId, blog?.id);
      if (!tag) return res.status(404).send();
      res.json({ tag });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * Create a tag for a blog
 */
router.post(
  "/",
  [authenticate, userOwnsBlog],
  async (
    req: Request<any, any, { tag: TagPostData }>,
    res: Response<TagResponse | APIError>,
    next: NextFunction
  ) => {
    try {
      const { blog } = req;
      const { tag } = req.body;
      const foundTag = await findTagByName(tag.name, blog?.id);
      if (foundTag) {
        return res.status(400).json({
          message: TAG.NAME_IN_USE,
        });
      }
      const newTag = await createTag({
        ...tag,
        blogId: blog!.id,
      });
      res.json({ tag: newTag });
    } catch (err: any) {
      next(err);
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
    res: Response<TagResponse | APIError>,
    next: NextFunction
  ) => {
    try {
      const { blog } = req;
      const { tagId } = req.params;
      const { tag } = req.body;
      if (tag.name && blog?.id) {
        const foundTag = await findTagByName(tag.name, blog.id);
        if (foundTag && foundTag.id !== tagId) {
          return res.status(400).json({
            message: TAG.NAME_IN_USE,
          });
        }
      }
      const updatedTag = await updateTag(tagId, tag, blog?.id);
      if (!updatedTag) return res.status(404).send();
      res.json({
        tag: updatedTag,
      });
    } catch (err) {
      next(err);
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
    res: Response<TagResponse>,
    next: NextFunction
  ) => {
    try {
      const { blog } = req;
      const deletedTag = await deleteTag(req.params.tagId, blog?.id);
      if (!deletedTag) return res.status(404).send();
      res.json({ tag: deletedTag });
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
