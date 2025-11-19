// src/lib/i18n.ts

export type Language = 'en' | 'vi';

export interface I18n {
  defaultTopic: string;
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
  profilesSaved: string;
  profilesSavedDesc: string;
  sessionLoaded: string;
  sessionLoadedDesc: string;
  profilesLoaded: string;
  profilesLoadedDesc: string;
  loadFailed: string;
  loadFailedDesc: string;
  profileLoadFailed: string;
  profileLoadFailedDesc: string;
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
  agent: string;
  agentProfileDesc: string;
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
  stop: string;
  stopConversation: string;
  startConversation: string;
  continueConversation: string;
  loadSession: string;
  saveSession: string;
  loadProfiles: string;
  saveProfiles: string;
  settings: string;
  settingsDesc: string;
  language: string;
  theme: string;
  light: string;
  dark: string;
  system: string;
  leisurelyChat: string;
  leisurelyChatDesc: string;
  deepInteraction: string;
  deepInteractionDesc: string;
  agentSoul: string;
  agentMatrix: string;
  basic: string;
  advanced: string;
  persona: string;
  age: string;
  nationality: string;
  location: string;
  curiosityIndex: string;
  summaryDiary: string;
  socialPosition: string;
  job: string;
  financialStatus: string;
  qualityOfLife: string;
  happinessIndex: string;
  relationships: string;
  emotionIndex: string;
  health: string;
  appearance: string;
  iq: string;
  eq: string;
  antipathy: string;
  nextIntention: string;
  matrixConnection: string;
  connection: string;
  trust: string;
  intimacy: string;
  dependency: string;
  matrixFavor: string;
  dob: string;
  zodiac: string;
  personalityType: string;
  thinkingStyle: string;
  strengths: string;
  weaknesses: string;
  hobbies: string;
  dislikes: string;
  dreams: string;
  coreBeliefs: string;
  lifePhilosophy: string;
  pastTrauma: string;
  liveDashboard: string;
  liveDashboardDesc: string;
  apiKey: string;
  apiKeyPlaceholder: string;
  apiKeyDesc: string;
  syncProfile: string;
  profileSynced: string;
  profileSyncedDesc: string;
}

const en: I18n = {
  defaultTopic: 'The future of space exploration and its impact on humanity.',
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
  sessionSavedDesc: 'Your conversation session has been saved.',
  profilesSaved: 'Profiles Saved',
  profilesSavedDesc: 'The current agent profiles have been saved.',
  sessionLoaded: 'Session Loaded',
  sessionLoadedDesc: 'Your conversation session has been loaded.',
  profilesLoaded: 'Profiles Loaded',
  profilesLoadedDesc: 'Agent profiles have been loaded.',
  loadFailed: 'Load Failed',
  loadFailedDesc: 'The selected file is not a valid session file.',
  profileLoadFailed: 'Profile Load Failed',
  profileLoadFailedDesc: 'The selected file is not a valid profile file.',
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
  agent: 'Agent',
  agentProfileDesc: "View and edit this agent's profile.",
  editAgent: 'Edit Agent',
  editAgentDesc: "Customize the agent's soul and matrix.",
  agentName: 'Agent Name',
  personality: 'Personality',
  personalityPlaceholder: 'e.g., A skeptical philosopher...',
  generatePersonality: 'Generate Summary Diary with AI',
  done: 'Done',
  modelParameters: 'Model Parameters',
  modelParametersDesc: 'Fine-tune the behavior of the AI models.',
  temperature: 'Temperature',
  temperatureDesc: 'Controls randomness. Lower is more deterministic.',
  maxWords: 'Max Words',
  maxWordsDesc: 'Maximum number of words for each AI response.',
  exchanges: 'Exchanges',
  exchangesDesc: 'Number of individual messages in the conversation.',
  stop: 'Stop',
  stopConversation: 'Stop Conversation',
  startConversation: 'Start Conversation',
  continueConversation: 'Continue Conversation',
  loadSession: 'Load Session',
  saveSession: 'Save Session',
  loadProfiles: 'Load Profiles',
  saveProfiles: 'Save Profiles',
  settings: 'Settings',
  settingsDesc: 'Adjust application settings.',
  language: 'Language',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  leisurelyChat: 'Leisurely Chat',
  leisurelyChatDesc: 'Adds a realistic reading-time delay between messages.',
  deepInteraction: 'Deep Interaction',
  deepInteractionDesc: 'Allows the conversation to evolve beyond the initial topic.',
  agentSoul: "Agent's Soul",
  agentMatrix: "Agent's Matrix",
  basic: "Basic",
  advanced: "Advanced",
  persona: "Persona",
  age: "Age",
  nationality: "Nationality",
  location: "Location",
  curiosityIndex: "Curiosity Index",
  summaryDiary: "Summary Diary (AI-Gen Base)",
  socialPosition: "Social Position",
  job: "Job",
  financialStatus: "Financial Status",
  qualityOfLife: "Quality of Life",
  happinessIndex: "Happiness Index",
  relationships: "Relationships",
  emotionIndex: "Emotion Index (Dynamic)",
  health: "Health",
  appearance: "Appearance",
  iq: "IQ",
  eq: "EQ",
  antipathy: "Antipathy towards other",
  nextIntention: "Next Intention",
  matrixConnection: "Matrix Connection (Dynamic)",
  connection: "Connection",
  trust: "Trust",
  intimacy: "Intimacy",
  dependency: "Dependency",
  matrixFavor: "Matrix Favor (Static)",
  dob: "Date of Birth",
  zodiac: "Zodiac Sign",
  personalityType: "Personality Type (e.g. MBTI)",
  thinkingStyle: "Thinking Style",
  strengths: "Strengths",
  weaknesses: "Weaknesses",
  hobbies: "Hobbies",
  dislikes: "Dislikes",
  dreams: "Dreams & Ambitions",
  coreBeliefs: "Core Beliefs",
  lifePhilosophy: "Life Philosophy",
  pastTrauma: "Past Trauma (if any)",
  liveDashboard: 'Live Dashboard',
  liveDashboardDesc: 'Real-time monitoring of Agent Matrix values during the conversation.',
  apiKey: 'Google AI API Key',
  apiKeyPlaceholder: 'Enter your API Key',
  apiKeyDesc: 'Your key is used only for this session and is not stored.',
  syncProfile: 'Sync current matrix to soul',
  profileSynced: 'Profile Synced',
  profileSyncedDesc: 'The dynamic matrix values have been updated to the soul.',
};

const vi: I18n = {
  defaultTopic: 'Tương lai của việc thám hiểm không gian và tác động của nó đối với nhân loại.',
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
  sessionSaved: 'Đã lưu phiên trò chuyện',
  sessionSavedDesc: 'Phiên trò chuyện của bạn đã được lưu.',
  profilesSaved: 'Đã lưu hồ sơ',
  profilesSavedDesc: 'Hồ sơ agent hiện tại đã được lưu.',
  sessionLoaded: 'Đã tải phiên trò chuyện',
  sessionLoadedDesc: 'Phiên trò chuyện của bạn đã được tải.',
  profilesLoaded: 'Đã tải hồ sơ',
  profilesLoadedDesc: 'Hồ sơ agent đã được tải.',
  loadFailed: 'Tải thất bại',
  loadFailedDesc: 'Tệp đã chọn không phải là tệp phiên hợp lệ.',
  profileLoadFailed: 'Tải hồ sơ thất bại',
  profileLoadFailedDesc: 'Tệp đã chọn không phải là tệp hồ sơ hợp lệ.',
  conversation: 'Cuộc hội thoại',
  messages: 'Tin nhắn',
  conversationAppearHere: 'Cuộc trò chuyện sẽ xuất hiện ở đây.',
  pressStart: 'Định cấu hình cài đặt và nhấn "Bắt đầu".',
  typing: 'Đang nhập',
  controls: 'Bảng điều khiển Dualogue',
  conversationSetup: 'Thiết lập cuộc trò chuyện',
  conversationSetupDesc: 'Xác định điểm bắt đầu cho các agent AI.',
  topic: 'Chủ đề / Gợi ý bắt đầu',
  topicPlaceholder: 'ví dụ: Đạo đức của trí tuệ nhân tạo...',
  agent: 'Agent',
  agentProfileDesc: 'Xem và chỉnh sửa hồ sơ của agent này.',
  editAgent: 'Chỉnh sửa Agent',
  editAgentDesc: 'Tùy chỉnh linh hồn và ma trận của agent.',
  agentName: 'Tên Agent',
  personality: 'Tính cách',
  personalityPlaceholder: 'ví dụ: Một triết gia hoài nghi...',
  generatePersonality: 'Tạo Nhật ký Tóm tắt bằng AI',
  done: 'Xong',
  modelParameters: 'Thông số mô hình',
  modelParametersDesc: 'Tinh chỉnh hành vi của các mô hình AI.',
  temperature: 'Nhiệt độ',
  temperatureDesc: 'Kiểm soát sự ngẫu nhiên. Càng thấp càng xác định.',
  maxWords: 'Số từ tối đa',
  maxWordsDesc: 'Số từ tối đa cho mỗi phản hồi của AI.',
  exchanges: 'Lượt trao đổi',
  exchangesDesc: 'Số lượng tin nhắn riêng lẻ trong cuộc trò chuyện.',
  stop: 'Dừng',
  stopConversation: 'Dừng cuộc trò chuyện',
  startConversation: 'Bắt đầu',
  continueConversation: 'Tiếp tục',
  loadSession: 'Tải phiên',
  saveSession: 'Lưu phiên',
  loadProfiles: 'Tải hồ sơ',
  saveProfiles: 'Lưu hồ sơ',
  settings: 'Cài đặt',
  settingsDesc: 'Điều chỉnh cài đặt ứng dụng.',
  language: 'Ngôn ngữ',
  theme: 'Giao diện',
  light: 'Sáng',
  dark: 'Tối',
  system: 'Hệ thống',
  leisurelyChat: 'Chat thong thả',
  leisurelyChatDesc: 'Thêm độ trễ mô phỏng thời gian đọc thực tế giữa các tin nhắn.',
  deepInteraction: 'Tương tác sâu',
  deepInteractionDesc: 'Cho phép cuộc trò chuyện phát triển ngoài chủ đề ban đầu.',
  agentSoul: "Linh hồn Agent",
  agentMatrix: "Matrix Agent",
  basic: "Cơ bản",
  advanced: "Nâng cao",
  persona: "Persona",
  age: "Tuổi",
  nationality: "Quốc tịch",
  location: "Nơi sống",
  curiosityIndex: "Chỉ số ham học hỏi",
  summaryDiary: "Nhật ký tóm tắt (Nền tảng cho AI)",
  socialPosition: "Vị trí xã hội",
  job: "Công việc",
  financialStatus: "Tài chính",
  qualityOfLife: "Chất lượng cuộc sống",
  happinessIndex: "Chỉ số hạnh phúc",
  relationships: "Các mối quan hệ",
  emotionIndex: "Emotion Index (Động)",
  health: "Sức khỏe",
  appearance: "Ngoại hình",
  iq: "Chỉ số IQ",
  eq: "Chỉ số EQ",
  antipathy: "Chỉ số ác cảm đối phương",
  nextIntention: "Ý định tiếp theo",
  matrixConnection: "Matrix Connection (Động)",
  connection: "Kết nối",
  trust: "Độ tin tưởng",
  intimacy: "Độ thân mật",
  dependency: "Độ phụ thuộc",
  matrixFavor: "Matrix Favor (Tĩnh)",
  dob: "Ngày sinh",
  zodiac: "Cung hoàng đạo",
  personalityType: "Nhóm tính cách (ví dụ: MBTI)",
  thinkingStyle: "Lối tư duy",
  strengths: "Những lĩnh vực vượt trội",
  weaknesses: "Những lĩnh vực không trội",
  hobbies: "Sở thích cá nhân",
  dislikes: "Sở ghét cá nhân",
  dreams: "Ước mơ, hoài bão",
  coreBeliefs: "Niềm tin cốt lõi",
  lifePhilosophy: "Tư tưởng sống",
  pastTrauma: "Vết thương tâm lý (nếu có)",
  liveDashboard: 'Bảng điều khiển trực tiếp',
  liveDashboardDesc: 'Theo dõi chỉ số Matrix của Agent theo thời gian thực.',
  apiKey: 'Google AI API Key',
  apiKeyPlaceholder: 'Nhập API Key của bạn',
  apiKeyDesc: 'Key của bạn chỉ được dùng cho phiên này và không được lưu trữ.',
  syncProfile: 'Đồng bộ chỉ số hiện tại vào Soul',
  profileSynced: 'Đã đồng bộ hồ sơ',
  profileSyncedDesc: 'Các giá trị matrix động đã được cập nhật vào soul.',
};

export const i18n = { en, vi };
