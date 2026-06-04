import { describe, expect, it } from "vitest";
import {
  buildCommentTree,
  getNextLikeState,
  normalizeLikeTarget,
  validateCommentBody,
  type FlatComment,
} from "../lib/interactions/model";
import { parseAdminEmails, isAdminEmail } from "../lib/admin";
import { calculateTrendingScore, normalizeTags, validatePostInput } from "../lib/blog/model";

describe("admin email helpers", () => {
  it("parses comma-separated admin emails case-insensitively", () => {
    expect(parseAdminEmails("A@example.com, b@example.com ,,")).toEqual(["a@example.com", "b@example.com"]);
    expect(isAdminEmail("A@example.com", "a@example.com,b@example.com")).toBe(true);
    expect(isAdminEmail("c@example.com", "a@example.com,b@example.com")).toBe(false);
  });
});

describe("validateCommentBody", () => {
  it("normalizes useful comments and rejects empty or oversized comments", () => {
    expect(validateCommentBody("  保持真实感很重要。  ")).toEqual({
      ok: true,
      body: "保持真实感很重要。",
    });
    expect(validateCommentBody("   ")).toEqual({
      ok: false,
      error: "评论不能为空",
    });
    expect(validateCommentBody("a".repeat(1001))).toEqual({
      ok: false,
      error: "评论不能超过 1000 字",
    });
  });
});

describe("getNextLikeState", () => {
  it("toggles counts without allowing negative totals", () => {
    expect(getNextLikeState({ likedByViewer: false, likeCount: 3 })).toEqual({
      likedByViewer: true,
      likeCount: 4,
    });
    expect(getNextLikeState({ likedByViewer: true, likeCount: 3 })).toEqual({
      likedByViewer: false,
      likeCount: 2,
    });
    expect(getNextLikeState({ likedByViewer: true, likeCount: 0 })).toEqual({
      likedByViewer: false,
      likeCount: 0,
    });
  });
});

describe("normalizeLikeTarget", () => {
  it("accepts only post and comment like targets", () => {
    expect(normalizeLikeTarget("post", "post_1")).toEqual({ ok: true, targetType: "post", targetId: "post_1" });
    expect(normalizeLikeTarget("comment", "comment_1")).toEqual({
      ok: true,
      targetType: "comment",
      targetId: "comment_1",
    });
    expect(normalizeLikeTarget("note", "note_1")).toEqual({ ok: false, error: "不支持的点赞对象" });
    expect(normalizeLikeTarget("post", " ")).toEqual({ ok: false, error: "点赞对象不存在" });
  });
});

describe("buildCommentTree", () => {
  it("nests replies under top-level comments and flattens deeper replies to one level", () => {
    const comments: FlatComment[] = [
      { id: "1", parentId: null, createdAt: "2026-05-01T00:00:00.000Z" },
      { id: "2", parentId: "1", createdAt: "2026-05-01T00:01:00.000Z" },
      { id: "3", parentId: "2", createdAt: "2026-05-01T00:02:00.000Z" },
      { id: "4", parentId: null, createdAt: "2026-05-01T00:03:00.000Z" },
    ];

    expect(buildCommentTree(comments)).toEqual([
      {
        id: "1",
        parentId: null,
        createdAt: "2026-05-01T00:00:00.000Z",
        replies: [
          { id: "2", parentId: "1", createdAt: "2026-05-01T00:01:00.000Z", replies: [] },
          { id: "3", parentId: "1", createdAt: "2026-05-01T00:02:00.000Z", replies: [] },
        ],
      },
      {
        id: "4",
        parentId: null,
        createdAt: "2026-05-01T00:03:00.000Z",
        replies: [],
      },
    ]);
  });
});

describe("post validation", () => {
  it("validates slug and normalizes tags", () => {
    expect(normalizeTags("AI, 产品,AI,, writing")).toEqual(["AI", "产品", "writing"]);
    expect(
      validatePostInput({
        title: "第一篇博客",
        slug: "first-post",
        excerpt: "摘要",
        content: "正文",
        tags: "",
        published: true,
      }),
    ).toEqual({
      ok: true,
      value: {
        title: "第一篇博客",
        slug: "first-post",
        excerpt: "摘要",
        content: "正文",
        tags: [],
        published: true,
      },
    });
    expect(
      validatePostInput({
        title: "第一篇博客",
        slug: "First Post",
        excerpt: "摘要",
        content: "正文",
        tags: "",
        published: true,
      }),
    ).toEqual({ ok: false, error: "slug 只能包含小写字母、数字和短横线" });
  });
});

describe("calculateTrendingScore", () => {
  it("weights views likes and comments", () => {
    expect(calculateTrendingScore({ views: 10, likes: 2, comments: 3 })).toBe(31);
  });
});
