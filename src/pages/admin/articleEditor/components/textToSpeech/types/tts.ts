export interface DialogueLine {
  role: 'host' | 'guest';
  text: string;
}

export interface VoiceConfig {
  voice: number;
  speed: number;
  pitch: number;
  volume: number;
}

export const VOICE_CONFIGS: Record<'host' | 'guest', VoiceConfig> = {
  host: {
    voice: 0,  // 女声
    speed: 5,
    pitch: 5,
    volume: 5
  },
  guest: {
    voice: 1,  // 男声
    speed: 5,
    pitch: 5,
    volume: 5
  }
};