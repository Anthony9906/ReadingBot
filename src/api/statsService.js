import { supabase } from '../lib/supabase';

export const getUserStats = async (userId) => {
  try {
    // 获取所有故事数量
    const { count: totalStories, error: storiesError } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true });

    if (storiesError) throw storiesError;

    // 获取用户完成的所有测验记录
    const { data: quizRecords, error: quizError } = await supabase
      .from('quiz_records')
      .select('*')
      .eq('user_id', userId);

    if (quizError) throw quizError;

    // 获取用户的 lexile 变化记录
    const { data: lexileChanges, error: lexileError } = await supabase
      .from('lexile_changes')
      .select('lexile_change')
      .eq('user_id', userId);

    if (lexileError) throw lexileError;

    // 计算统计数据
    const completedQuizzes = quizRecords.length;
    const lexileIncrease = lexileChanges.reduce((sum, record) => sum + record.lexile_change, 0);

    return {
      totalStories,
      completedQuizzes,
      lexileIncrease
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalStories: 0,
      completedQuizzes: 0,
      lexileIncrease: 0
    };
  }
}; 