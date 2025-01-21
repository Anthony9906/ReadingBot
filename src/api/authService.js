import { supabase } from '../lib/supabase';

export async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function updateUserNickname(nickname) {
  try {
    // 1. 更新 auth.users 的 user_metadata
    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: { nickname: nickname }
    });

    if (authError) throw authError;

    // 2. 更新 user_profiles 表
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ username: nickname })
      .eq('id', authData.user.id);

    if (profileError) throw profileError;

    return authData;
  } catch (error) {
    console.error('Error updating nickname:', error);
    throw error;
  }
}

// 获取用户配置信息，如果 lexile 为空则设置默认值
export async function getUserProfile(userId) {
  try {
    let { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // 如果用户配置不存在，创建一个新的配置
    if (!data) {
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            username: 'Username',
            lexile: '100L'
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      data = newProfile;
    }
    // 如果 lexile 为空，设置默认值
    else if (!data.lexile) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from('user_profiles')
        .update({ lexile: '100L' })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      data = updatedProfile;
    }

    return data;
  } catch (error) {
    console.error('Error getting/creating user profile:', error);
    // 返回默认值而不是 null
    return {
      id: userId,
      username: 'Username',
      lexile: '100L'
    };
  }
}

// 更新用户的 Lexile 值
export async function updateUserLexile(userId, lexile) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ lexile: lexile })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user lexile:', error);
    throw error;
  }
}