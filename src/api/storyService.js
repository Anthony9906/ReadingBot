import OpenAI from 'openai';
import { supabase } from '../lib/supabase';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: 'https://api.gptsapi.net/v1/',
  dangerouslyAllowBrowser: true
});

export async function getUserStories(userId) {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user stories:', error);
    throw error;
  }
}

export async function generateAndSaveStory(userId, lexile) {
  try {
    const lexileNum = parseInt(lexile.replace('L', ''));
    let complexity = 'simple';
    if (lexileNum > 500) complexity = 'intermediate';
    if (lexileNum > 1000) complexity = 'advanced';

    const prompt = `Generate a ${complexity} level English story suitable for readers at ${lexile} Lexile level. 
    The story should be engaging and include:
    - A clear beginning, middle, and end
    - 3 or 5 Age-appropriate vocabulary
    - Proper paragraph structure
    - A meaningful message or lesson about family, animals, friendship, and love
    - Length should be appropriate for the Lexile level(no more than 100 words for simple, 200 words for intermediate, 300 words for advanced)
    - 5 questions and answers for the story

    Return the story in the following JSON format (without any markdown code block markers):
    {
      "title": "Story Title",
      "content": "Story content with proper paragraphs",
      "vocabulary": ["word1", "word2", "word3"],
      "questions": [
        {"question": "Comprehension question 1?", "answer": "Answer 1"},
        {"question": "Comprehension question 2?", "answer": "Answer 2"}
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional educational content creator. Always return responses in clean JSON format without any markdown formatting or code block markers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    // 清理返回的内容，移除可能的 markdown 标记
    let content = response.choices[0].message.content;
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // 尝试解析 JSON
    let storyData;
    try {
      storyData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse story data:', content);
      throw new Error('Invalid story format returned from AI');
    }

    // 保存故事到数据库
    const { data, error } = await supabase
      .from('stories')
      .insert([
        {
          user_id: userId,
          title: storyData.title,
          content: storyData.content,
          vocabulary: storyData.vocabulary,
          questions: storyData.questions,
          lexile_level: lexile,
          created_at: new Date()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
} 