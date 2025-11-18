// src/lib/i18n.ts

export type Language = 'en' | 'vi';

export interface I18n {
  defaultTopic: string;
  defaultPersonality1: string;
  defaultPersonality2: string;
  error: string;
  providePersonalityDesc: (agentNum: 1 | 2) => string;
  personalityGenerationFailed: string;
  personalityGenerated: string;
  personalityUpdated: (agentNum: 1 | 2) => string;
  provideTopic: string;
  conversationStopped: string;
  conversationStoppedManually: string;
  errorFrom: (agentName: string) => string;
  conversationReset: string;
  chatCleared: string;
  sessionSaved: string;
  sessionSavedDesc: string;
  sessionLoaded: string;
  sessionLoadedDesc: string;
  loadFailed: string;
  loadFailedDesc: string;
  conversation: string;
  messages: string;
  conversationAppearHere: string;
  pressStart: string;
  typing: string;
  controls: string;
  conversationSetup: string;
  conversationSetupDesc: string;
  topic: string;
  topicPlaceholder: string;
  agentPersonalityDesc: string;
  editAgent: string;
  editAgentDesc: string;
  agentName: string;
  personality: string;
  personalityPlaceholder: string;
  generatePersonality: string;
  done: string;
  modelParameters: string;
  modelParametersDesc: string;
  temperature: string;
  temperatureDesc: string;
  maxWords: string;
  maxWordsDesc: string;
  exchanges: string;
  exchangesDesc: string;
  apiKey: string;
  apiKeyDesc: string;
  apiKeyPlaceholder: string;
  stop: string;
  startConversation: string;
  load: string;
  save: string;
  settings: string;
  settingsDesc: string;
  language: string;
  theme: string;
  light: string;
  dark: string;
  system: string;
}

const en: I18n = {
  defaultTopic: 'The future of space exploration and its impact on humanity.',
  defaultPersonality1: 'A pragmatic and cautious scientist who weighs the risks and ethical implications of every decision.',
  defaultPersonality2: 'A visionary artist and dreamer who sees boundless potential and beauty in the cosmos.',
  error: 'Error',
  providePersonalityDesc: (agentNum: 1 | 2) => `Please provide a description for Agent ${agentNum} personality.`,
  personalityGenerationFailed: 'Personality Generation Failed',
  personalityGenerated: 'Personality Generated',
  personalityUpdated: (agentNum: 1 | 2) => `Agent ${agentNum}'s personality has been updated.`,
  provideTopic: 'Please provide a conversation topic.',
  conversationStopped: 'Conversation Stopped',
  conversationStoppedManually: 'The AI conversation has been manually stopped.',
  errorFrom: (agentName: string) => `Error from ${agentName}`,
  conversationReset: 'Conversation Reset',
  chatCleared: 'The chat has been cleared.',
  sessionSaved: 'Session Saved',
  sessionSavedDesc: 'Your conversation has been saved.',
  sessionLoaded: 'Session Loaded',
  sessionLoadedDesc: 'Your conversation has been loaded.',
  loadFailed: 'Load Failed',
  loadFailedDesc: 'The selected file is not a valid session file.',
  conversation: 'Conversation',
  messages: 'Messages',
  conversationAppearHere: 'The conversation will appear here.',
  pressStart: 'Configure the settings and press "Start Conversation".',
  typing: 'Typing',
  controls: 'Dualogue Controls',
  conversationSetup: 'Conversation Setup',
  conversationSetupDesc: 'Define the starting point for the AI agents.',
  topic: 'Topic / Starting Prompt',
  topicPlaceholder: 'e.g., The ethics of artificial intelligence...',
  agentPersonalityDesc: "Define this agent's personality.",
  editAgent: 'Edit Agent',
  editAgentDesc: "Customize the agent's name and personality.",
  agentName: 'Agent Name',
  personality: 'Personality',
  personalityPlaceholder: 'e.g., A skeptical philosopher...',
  generatePersonality: 'Generate Personality with AI',
  done: 'Done',
  modelParameters: 'Model Parameters',
  modelParametersDesc: 'Fine-tune the behavior of the AI models.',
  temperature: 'Temperature',
  temperatureDesc: 'Controls randomness. Lower is more deterministic.',
  maxWords: 'Max Words',
  maxWordsDesc: 'Maximum number of words for each AI response.',
  exchanges: 'Exchanges',
  exchangesDesc: 'Number of back-and-forth turns in the conversation.',
  apiKey: 'API Key',
  apiKeyDesc: 'Enter your Google AI API key to power the conversation.',
  apiKeyPlaceholder: 'Enter your API key',
  stop: 'Stop',
  startConversation: 'Start Conversation',
  load: 'Load',
  save: 'Save',
  settings: 'Settings',
  settingsDesc: 'Adjust application settings.',
  language: 'Language',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const vi: I18n = {
  defaultTopic: 'Tương lai của việc thám hiểm không gian và tác động của nó đối với nhân loại.',
  defaultPersonality1: 'Một nhà khoa học thực dụng và thận trọng, luôn cân nhắc rủi ro và ý nghĩa đạo đức của mọi quyết định.',
  defaultPersonality2: 'Một nghệ sĩ và kẻ mơ mộng có tầm nhìn, nhìn thấy tiềm năng và vẻ đẹp vô biên trong vũ trụ.',
  error: 'Lỗi',
  providePersonalityDesc: (agentNum: 1 | 2) => `Vui lòng cung cấp mô tả cho tính cách của Agent ${agentNum}.`,
  personalityGenerationFailed: 'Tạo tính cách thất bại',
  personalityGenerated: 'Đã tạo tính cách',
  personalityUpdated: (agentNum: 1 | 2) => `Tính cách của Agent ${agentNum} đã được cập nhật.`,
  provideTopic: 'Vui lòng cung cấp chủ đề cuộc trò chuyện.',
  conversationStopped: 'Cuộc trò chuyện đã dừng',
  conversationStoppedManually: 'Cuộc trò chuyện AI đã được dừng theo cách thủ công.',
  errorFrom: (agentName: string) => `Lỗi từ ${agentName}`,
  conversationReset: 'Đặt lại cuộc trò chuyện',
  chatCleared: 'Trò chuyện đã được xóa.',
  sessionSaved: 'Đã lưu phiên',
  sessionSavedDesc: 'Cuộc trò chuyện của bạn đã được lưu.',
  sessionLoaded: 'Đã tải phiên',
  sessionLoadedDesc: 'Cuộc trò chuyện của bạn đã được tải.',
  loadFailed: 'Tải thất bại',
  loadFailedDesc: 'Tệp đã chọn không phải là tệp phiên hợp lệ.',
  conversation: 'Cuộc hội thoại',
  messages: 'Tin nhắn',
  conversationAppearHere: 'Cuộc trò chuyện sẽ xuất hiện ở đây.',
  pressStart: 'Định cấu hình cài đặt và nhấn "Bắt đầu cuộc trò chuyện".',
  typing: 'Đang nhập',
  controls: 'Bảng điều khiển Dualogue',
  conversationSetup: 'Thiết lập cuộc trò chuyện',
  conversationSetupDesc: 'Xác định điểm bắt đầu cho các agent AI.',
  topic: 'Chủ đề / Gợi ý bắt đầu',
  topicPlaceholder: 'ví dụ: Đạo đức của trí tuệ nhân tạo...',
  agentPersonalityDesc: 'Xác định tính cách của agent này.',
  editAgent: 'Chỉnh sửa Agent',
  editAgentDesc: 'Tùy chỉnh tên và tính cách của agent.',
  agentName: 'Tên Agent',
  personality: 'Tính cách',
  personalityPlaceholder: 'ví dụ: Một triết gia hoài nghi...',
  generatePersonality: 'Tạo tính cách bằng AI',
  done: 'Xong',
  modelParameters: 'Thông số mô hình',
  modelParametersDesc: 'Tinh chỉnh hành vi của các mô hình AI.',
  temperature: 'Nhiệt độ',
  temperatureDesc: 'Kiểm soát sự ngẫu nhiên. Càng thấp càng xác định.',
  maxWords: 'Số từ tối đa',
  maxWordsDesc: 'Số từ tối đa cho mỗi phản hồi của AI.',
  exchanges: 'Lượt trao đổi',
  exchangesDesc: 'Số lượt trao đổi qua lại trong cuộc trò chuyện.',
  apiKey: 'API Key',
  apiKeyDesc: 'Nhập Google AI API key của bạn để cung cấp năng lượng cho cuộc trò chuyện.',
  apiKeyPlaceholder: 'Nhập API key của bạn',
  stop: 'Dừng',
  startConversation: 'Bắt đầu cuộc trò chuyện',
  load: 'Tải',
  save: 'Lưu',
  settings: 'Cài đặt',
  settingsDesc: 'Điều chỉnh cài đặt ứng dụng.',
  language: 'Ngôn ngữ',
  theme: 'Giao diện',
  light: 'Sáng',
  dark: 'Tối',
  system: 'Hệ thống',
};

export const i18n = { en, vi };
