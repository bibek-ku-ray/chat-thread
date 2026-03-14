import { Router } from "express";
import {
  createdThread,
  listCategories,
} from "../modules/threads/thread.repository";
import { getAuth } from "@clerk/express";
import { BadRequestError, UnauthorizedError } from "../lib/error";
import z from "zod";
import { getUserFromClerk } from "../modules/users/user.service";
import { getThreadDetailWithCount } from "../modules/threads/replies.repository";

export const threadsRouter = Router();

const CreateThreadSchema = z.object({
  title: z.string().trim().min(5).max(200),
  body: z.string().trim().min(10).max(2000),
  categorySlug: z.string().trim().min(1),
});

threadsRouter.get("/categories", async (_req, res, next) => {
  try {
    const listOfCategories = await listCategories();

    res.json({
      data: listOfCategories,
    });
  } catch (error) {
    next(error);
  }
});

threadsRouter.post("/threads", async (req, res, next) => {
  try {
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const parsedBody = CreateThreadSchema.parse(req.body);

    const profile = await getUserFromClerk(auth.userId);

    const newlyCreatedThread = await createdThread({
      categorySlug: parsedBody.categorySlug,
      authorUserId: profile.user.id,
      title: parsedBody.title,
      body: parsedBody.body,
    });

    res.status(201).json({ data: newlyCreatedThread });
  } catch (error) {
    next(error);
  }
});

threadsRouter.get("/threads/:id", async (req, res, next) => {
  try {
    const threadId = Number(req.params.id);

    if (!Number.isInteger(threadId) || threadId <= 0) {
      throw new BadRequestError("Invalid thread id");
    }

    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const profile = await getUserFromClerk(auth.userId);
    const viewerUserId = profile.user.id;

    const thread = await getThreadDetailWithCount({ threadId, viewerUserId });

    res.json({
      data: thread,
    });
  } catch (error) {
    next(error);
  }
});
