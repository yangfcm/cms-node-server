describe("Test comment routers", () => {
  const { commentInMikeBlog1 } = globalThis.__TESTDATA__;

  describe("GET /blogs/:address/comments", () => {
    test.todo("should get comments for a particular blog");
    test.todo("should get comments for an article");
  });

  describe("GET /blogs/:address/comments/:commentId", () => {
    test.todo("should not get comment if it does not exist");
    test.todo("should get comment by id");
  });

  describe("POST /blogs/:address/comments", () => {
    test.todo("should be able to create a comment");
  });

  describe("PUT /blogs/:address/comments/:commentId", () => {
    test.todo("should not update a comment that does not exist");
    test.todo("should not update a comment in a blog that user does not own");
    test.todo("should update a comment's content");
    test.todo("should update a comment's status and isTop");
  });

  describe("DELETE /blogs/:address/comments/:commentId", () => {
    test.todo("should not delete a comment that does not exist");
    test.todo("should not delete a comment in a blog that user does not own");
    test.todo("blog owner should delete a comment");
  });
});
