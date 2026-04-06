/*
 * Speech-to-text service — DISABLED for production.
 * OpenAI Whisper integration was dev-only. Do not re-enable without a backend proxy.
 *

import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

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

*/
