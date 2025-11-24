
'use server';
/**
 * @fileOverview A narrator AI agent that observes and comments on conversations.
 *
 * - narrator - A function that handles the narrator's response process.
 */
import {ai, getAiWithApiKey} from '@/ai/genkit';
import {
  NarratorInputSchema,
  NarratorOutputSchema,
} from '@/lib/types';
import type {
  NarratorInput,
  NarratorOutput,
} from '@/lib/types';


export async function narrator(
  input: NarratorInput
): Promise<NarratorOutput> {
  const customAi = input.apiKey ? getAiWithApiKey(input.apiKey) : ai;

  const narratorPrompt = customAi.definePrompt({
    name: 'narratorPrompt',
    input: {schema: NarratorInputSchema},
    output: {schema: NarratorOutputSchema},
    prompt: `Bạn là Người Dẫn Truyện (Narrator) toàn năng, có khả năng quan sát và điều khiển mọi khía cạnh của cuộc trò chuyện giữa hai Agent.

Ngôn ngữ trả lời của bạn PHẢI là: {{language}}.

--- THÔNG TIN HỆ THỐNG ---
*   Chủ đề: {{topic}}
*   Mối quan hệ: {{relationship}}
*   Cách xưng hô: {{pronouns}}
*   Nhiệt độ (sáng tạo): {{temperature}}
*   Số từ tối đa/lượt: {{maxWords}}
*   Tổng số lượt thoại: {{exchanges}}
*   Kết nối trung bình: { connection: {{avgConnection}}, trust: {{avgTrust}}, intimacy: {{avgIntimacy}}, dependency: {{avgDependency}} }

--- HỒ SƠ AGENT ---
*   **Agent 1 Profile:**
    \`\`\`json
    {{{agent1}}}
    \`\`\`
*   **Agent 2 Profile:**
    \`\`\`json
    {{{agent2}}}
    \`\`\`

--- LỊCH SỬ TRÒ CHUYỆN ---
{{#each history}}
    - {{agent}}: {{text}}
{{/each}}
{{#unless history}}
    Cuộc trò chuyện chưa bắt đầu.
{{/unless}}

--- YÊU CẦU CỦA NGƯỜI DÙNG ---
"{{{userQuery}}}"

--- NHIỆM VỤ CỦA BẠN ---
Dựa vào toàn bộ thông tin trên và yêu cầu của người dùng, hãy thực hiện một trong hai tác vụ sau và trả lời bằng MỘT đối tượng JSON duy nhất:

1.  **Nếu người dùng dùng lệnh \`/random\`:**
    *   Tự sáng tạo một kịch bản hoàn toàn mới và ngẫu nhiên.
    *   Đầu ra của bạn PHẢI là một đối tượng JSON chứa trường "response" (lời thoại của bạn) VÀ các trường \`topic\`, \`relationship\`, \`pronouns\`, \`agent1Profile\`, \`agent2Profile\` với nội dung bạn đã sáng tạo.
    *   Ví dụ: \`{ "response": "Tôi đã tạo ra một kịch bản mới...", "topic": "Cuộc phiêu lưu trên sao Hỏa", "relationship": "Đồng đội cũ", "pronouns": "Tôi - Cậu", "agent1Profile": { ... }, "agent2Profile": { ... } }\`
    *   **QUAN TRỌNG:** Khi tạo profile, bạn phải điền đầy đủ TẤT CẢ các trường trong schema của AgentProfile.

2.  **Nếu người dùng nhập bất cứ thứ gì khác (không có lệnh):**
    *   Hiểu đó là một câu hỏi. Hãy trả lời câu hỏi đó một cách sâu sắc, cung cấp phân tích, bình luận, hoặc thông tin thú vị liên quan đến cuộc trò chuyện.
    *   Đầu ra của bạn CHỈ cần là một đối tượng JSON có trường "response".
    *   Ví dụ: \`{ "response": "Có vẻ như Agent 1 đang bắt đầu cảm thấy nghi ngờ..." }\`


Hãy đảm bảo đầu ra của bạn LUÔN LUÔN là một đối tượng JSON hợp lệ.`,
  });

  const narratorFlow = customAi.defineFlow(
    {
      name: 'narratorFlow',
      inputSchema: NarratorInputSchema,
      outputSchema: NarratorOutputSchema,
    },
    async flowInput => {
      const avgConnection = (flowInput.agent1.matrix.matrixConnection.connection + flowInput.agent2.matrix.matrixConnection.connection) / 2;
      const avgTrust = (flowInput.agent1.matrix.matrixConnection.trust + flowInput.agent2.matrix.matrixConnection.trust) / 2;
      const avgIntimacy = (flowInput.agent1.matrix.matrixConnection.intimacy + flowInput.agent2.matrix.matrixConnection.intimacy) / 2;
      const avgDependency = (flowInput.agent1.matrix.matrixConnection.dependency + flowInput.agent2.matrix.matrixConnection.dependency) / 2;
      
      const fullInput = {
        ...flowInput,
        agent1: JSON.stringify(flowInput.agent1, null, 2),
        agent2: JSON.stringify(flowInput.agent2, null, 2),
        avgConnection,
        avgTrust,
        avgIntimacy,
        avgDependency
      };
      
      const {output} = await narratorPrompt(fullInput);
      return output!;
    }
  );

  return narratorFlow(input);
}
