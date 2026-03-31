<template>
  <main class="stt-page">
    <v-container class="py-8" style="max-width: 860px">
      <!-- Page Header -->
      <div class="d-flex align-center mb-6">
        <v-icon size="32" color="#c8102e" class="mr-3">mdi-microphone</v-icon>
        <h1 class="text-h4 font-weight-bold">Speech to Text Demo</h1>
      </div>

      <!-- Status + Controls Card -->
      <v-card class="mb-6 pa-6" elevation="2" rounded="lg">
        <div class="d-flex flex-column align-center">
          <!-- Status Indicator -->
          <v-chip
            :color="statusColor"
            variant="flat"
            size="large"
            class="mb-4"
          >
            <v-icon start>{{ statusIcon }}</v-icon>
            {{ statusLabel }}
          </v-chip>

          <!-- Audio Level Bar -->
          <div class="audio-level-container mb-4">
            <div
              class="audio-level-bar"
              :style="{ width: `${audioLevel}%` }"
            ></div>
          </div>

          <!-- Record Button -->
          <v-btn
            :color="isRecording ? '#c8102e' : '#c8102e'"
            :variant="isRecording ? 'outlined' : 'flat'"
            size="x-large"
            rounded="pill"
            @click="toggleRecording"
            :loading="isMicLoading"
            min-width="220"
          >
            <v-icon start>{{
              isRecording ? 'mdi-stop' : 'mdi-microphone'
            }}</v-icon>
            {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
          </v-btn>

          <!-- Error -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            closable
            class="mt-4 w-100"
            @click:close="error = ''"
          >
            {{ error }}
          </v-alert>
        </div>
      </v-card>

      <!-- Settings -->
      <v-card class="mb-6 pa-4" elevation="1" rounded="lg">
        <div class="text-subtitle-2 font-weight-bold mb-3">
          <v-icon size="18" class="mr-1">mdi-cog</v-icon>
          Settings
        </div>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="selectedLanguage"
              :items="languages"
              item-title="label"
              item-value="code"
              label="Language"
              variant="outlined"
              density="compact"
              hide-details
              :disabled="isRecording"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="chunkDuration"
              :items="chunkOptions"
              item-title="label"
              item-value="ms"
              label="Chunk Interval"
              variant="outlined"
              density="compact"
              hide-details
              :disabled="isRecording"
            />
          </v-col>
        </v-row>
      </v-card>

      <!-- Transcript -->
      <v-card class="pa-4" elevation="1" rounded="lg">
        <div class="d-flex align-center justify-space-between mb-3">
          <div class="text-subtitle-2 font-weight-bold">
            <v-icon size="18" class="mr-1">mdi-text</v-icon>
            Transcript
          </div>
          <v-btn
            v-if="transcript"
            variant="text"
            size="small"
            color="#c8102e"
            @click="clearTranscript"
          >
            <v-icon start size="16">mdi-delete-outline</v-icon>
            Clear
          </v-btn>
        </div>

        <div class="transcript-area" ref="transcriptArea">
          <p v-if="transcript || interimText" class="transcript-text">
            {{ transcript
            }}<span v-if="interimText" class="interim-text">{{
              interimText
            }}</span>
          </p>
          <p v-else class="text-grey text-center py-8">
            Press "Start Recording" to begin transcription...
          </p>
        </div>

        <!-- Chunk log -->
        <div v-if="chunkLog.length" class="mt-4">
          <div class="text-caption text-grey mb-1">
            Chunk log ({{ chunkLog.length }} chunks processed)
          </div>
          <div class="chunk-log">
            <div
              v-for="(entry, i) in chunkLog"
              :key="i"
              class="chunk-entry text-caption"
            >
              <v-icon
                size="12"
                :color="entry.ok ? 'success' : 'error'"
                class="mr-1"
                >{{ entry.ok ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon
              >
              <span class="text-grey-darken-1">{{ entry.time }}</span>
              —
              <span>{{
                entry.ok
                  ? `"${entry.text.substring(0, 60)}${entry.text.length > 60 ? '...' : ''}"`
                  : entry.error
              }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </v-container>
  </main>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick } from 'vue';
import { toast } from 'vue3-toastify';
import { transcribeAudioChunk } from './speechToTextService.js';

// ── State ──────────────────────────────────────────────
const isRecording = ref(false);
const isMicLoading = ref(false);
const isProcessing = ref(false);
const transcript = ref('');
const interimText = ref('');
const error = ref('');
const audioLevel = ref(0);
const transcriptArea = ref(null);
const chunkLog = ref([]);

// ── Settings ───────────────────────────────────────────
const selectedLanguage = ref('en');
const languages = [
  { label: 'English', code: 'en' },
  { label: 'Spanish', code: 'es' },
  { label: 'French', code: 'fr' },
  { label: 'German', code: 'de' },
  { label: 'Chinese', code: 'zh' },
  { label: 'Japanese', code: 'ja' },
  { label: 'Portuguese', code: 'pt' },
  { label: 'Swedish', code: 'sv' },
];

const chunkDuration = ref(3000);
const chunkOptions = [
  { label: '2 seconds', ms: 2000 },
  { label: '3 seconds', ms: 3000 },
  { label: '5 seconds', ms: 5000 },
  { label: '8 seconds', ms: 8000 },
  { label: '10 seconds', ms: 10000 },
];

// ── Status display ─────────────────────────────────────
const statusLabel = computed(() => {
  if (isMicLoading.value) return 'Requesting mic...';
  if (isProcessing.value) return 'Transcribing...';
  if (isRecording.value) return 'Listening';
  return 'Idle';
});

const statusColor = computed(() => {
  if (isRecording.value) return 'error';
  if (isProcessing.value) return 'warning';
  return 'default';
});

const statusIcon = computed(() => {
  if (isRecording.value) return 'mdi-record-circle';
  if (isProcessing.value) return 'mdi-loading mdi-spin';
  return 'mdi-microphone-off';
});

// ── Audio internals ────────────────────────────────────
let mediaStream = null;
let mediaRecorder = null;
let audioContext = null;
let analyserNode = null;
let animFrameId = null;
let chunkIntervalId = null;
let mimeType = 'audio/webm';

// ── Recording control ──────────────────────────────────
async function toggleRecording() {
  if (isRecording.value) {
    stopRecording();
  } else {
    await startRecording();
  }
}

async function startRecording() {
  error.value = '';
  isMicLoading.value = true;

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    isMicLoading.value = false;
    error.value = `Microphone access denied: ${err.message}`;
    toast.error('Microphone access denied', {
      position: 'top-right',
      toastClassName: 'Toastify__toast--delete',
    });
    return;
  }

  // Audio analyser for level visualisation
  audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(mediaStream);
  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 256;
  source.connect(analyserNode);
  updateAudioLevel();

  mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : 'audio/webm';

  isRecording.value = true;
  isMicLoading.value = false;

  // Start the first cycle — each cycle is a full stop/start so every
  // blob contains a valid WebM header that OpenAI can parse.
  startRecorderCycle();
}

function startRecorderCycle() {
  if (!isRecording.value || !mediaStream) return;

  const chunks = [];
  mediaRecorder = new MediaRecorder(mediaStream, { mimeType });

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    if (chunks.length > 0) {
      const blob = new Blob(chunks, { type: mimeType });
      processChunk(blob);
    }
    // Start next cycle if still recording
    if (isRecording.value) startRecorderCycle();
  };

  mediaRecorder.start();

  // Stop this cycle after the chunk duration to produce a complete file
  chunkIntervalId = setTimeout(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  }, chunkDuration.value);
}

function stopRecording() {
  isRecording.value = false;

  if (chunkIntervalId) {
    clearTimeout(chunkIntervalId);
    chunkIntervalId = null;
  }

  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
    mediaStream = null;
  }

  audioLevel.value = 0;
}

// ── Audio level visualisation ──────────────────────────
function updateAudioLevel() {
  if (!analyserNode) return;

  const data = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(data);

  const avg = data.reduce((sum, v) => sum + v, 0) / data.length;
  audioLevel.value = Math.min(100, (avg / 128) * 100);

  animFrameId = requestAnimationFrame(updateAudioLevel);
}

// ── Transcription ──────────────────────────────────────
async function processChunk(blob) {
  isProcessing.value = true;
  interimText.value = ' ...';
  const timestamp = new Date().toLocaleTimeString();

  try {
    const text = await transcribeAudioChunk(blob, selectedLanguage.value);
    if (text && text.trim()) {
      transcript.value += (transcript.value ? ' ' : '') + text.trim();
      chunkLog.value.push({ time: timestamp, ok: true, text: text.trim() });
      scrollTranscript();
    }
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    chunkLog.value.push({ time: timestamp, ok: false, error: msg });
    toast.error(`Transcription failed: ${msg}`, {
      position: 'top-right',
      toastClassName: 'Toastify__toast--delete',
    });
  } finally {
    isProcessing.value = false;
    interimText.value = '';
  }
}

function clearTranscript() {
  transcript.value = '';
  interimText.value = '';
  chunkLog.value = [];
}

async function scrollTranscript() {
  await nextTick();
  if (transcriptArea.value) {
    transcriptArea.value.scrollTop = transcriptArea.value.scrollHeight;
  }
}

// ── Cleanup ────────────────────────────────────────────
onUnmounted(() => {
  stopRecording();
});
</script>

<style scoped>
.stt-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.audio-level-container {
  width: 100%;
  max-width: 400px;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.audio-level-bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #ff9800, #c8102e);
  border-radius: 4px;
  transition: width 0.1s ease;
}

.transcript-area {
  min-height: 160px;
  max-height: 400px;
  overflow-y: auto;
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
}

.transcript-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #212121;
  white-space: pre-wrap;
  margin: 0;
}

.interim-text {
  color: #9e9e9e;
  font-style: italic;
}

.chunk-log {
  max-height: 150px;
  overflow-y: auto;
  background: #fafafa;
  border-radius: 6px;
  padding: 8px 12px;
  border: 1px solid #eee;
}

.chunk-entry {
  padding: 2px 0;
}
</style>
