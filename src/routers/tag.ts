import { Router, Request, Response } from "express";
import { TagData, TagPostData } from "../dtos/tag";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";
import parseError, { APIError } from "../utils/parseError";
import { createTag, readTagsByBlogId } from "../repositories/tag";

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
router.put("/:tagId", [authenticate, userOwnsBlog], async () => {});

/**
 * Delete a blog
 */
router.delete("/:tagId", [authenticate, userOwnsBlog], async () => {});

export default router;
