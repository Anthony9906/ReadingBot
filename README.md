# Story Reader - AI-Powered Reading Platform

一个基于 AI 的英语阅读平台，可以根据用户的 Lexile 值生成适合其阅读水平的故事。

## 技术栈

- Frontend: React + Vite
- Backend: Supabase
- AI: OpenAI GPT-3.5
- Authentication: Supabase Auth
- Database: Supabase PostgreSQL
- Styling: CSS Modules

## 主要功能

### 用户系统
- 用户注册和登录
- 用户昵称管理
- Lexile 阅读水平追踪
- 用户头像显示

### 故事生成与阅读
- 基于用户 Lexile 值的智能故事生成
- 故事包含：
  - 标题
  - 正文内容
  - 重要词汇列表
  - 理解问题和答案
- 最近故事列表显示
- 故事详情模态框查看

### 数据库结构

#### user_profiles 表
