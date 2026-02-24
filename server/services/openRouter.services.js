export const askAi = async (messages) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages array is empty. ");
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "openai/gpt-4o-mini",
            messages: messages
        },
            {headers: {
            Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        }},
        );
        const content = response?.data?.choices?.[0]?.message?.content;
        if(!content || !content.trim()) {
            throw new Error("Ai returned empty response. Please try again later.");
        }
        return content;
    } catch (error) {
        console.error("openRouter.ai API error:",  error.response?.data || error.message);
        throw new Error("Failed to get response from openRouter.ai API. Please try again later.");
    }
}