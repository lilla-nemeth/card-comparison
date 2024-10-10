import LLMPrompt from "../workers/LLMPrompts";

class FFCRewHttpService {

  static apiUrl = process.env.OPEN_AI_API_URL
  static apiKey = process.env.OPEN_AI_API_KEY

  async sendHttpRequest<T extends Record<string, string | number>, TResult>(
    prompt: LLMPrompt<T, TResult>,
    values: T): Promise<TResult> {
    const messages = [
      { role: 'system', content: prompt.getSystemMessage() },
      ...prompt.format(values)
    ]

    const postData = JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.2,
      response_format: { "type": "json_object" }
    })

    const response = await fetch(FFCRewHttpService.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FFCRewHttpService.apiKey}`
      },
      body: postData ? postData : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseAsJSON = await response.json()
    const generatedText = responseAsJSON.choices[0].message.content;
    return JSON.parse(generatedText) as TResult
  }
}

export default FFCRewHttpService