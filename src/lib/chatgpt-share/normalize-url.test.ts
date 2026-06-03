import { describe, expect, it } from "vitest";

import { parseChatGptShareUrl } from "@/lib/chatgpt-share/normalize-url";

describe("parseChatGptShareUrl", () => {
  it("parses chatgpt.com share URL", () => {
    const { shareId, sourceUrl } = parseChatGptShareUrl(
      "https://chatgpt.com/share/6a15d917-18b8-83aa-8f37-b2d11c7c60a5",
    );
    expect(shareId).toBe("6a15d917-18b8-83aa-8f37-b2d11c7c60a5");
    expect(sourceUrl).toBe("https://chatgpt.com/share/6a15d917-18b8-83aa-8f37-b2d11c7c60a5");
  });

  it("rejects non-ChatGPT hosts", () => {
    expect(() => parseChatGptShareUrl("https://example.com/share/x")).toThrow(/ChatGPT/);
  });
});
