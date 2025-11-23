
// src/lib/i18n.ts

export type Language = 'en' | 'vi';

export interface I18n {
  defaultTopic: string;
  defaultRelationship: string;
  defaultPronouns: string;
  error: string;
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
  relationship: string;
  relationshipPlaceholder: string;
  pronouns: string;
  pronounsPlaceholder: string;
  agent: string;
  agentProfileDesc: string;
  editAgent: string;
  editAgentDesc: string;
  agentName: string;
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
  personality: string;
  age: string;
  gender: string;
  male: string;
  female: string;
  nationality: string;
  location: string;
  curiosityIndex: string;
  summaryDiary: string;
  personalityPlaceholder: string;
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
  editMatrixConnection: string;
  editMatrixConnectionDesc: string;
  connectionDesc: string;
  trustDesc: string;
  intimacyDesc: string;
  dependencyDesc: string;
  load: string;
  save: string;
  loadTitle: string;
  loadDesc: string;
  saveTitle: string;
  saveDesc: string;
  apiKeys: string;
  apiKeysDesc: string;
  setApiKeys: string;
  narrator: string;
  narratorPlaceholder: string;
  send: string;
  narratorResponse: string;
  narratorError: string;
}

const en: I18n = {
  defaultTopic: '',
  defaultRelationship: '',
  defaultPronouns: '',
  error: 'Error',
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
  pressStart: 'Configure the settings and press "Start".',
  typing: 'Typing',
  controls: '10 Perspective',
  conversationSetup: 'Conversation Setup',
  conversationSetupDesc: 'Define the starting point for the characters.',
  topic: 'Topic',
  topicPlaceholder: 'e.g., A romantic love tragedy at a castle in the woods',
  relationship: 'Relationship between characters',
  relationshipPlaceholder: 'e.g., Lovers',
  pronouns: 'Pronouns',
  pronounsPlaceholder: 'e.g., He - She, You - I,...',
  agent: 'Agent',
  agentProfileDesc: "View and edit the character's profile.",
  editAgent: 'Edit',
  editAgentDesc: "Customize the character's information and personality.",
  agentName: 'Character Name',
  done: 'Done',
  modelParameters: 'Model Parameters',
  modelParametersDesc: 'Fine-tune the messaging system.',
  temperature: 'Temperature',
  temperatureDesc: 'Higher is more creative.',
  maxWords: 'Max Words',
  maxWordsDesc: 'Maximum number of words for each message.',
  exchanges: 'Exchanges',
  exchangesDesc: 'Number of individual messages in the conversation.',
  stop: 'Stop',
  stopConversation: 'Stop Conversation',
  startConversation: 'Start',
  continueConversation: 'Continue',
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
  leisurelyChatDesc: "Waits for the character's message typing time.",
  deepInteraction: 'Deep Interaction',
  deepInteractionDesc: 'Message content evolves beyond the initial topic.',
  agentSoul: "Character's Soul",
  agentMatrix: "Character's Matrix",
  basic: "Basic",
  advanced: "Advanced",
  persona: "Personal Information",
  personality: "Personality",
  age: "Age",
  gender: "Gender",
  male: "Male",
  female: "Female",
  nationality: "Nationality",
  location: "Location",
  curiosityIndex: "Curiosity Index",
  summaryDiary: "General Personality",
  personalityPlaceholder: "Write a paragraph describing the character.",
  socialPosition: "Social Position",
  job: "Job",
  financialStatus: "Account Balance",
  qualityOfLife: "Quality of Life",
  happinessIndex: "Happiness Index",
  relationships: "Relationships",
  emotionIndex: "Qualities",
  health: "Health",
  appearance: "Appearance",
  iq: "IQ Index",
  eq: "EQ Index",
  antipathy: "Antipathy towards other",
  nextIntention: "Next Intention",
  matrixConnection: "Connection",
  connection: "Connection",
  trust: "Trust",
  intimacy: "Intimacy",
  dependency: "Dependency",
  matrixFavor: "Core Identity",
  dob: "Date of Birth",
  zodiac: "Zodiac Sign",
  personalityType: "Personality Type (e.g., MBTI)",
  thinkingStyle: "Thinking Style",
  strengths: "Areas of Excellence",
  weaknesses: "Areas for Improvement",
  hobbies: "Personal Hobbies",
  dislikes: "Dislikes",
  dreams: "Ambitions",
  coreBeliefs: "Core Beliefs",
  lifePhilosophy: "Life Philosophy",
  pastTrauma: "Past Psychological Trauma",
  liveDashboard: 'Live Dashboard',
  liveDashboardDesc: 'Track changes in personality during the conversation.',
  apiKey: 'Google AI API Key',
  apiKeyPlaceholder: 'Enter your API Key',
  apiKeyDesc: 'Your key is used only for this session and is not stored.',
  syncProfile: 'Sync Personality',
  profileSynced: 'Profile Synced',
  profileSyncedDesc: 'Qualities have been updated to the personality.',
  editMatrixConnection: 'Set Initial Connection',
  editMatrixConnectionDesc: 'Define the initial relationship level between the two agents.',
  connectionDesc: 'How well they know each other.',
  trustDesc: 'How much they trust each other.',
  intimacyDesc: 'How emotionally close they are.',
  dependencyDesc: 'How much one relies on the other.',
  load: 'Upload',
  save: 'Download',
  loadTitle: 'Upload File',
  loadDesc: 'What would you like to upload? You can upload a previous session or a set of agent profiles.',
  saveTitle: 'Save File',
  saveDesc: 'What would you like to save? You can save the current session or just the agent profiles.',
  apiKeys: 'API Keys',
  apiKeysDesc: 'Provide Google AI API keys for the characters.',
  setApiKeys: 'Set API Keys',
  narrator: 'Narrator',
  narratorPlaceholder: 'Message the Narrator...',
  send: 'Send',
  narratorResponse: 'Narrator\'s Response',
  narratorError: 'The narrator did not return a valid response.',
};

const vi: I18n = {
  defaultTopic: '',
  defaultRelationship: '',
  defaultPronouns: '',
  error: 'Lỗi',
  provideTopic: 'Vui lòng cung cấp chủ đề cuộc trò chuyện.',
  conversationStopped: 'Cuộc trò chuyện đã dừng',
  conversationStoppedManually: 'Cuộc trò chuyện AI đã được dừng theo cách thủ công.',
  errorFrom: (agentName: string) => `Lỗi từ ${agentName}`,
  conversationReset: 'Đặt lại cuộc trò chuyện',
  chatCleared: 'Trò chuyện đã được xóa.',
  sessionSaved: 'Đã lưu phiên trò chuyện',
  sessionSavedDesc: 'Phiên trò chuyện của bạn đã được lưu.',
  profilesSaved: 'Đã lưu hồ sơ',
  profilesSavedDesc: 'Hồ sơ nhân vật hiện tại đã được lưu.',
  sessionLoaded: 'Đã tải phiên trò chuyện',
  sessionLoadedDesc: 'Phiên trò chuyện của bạn đã được tải.',
  profilesLoaded: 'Đã tải hồ sơ',
  profilesLoadedDesc: 'Hồ sơ nhân vật đã được tải.',
  loadFailed: 'Tải thất bại',
  loadFailedDesc: 'Tệp đã chọn không phải là tệp phiên hợp lệ.',
  profileLoadFailed: 'Tải hồ sơ thất bại',
  profileLoadFailedDesc: 'Tệp đã chọn không phải là tệp hồ sơ hợp lệ.',
  conversation: 'Hội thoại',
  messages: 'Tin nhắn',
  conversationAppearHere: 'Cuộc trò chuyện sẽ xuất hiện ở đây.',
  pressStart: 'Định cấu hình cài đặt và nhấn "Bắt đầu".',
  typing: 'Đang nhập',
  controls: '10 Perspective',
  conversationSetup: 'Thiết lập cuộc trò chuyện',
  conversationSetupDesc: 'Xác định điểm bắt đầu cho nhân vật',
  topic: 'Chủ đề',
  topicPlaceholder: 'Bi kịch tình yêu lãng mạn tại lâu đài trong rừng',
  relationship: 'Mối quan hệ của hai nhân vật',
  relationshipPlaceholder: 'Người thương',
  pronouns: 'Cách xưng hô',
  pronounsPlaceholder: 'anh - em / chàng - nàng / cậu - tớ,...',
  agent: 'Agent',
  agentProfileDesc: 'Xem và chỉnh sửa hồ sơ nhân vật',
  editAgent: 'Chỉnh sửa',
  editAgentDesc: 'Tùy chỉnh thông tin và tính cách',
  agentName: 'Tên nhân vật',
  done: 'Xong',
  modelParameters: 'Thông số mô hình',
  modelParametersDesc: 'Tinh chỉnh hệ thống nhắn tin',
  temperature: 'Nhiệt độ',
  temperatureDesc: 'Càng cao càng sáng tạo',
  maxWords: 'Số từ tối đa',
  maxWordsDesc: 'Số từ tối đa của tin nhắn',
  exchanges: 'Số tin nhắn',
  exchangesDesc: 'Số lượng tin nhắn riêng lẻ trong cuộc trò chuyện.',
  stop: 'Dừng',
  stopConversation: 'Dừng nhắn tin',
  startConversation: 'Bắt đầu',
  continueConversation: 'Tiếp tục',
  loadSession: 'Tải phiên trò chuyện',
  saveSession: 'Lưu phiên trò chuyện',
  loadProfiles: 'Tải hồ sơ nhân vật',
  saveProfiles: 'Lưu hồ sơ nhân vật',
  settings: 'Cài đặt',
  settingsDesc: 'Điều chỉnh cài đặt ứng dụng.',
  language: 'Ngôn ngữ',
  theme: 'Giao diện',
  light: 'Sáng',
  dark: 'Tối',
  system: 'Hệ thống',
  leisurelyChat: 'Chat thong thả',
  leisurelyChatDesc: 'Chờ thời gian nhập tin nhắn của nhân vật',
  deepInteraction: 'Tương tác sâu',
  deepInteractionDesc: 'Nội dung tin nhắn phát triển ngoài chủ đề ban đầu.',
  agentSoul: "Hồ Sơ Nhân Vật",
  agentMatrix: "Tính cách Nhân Vật",
  basic: "Cơ bản",
  advanced: "Nâng cao",
  persona: "Thông tin cá nhân",
  personality: "Tính cách",
  age: "Tuổi",
  gender: "Giới tính",
  male: "Nam",
  female: "Nữ",
  nationality: "Quốc tịch",
  location: "Nơi sống",
  curiosityIndex: "Chỉ số ham học hỏi",
  summaryDiary: "Tính cách tổng quát",
  personalityPlaceholder: "Viết một đoạn văn bản mô tả nhân vật",
  socialPosition: "Vị trí xã hội",
  job: "Công việc",
  financialStatus: "Số dư tài khoản",
  qualityOfLife: "Chất lượng cuộc sống",
  happinessIndex: "Chỉ số hạnh phúc",
  relationships: "Các mối quan hệ",
  emotionIndex: "Tố chất",
  health: "Sức khỏe",
  appearance: "Ngoại hình",
  iq: "Chỉ số IQ",
  eq: "Chỉ số EQ",
  antipathy: "Chỉ số ác cảm với đối phương",
  nextIntention: "Ý định tiếp theo",
  matrixConnection: "Sự kết nối",
  connection: "Kết nối",
  trust: "Độ tin tưởng",
  intimacy: "Độ thân mật",
  dependency: "Độ phụ thuộc",
  matrixFavor: "Bản sắc cốt lõi",
  dob: "Ngày sinh",
  zodiac: "Cung hoàng đạo",
  personalityType: "Nhóm tính cách (ví dụ: MBTI)",
  thinkingStyle: "Lối tư duy",
strengths: "Những lĩnh vực vượt trội",
  weaknesses: "Những lĩnh vực không vượt trội",
  hobbies: "Sở thích cá nhân",
  dislikes: "Những điều không thích",
  dreams: "Hoài bão",
  coreBeliefs: "Niềm tin cốt lõi",
  lifePhilosophy: "Tư tưởng sống",
  pastTrauma: "Vết thương tâm lý trong quá khứ",
  liveDashboard: 'Theo dõi trực tiếp',
  liveDashboardDesc: 'Theo dõi sự thay đổi của tính cách trong quá trình nhắn tin.',
  apiKey: 'Google AI API Key',
  apiKeyPlaceholder: 'Nhập API Key',
  apiKeyDesc: 'Key của bạn chỉ được dùng cho phiên này và không được lưu trữ.',
  syncProfile: 'Đồng bộ tính cách',
  profileSynced: 'Đã đồng bộ hồ sơ',
  profileSyncedDesc: 'Các tố chất đã được cập nhật vào tính cách.',
  editMatrixConnection: 'Thiết lập Kết Nối',
  editMatrixConnectionDesc: 'Xác định mức độ quan hệ ban đầu giữa hai nhân vật.',
  connectionDesc: 'Mức độ hiểu biết về nhau.',
  trustDesc: 'Mức độ tin tưởng lẫn nhau.',
  intimacyDesc: 'Mức độ tình cảm của nhau',
  dependencyDesc: 'Mức độ lợi dụng của nhau',
  load: 'Tải lên',
  save: 'Tải xuống',
  loadTitle: 'Tải tệp lên',
  loadDesc: 'Bạn muốn tải lên tệp nào? Bạn có thể tải lên một phiên trò chuyện trước đó hoặc tải lên hồ sơ của các nhân vật.',
  saveTitle: 'Lưu tệp',
  saveDesc: 'Bạn muốn lưu những gì? Bạn có thể lưu phiên trò chuyện hiện tại hoặc chỉ lưu hồ sơ của các nhân vật.',
  apiKeys: 'API Keys',
  apiKeysDesc: 'Cung cấp khóa API Google AI cho các nhân vật.',
  setApiKeys: 'Thiết lập API Keys',
  narrator: 'Người dẫn truyện',
  narratorPlaceholder: 'Nhắn tin cho người dẫn truyện...',
  send: 'Gửi',
  narratorResponse: 'Phản hồi của người dẫn truyện',
  narratorError: 'Người dẫn truyện đã không trả về một phản hồi hợp lệ.',
};

export const i18n = { en, vi };
