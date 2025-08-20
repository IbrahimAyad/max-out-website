import axios from 'axios';

interface VoiceResponse {
  transcript?: string;
  audioUrl?: string;
  audioBase64?: string;
  message?: string;
  intent?: string;
  framework?: string;
}

export class VoiceChatService {
  private apiUrl: string;
  private apiKey: string;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_KCT_API_URL || 'https://kct-knowledge-api-2-production.up.railway.app';
    this.apiKey = process.env.NEXT_PUBLIC_KCT_API_KEY || '';
  }

  // Start recording audio from user's microphone
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Microphone access denied or not available');
    }
  }

  // Stop recording and return the audio blob
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        this.isRecording = false;
        
        // Stop all tracks to release microphone
        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  // Convert audio blob to base64
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Send voice message and get voice response
  async sendVoiceMessage(audioBlob: Blob, sessionId?: string): Promise<VoiceResponse> {
    try {
      const audioBase64 = await this.blobToBase64(audioBlob);
      
      const response = await axios.post(
        `${this.apiUrl}/api/v3/voice/chat`,
        {
          audio: audioBase64,
          format: 'webm',
          sessionId: sessionId,
          returnAudio: true
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('Voice chat error:', error);
      
      // Return a fallback response for CORS or API errors
      if (axios.isAxiosError(error) && (error.code === 'ERR_NETWORK' || error.response?.status === 404)) {
        // Fallback: transcribe only and use text chat
        try {
          const transcript = await this.transcribeAudio(audioBlob);
          return {
            transcript,
            message: "I heard you, but I'm having trouble with voice responses right now. Let me respond with text instead.",
            intent: 'fallback'
          };
        } catch (transcribeError) {
          throw new Error('Voice services are currently unavailable. Please use text chat.');
        }
      }
      
      throw error;
    }
  }

  // Transcribe audio to text only
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const audioBase64 = await this.blobToBase64(audioBlob);
      
      const response = await axios.post(
        `${this.apiUrl}/api/v3/voice/transcribe`,
        {
          audio: audioBase64,
          format: 'webm'
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.transcript || '';
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  }

  // Convert text to speech
  async textToSpeech(text: string, voice?: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/v3/voice/synthesize`,
        {
          text: text,
          voice: voice || 'DTKMou8ccj1ZaWGBiotd', // KCT custom voice
          modelId: 'eleven_monolingual_v1'
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.audioUrl || response.data.audioBase64;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw error;
    }
  }

  // Play audio from URL or base64
  async playAudio(audioSource: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      // If it's base64, convert to blob URL
      if (audioSource.startsWith('data:') || !audioSource.startsWith('http')) {
        const base64 = audioSource.includes(',') ? audioSource.split(',')[1] : audioSource;
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/mpeg' });
        audioSource = URL.createObjectURL(blob);
      }
      
      audio.src = audioSource;
      audio.onended = () => resolve();
      audio.onerror = (error) => reject(error);
      
      audio.play().catch(reject);
    });
  }

  // Check if currently recording
  getIsRecording(): boolean {
    return this.isRecording;
  }

  // Clean up resources
  cleanup(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
  }
}

// Singleton instance
export const voiceChatService = new VoiceChatService();