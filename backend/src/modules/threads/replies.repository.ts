import { query } from "../../db/db";
import { getThreadById } from "./thread.repository";

export async function getThreadDetailWithCount(params: {
  threadId: number;
  viewerUserId: number | null;
}) {
  const { threadId, viewerUserId } = params;

  const thread = await getThreadById(threadId);

  const likeResult = await query(
    `
      SELECT COUNT(*)::int AS count
      FROM thread_reactions
      WHERE thread_id = $1
    `,
    [threadId],
  );

  const likeCount = (likeResult.rows[0]?.count as number | undefined) ?? 0;

  const replyResult = await query(
    `
      SELECT COUNT(*)::int AS count
      from replies
      WHERE thread_id = $1
    `,
    [threadId],
  );

  const replyCount = (replyResult.rows[0]?.count as number | undefined) ?? 0;

  let viewerHasLikedThisPostOrNot = false;

  if (viewerUserId) {
    const viewerResult = await query(
      `
        SELECT 1
        FROM thread_reactions
        WHERE thread_id = $1 AND user_id = $2
        LIMIT 1
      `,
      [threadId, viewerUserId],
    );

    const count = viewerResult.rowCount ?? 0;
    if (count > 0) {
      viewerHasLikedThisPostOrNot = true;
    }
  }

  return {
    ...thread,
    likeCount,
    replyCount,
    viewerHasLikedThisPostOrNot,
  };
}
