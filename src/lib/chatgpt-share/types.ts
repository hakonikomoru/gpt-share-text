export type ChatGptShareMessage = {
  index: number;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
};

export type ChatGptSharePhrase = {
  phrase: string;
  count: number;
};

export type ChatGptShareBundle = {
  shareId: string;
  title: string;
  sourceUrl: string;
  importedAt: string;
  conversationId: string | null;
  model: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  attachmentNote: string | null;
  messages: ChatGptShareMessage[];
  phraseFrequency: ChatGptSharePhrase[] | null;
};
