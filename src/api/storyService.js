import { supabase } from '../lib/supabase';
import { generateStory } from './story';

export async function saveStory(storyData) {
  try {
    const { data, error } = await supabase
      .from('stories')
      .insert([
        {
          content: storyData.content,
          title: storyData.title,
          created_at: new Date(),
          user_id: storyData.userId, // 如果有用户系统的话
        }
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving story:', error);
    throw error;
  }
}

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
    console.error('Error fetching stories:', error);
    throw error;
  }
}

export async function generateAndSaveStory(userId) {
  try {
    const storyText = await generateStory();
    const parts = storyText.split('\n\n');
    
    // 提取标题和内容
    const title = parts[0].trim();
    const content = parts.slice(1).join('\n\n').trim();
    
    const storyData = {
      content,
      title,
      userId
    };
    
    return await saveStory(storyData);
  } catch (error) {
    console.error('Error generating and saving story:', error);
    throw error;
  }
} 