import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: 'https://api.gptsapi.net/v1/',
  dangerouslyAllowBrowser: true
});

export async function generateStory() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative story writer. Write an engaging story suitable for children or young adults. The response should start with a title on the first line, followed by two newlines, and then the story content."
        },
        {
          role: "user",
          content: "Write a short story in English. First, provide a title for the story, then two newlines, followed by the story content. The story should be interesting and not exceed 100 words. Format example:\nTitle\n\nStory content..."
        }
      ],
      max_tokens: 5000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
} 