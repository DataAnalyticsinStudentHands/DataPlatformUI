import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

/**
 * Send an audio chunk to OpenAI Whisper for transcription.
 * Requires VITE_OPENAI_API_KEY in .env — swap for a backend proxy in production.
 */
export async function transcribeAudioChunk(audioBlob, language = 'en') {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', language);
  formData.append('response_format', 'json');

  const response = await axios.post(OPENAI_API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
  });
  return response.data.text;
}
