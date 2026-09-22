import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sliders,
  Check,
  Music,
  Mic,
  Film,
  X,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoBlueprint, VideoScene } from '../types';
import sampleSplitThumbnail from '../assets/images/earning_split_thumbnail_1788401022413.jpg';
import { detectTopicCategory } from '../services/clientFallbackService';

interface InAppVideoStudioProps {
  blueprint: VideoBlueprint;
  topic?: string;
  onClose?: () => void;
  isOpen?: boolean;
}

export const InAppVideoStudio: React.FC<InAppVideoStudioProps> = ({
  blueprint,
  topic,
  onClose,
  isOpen = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Settings & Playback State
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0); // 0 to 1
  const [totalTimeElapsed, setTotalTimeElapsed] = useState<number>(0);
  const [isMutedVoice, setIsMutedVoice] = useState<boolean>(false);
  const [isMutedMusic, setIsMutedMusic] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(0.2);
  const [speechRate, setSpeechRate] = useState<number>(1.05);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [selectedThemeStyle, setSelectedThemeStyle] = useState<'neon' | 'cyber' | 'gold' | 'cinematic'>('neon');
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [customSceneImages, setCustomSceneImages] = useState<Record<number, string>>({});
  const [studioToast, setStudioToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Synchronous references to avoid closure lag & unnecessary 60fps re-renders
  const isPlayingRef = useRef<boolean>(false);
  const currentSceneIdxRef = useRef<number>(0);
  const sceneElapsedRef = useRef<number>(0);
  const totalElapsedRef = useRef<number>(0);
  const lastUiUpdateRef = useRef<number>(0);

  // Audio Context and Synths
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const musicIntervalRef = useRef<number | null>(null);

  // Scenes list from blueprint with safe fallback
  const scenes: VideoScene[] = blueprint && blueprint.scenes && blueprint.scenes.length > 0
    ? blueprint.scenes
    : [
        {
          sceneNumber: 1,
          timeRange: '0:00 - 0:08',
          duration: '8s',
          sceneTitle: 'Curiosity Hook',
          visualDescription: 'Split screen comparing empty wallet vs digital wealth.',
          imagePrompt: 'Cinematic smartphone receiving continuous revenue alerts',
          caption: 'रुको! 2026 की ये AI ट्रिक मत छोड़ना ⚡',
          onScreenText: 'रुको! 2026 की ये AI ट्रिक मत छोड़ना ⚡',
          voiceover: 'अगर आपके पास सिर्फ एक स्मार्टफोन और दिन का 1 घंटा है, तो यह AI तरीका आपकी जिंदगी बदल सकता है!',
          voiceoverScript: 'अगर आपके पास सिर्फ एक स्मार्टफोन और दिन का 1 घंटा है, तो यह AI तरीका आपकी जिंदगी बदल सकता है!',
          transition: 'Whip Pan Right',
          bgmCue: 'Punchy riser & whoosh'
        }
      ];

  // Helper to parse duration in seconds
  const getSceneDurationSeconds = useCallback((scene?: VideoScene): number => {
    if (!scene) return 8;
    const raw = scene.duration || '8s';
    const num = parseFloat(raw.replace(/[^\d.]/g, ''));
    return isNaN(num) || num <= 0 ? 8 : num;
  }, []);

  const currentScene = scenes[currentSceneIdx] || scenes[0];
  const currentSceneDuration = getSceneDurationSeconds(currentScene);
  const totalVideoDuration = scenes.reduce((acc, s) => acc + getSceneDurationSeconds(s), 0);

  // Pre-load images cache
  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const img = new Image();
    img.src = sampleSplitThumbnail;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCacheRef.current['sample'] = img;
    };
  }, []);

  // Show friendly toast inside studio
  const showStudioToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setStudioToast({ text, type });
    setTimeout(() => setStudioToast(null), 3500);
  };

  // Safe Web Audio Synthesizer: Ambient Upbeat Music
  const initAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioCtxRef.current = ctx;

          if (typeof ctx.createMediaStreamDestination === 'function') {
            try {
              audioDestinationRef.current = ctx.createMediaStreamDestination();
            } catch (err) {
              console.warn('Destination creation skipped:', err);
            }
          }

          const musicGain = ctx.createGain();
          musicGain.gain.setValueAtTime(isMutedMusic ? 0 : musicVolume, ctx.currentTime);
          musicGain.connect(ctx.destination);
          if (audioDestinationRef.current) {
            try {
              musicGain.connect(audioDestinationRef.current);
            } catch (err) {}
          }
          musicGainRef.current = musicGain;
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('AudioContext init notice:', e);
    }
  }, [isMutedMusic, musicVolume]);

  // Procedural electronic synth beat
  const triggerSynthBeat = useCallback((time: number, isBarStart: boolean) => {
    if (!audioCtxRef.current || !musicGainRef.current || isMutedMusic) return;
    try {
      const ctx = audioCtxRef.current;
      const gainNode = musicGainRef.current;

      // Kick Drum
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(140, time);
      kickOsc.frequency.exponentialRampToValueAtTime(32, time + 0.16);

      kickGain.gain.setValueAtTime(0.3, time);
      kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      kickOsc.connect(kickGain);
      kickGain.connect(gainNode);
      kickOsc.start(time);
      kickOsc.stop(time + 0.2);

      // Hi-hat
      const hatOsc = ctx.createOscillator();
      const hatGain = ctx.createGain();
      hatOsc.type = 'triangle';
      hatOsc.frequency.setValueAtTime(1400 + Math.random() * 600, time);
      hatGain.gain.setValueAtTime(0.06, time);
      hatGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      hatOsc.connect(hatGain);
      hatGain.connect(gainNode);
      hatOsc.start(time);
      hatOsc.stop(time + 0.06);

      // Harmonious chords on bar start
      if (isBarStart) {
        const chordFreqs = [220, 261.63, 329.63, 392];
        chordFreqs.forEach((freq) => {
          const chordOsc = ctx.createOscillator();
          const chordG = ctx.createGain();
          chordOsc.type = 'sine';
          chordOsc.frequency.setValueAtTime(freq, time);

          chordG.gain.setValueAtTime(0.04, time);
          chordG.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

          chordOsc.connect(chordG);
          chordG.connect(gainNode);
          chordOsc.start(time);
          chordOsc.stop(time + 0.5);
        });
      }
    } catch (e) {
      // Ignore synth errors
    }
  }, [isMutedMusic]);

  // Start music loop
  const startMusicLoop = useCallback(() => {
    initAudio();
    if (musicIntervalRef.current) clearInterval(musicIntervalRef.current);

    let step = 0;
    const interval = (60 / 128) * 1000 * 0.5; // 128 BPM
    musicIntervalRef.current = window.setInterval(() => {
      if (audioCtxRef.current) {
        triggerSynthBeat(audioCtxRef.current.currentTime, step % 8 === 0);
        step++;
      }
    }, interval);
  }, [initAudio, triggerSynthBeat]);

  const stopMusicLoop = useCallback(() => {
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current);
      musicIntervalRef.current = null;
    }
  }, []);

  // Voiceover Narration via Web Speech API
  const speakVoiceover = useCallback((text: string) => {
    if (isMutedVoice || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      if (!text || text.trim().length === 0) return;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('hi-in') ||
          v.lang.toLowerCase().includes('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.lang.toLowerCase().includes('en-in')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Voiceover synthesis notice:', e);
    }
  }, [isMutedVoice, speechRate]);

  const stopVoiceover = useCallback(() => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch (e) {}
  }, []);

  const effectiveTopic = (topic || blueprint?.videoTitle || 'AI Shorts').trim();
  const topicInfo = detectTopicCategory(effectiveTopic);

  // Safe roundRect helper for CanvasRenderingContext2D
  const drawRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(x, y, w, h, r);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  };

  // Canvas Drawing Engine
  const renderFrame = useCallback((elapsedSec: number, sceneIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const width = canvas.width;
      const height = canvas.height;
      const scene = scenes[sceneIdx] || scenes[0];
      const duration = getSceneDurationSeconds(scene);
      const progress = Math.min(1, Math.max(0, elapsedSec / duration));

      // 1. Clear background
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // 2. Ken Burns zoom factor
      const zoom = 1.0 + progress * 0.12;
      const panX = Math.sin(progress * Math.PI) * (width * 0.03);
      const panY = Math.cos(progress * Math.PI) * (height * 0.02);

      ctx.save();
      ctx.translate(width / 2 + panX, height / 2 + panY);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      // 3. Draw Scene Visual
      const customImgSrc = customSceneImages[scene.sceneNumber];
      const cachedSample = imageCacheRef.current['sample'];
      const isFinanceTopic = topicInfo.category === 'finance';

      if (customImgSrc && imageCacheRef.current[customImgSrc]) {
        const img = imageCacheRef.current[customImgSrc];
        ctx.drawImage(img, 0, 0, width, height);
      } else if (scene.sceneNumber === 1 && cachedSample && isFinanceTopic) {
        ctx.drawImage(cachedSample, 0, 0, width, height);
      } else {
        // Procedural cinematic background dynamically matched to topic category
        const grad = ctx.createLinearGradient(0, 0, width, height);
        if (topicInfo.category === 'sports') {
          grad.addColorStop(0, '#020617');
          grad.addColorStop(0.5, '#0c4a6e');
          grad.addColorStop(1, '#0369a1');
        } else if (topicInfo.category === 'food') {
          grad.addColorStop(0, '#1c0a00');
          grad.addColorStop(0.5, '#431407');
          grad.addColorStop(1, '#9a3412');
        } else if (topicInfo.category === 'fitness') {
          grad.addColorStop(0, '#180404');
          grad.addColorStop(0.5, '#450a0a');
          grad.addColorStop(1, '#991b1b');
        } else if (topicInfo.category === 'tech') {
          grad.addColorStop(0, '#03071e');
          grad.addColorStop(0.5, '#082f49');
          grad.addColorStop(1, '#0e7490');
        } else if (topicInfo.category === 'finance') {
          grad.addColorStop(0, '#022c22');
          grad.addColorStop(0.5, '#064e3b');
          grad.addColorStop(1, '#15803d');
        } else if (topicInfo.category === 'education') {
          grad.addColorStop(0, '#06081e');
          grad.addColorStop(0.5, '#1e1b4b');
          grad.addColorStop(1, '#3730a3');
        } else if (topicInfo.category === 'motivation') {
          grad.addColorStop(0, '#1c1917');
          grad.addColorStop(0.5, '#451a03');
          grad.addColorStop(1, '#b45309');
        } else if (topicInfo.category === 'entertainment') {
          grad.addColorStop(0, '#15021c');
          grad.addColorStop(0.5, '#3b0764');
          grad.addColorStop(1, '#7e22ce');
        } else if (selectedThemeStyle === 'cyber') {
          grad.addColorStop(0, '#1e1b4b');
          grad.addColorStop(0.5, '#083344');
          grad.addColorStop(1, '#020617');
        } else if (selectedThemeStyle === 'gold') {
          grad.addColorStop(0, '#291804');
          grad.addColorStop(0.5, '#451a03');
          grad.addColorStop(1, '#0c0a09');
        } else {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#022c22');
          grad.addColorStop(1, '#05050a');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Tech grid lines or category-specific ambient procedural graphics
        if (topicInfo.category === 'sports') {
          ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
          ctx.lineWidth = 2;
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(-width * 0.2 + i * (width * 0.35), 0);
            ctx.lineTo(width * 0.4 + i * (width * 0.35), height);
            ctx.stroke();
          }
        } else if (topicInfo.category === 'fitness') {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          const midY = height * 0.48;
          ctx.moveTo(0, midY);
          ctx.lineTo(width * 0.3, midY);
          ctx.lineTo(width * 0.38, midY - 60);
          ctx.lineTo(width * 0.44, midY + 70);
          ctx.lineTo(width * 0.5, midY - 40);
          ctx.lineTo(width * 0.56, midY + 20);
          ctx.lineTo(width * 0.62, midY);
          ctx.lineTo(width, midY);
          ctx.stroke();
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 1;
          const gridSize = 40;
          for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
        }

        // Center visual glow
        const radial = ctx.createRadialGradient(
          width * 0.5,
          height * 0.42,
          10,
          width * 0.5,
          height * 0.42,
          width * 0.55
        );
        radial.addColorStop(0, `${topicInfo.accentColor}44`);
        radial.addColorStop(0.5, `${topicInfo.accentColor}15`);
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, width, height);

        // Central Icon Badge with animated ring
        const iconY = height * 0.38;
        const ringPulse = 54 + Math.sin(progress * Math.PI) * 4;
        ctx.beginPath();
        ctx.arc(width / 2, iconY, ringPulse, 0, Math.PI * 2);
        ctx.fillStyle = `${topicInfo.accentColor}22`;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = topicInfo.accentColor;
        ctx.stroke();

        // Topic Icon inside circle
        const displayIcon = scene.sceneNumber === 1
          ? topicInfo.icon
          : (scene.sceneNumber === 2 ? '⚡' : scene.sceneNumber === 3 ? '🔥' : scene.sceneNumber === 4 ? '🎯' : '🚀');

        ctx.font = 'bold 50px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(displayIcon, width / 2, iconY + 18);

        // Scene Title Pill
        ctx.save();
        ctx.font = 'bold 15px sans-serif';
        const stWidth = ctx.measureText(scene.sceneTitle).width;
        const stPillW = stWidth + 24;
        const stPillH = 28;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        drawRoundRect(ctx, width / 2 - stPillW / 2, iconY + 70, stPillW, stPillH, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#f3f4f6';
        ctx.textAlign = 'center';
        ctx.fillText(scene.sceneTitle, width / 2, iconY + 89);
        ctx.restore();
      }

      ctx.restore();

      // 4. Subtle particles
      for (let i = 0; i < 18; i++) {
        const seed = i * 137.5;
        const px = (Math.sin(seed + progress * 2) * 0.5 + 0.5) * width;
        const py = (seed * 11 + progress * 250) % height;
        const pr = 1.5 + (i % 3);
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(250, 204, 21, 0.45)' : `${topicInfo.accentColor}66`;
        ctx.fill();
      }

      // 5. Vignette
      const vignette = ctx.createLinearGradient(0, 0, 0, height);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      vignette.addColorStop(0.18, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.65, 'rgba(0, 0, 0, 0.2)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // 6. Top Scene Progress Segment Bars (Stories / Reels style)
      const barPadding = 12;
      const barGap = 4;
      const totalBars = scenes.length;
      const availableWidth = width - barPadding * 2 - (totalBars - 1) * barGap;
      const barWidth = Math.max(10, availableWidth / totalBars);
      const barHeight = 4;
      const barY = 16;

      for (let i = 0; i < totalBars; i++) {
        const bx = barPadding + i * (barWidth + barGap);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(bx, barY, barWidth, barHeight);

        if (i < sceneIdx) {
          ctx.fillStyle = topicInfo.accentColor;
          ctx.fillRect(bx, barY, barWidth, barHeight);
        } else if (i === sceneIdx) {
          ctx.fillStyle = '#fde047';
          ctx.fillRect(bx, barY, barWidth * progress, barHeight);
        }
      }

      // Scene number badge
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = topicInfo.accentColor;
      ctx.textAlign = 'left';
      ctx.fillText(`SCENE ${scene.sceneNumber}/${scenes.length} • ${topicInfo.hookKeyword}`, barPadding, barY + 20);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(`${elapsedSec.toFixed(1)}s / ${duration}s`, width - barPadding, barY + 20);

      // TOP TOPIC BADGE PILL (Matches the user's topic 100%!)
      ctx.save();
      const topicPillText = `${topicInfo.icon} ${effectiveTopic.slice(0, 26)}`;
      ctx.font = 'bold 12px sans-serif';
      const tpWidth = ctx.measureText(topicPillText).width;
      const tpBoxW = tpWidth + 20;
      const tpBoxH = 22;
      const tpBoxX = width / 2 - tpBoxW / 2;
      const tpBoxY = barY + 28;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      drawRoundRect(ctx, tpBoxX, tpBoxY, tpBoxW, tpBoxH, 11);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = `${topicInfo.accentColor}88`;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(topicPillText, width / 2, tpBoxY + tpBoxH / 2);
      ctx.restore();

      // 7. Kinetic Captions (Viral bold style)
      const captionText = scene.caption || scene.onScreenText || '';
      if (captionText) {
        const words = captionText.split(' ').filter(Boolean);
        ctx.save();
        const fontSize = aspectRatio === '9:16' ? 32 : 36;
        ctx.font = `900 ${fontSize}px Impact, "Arial Black", Montserrat, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxCharsPerLine = aspectRatio === '9:16' ? 18 : 28;
        const lines: string[] = [];
        let curLine = '';

        words.forEach((w) => {
          if ((curLine + ' ' + w).trim().length > maxCharsPerLine) {
            lines.push(curLine.trim());
            curLine = w;
          } else {
            curLine = curLine ? curLine + ' ' + w : w;
          }
        });
        if (curLine) lines.push(curLine.trim());

        const lineHeight = fontSize * 1.25;
        const totalTextHeight = lines.length * lineHeight;
        const startY = height * (aspectRatio === '9:16' ? 0.72 : 0.76) - totalTextHeight / 2;

        const maxLineWidth = Math.max(...lines.map((l) => ctx.measureText(l).width), 100);
        const boxPadding = 18;

        // Background pill
        ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
        ctx.beginPath();
        drawRoundRect(
          ctx,
          width / 2 - maxLineWidth / 2 - boxPadding,
          startY - lineHeight / 2 - 8,
          maxLineWidth + boxPadding * 2,
          totalTextHeight + boxPadding * 1.5,
          14
        );
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.35)';
        ctx.stroke();

        // Render each line with thick black outline
        lines.forEach((lineStr, lineIdx) => {
          const lineY = startY + lineIdx * lineHeight;
          ctx.lineWidth = 6;
          ctx.strokeStyle = '#000000';
          ctx.lineJoin = 'round';
          ctx.strokeText(lineStr, width / 2, lineY);

          ctx.fillStyle = lineIdx === lines.length - 1 ? '#fde047' : '#ffffff';
          ctx.fillText(lineStr, width / 2, lineY);
        });

        ctx.restore();
      }

      // 8. Bottom Brand watermark (shows topic name)
      ctx.save();
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText(`⚡ ${effectiveTopic.toUpperCase().slice(0, 26)} • AI STUDIO`, width / 2, height - 16);
      ctx.restore();
    } catch (err) {
      console.warn('Canvas renderFrame notice:', err);
    }
  }, [scenes, aspectRatio, customSceneImages, selectedThemeStyle, getSceneDurationSeconds, effectiveTopic, topicInfo]);

  // Initial draw & Blueprint change sync
  useEffect(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    stopMusicLoop();
    stopVoiceover();
    setCurrentSceneIdx(0);
    currentSceneIdxRef.current = 0;
    sceneElapsedRef.current = 0;
    totalElapsedRef.current = 0;
    setSceneProgress(0);
    setTotalTimeElapsed(0);

    const timer = setTimeout(() => {
      renderFrame(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [blueprint, aspectRatio, selectedThemeStyle, renderFrame, stopMusicLoop, stopVoiceover]);

  // High performance 60fps Animation Loop with decoupled React state updates
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      if (!isPlayingRef.current) return;

      const delta = Math.min((now - lastTimestamp) / 1000, 0.1); // cap delta to prevent jumps
      lastTimestamp = now;

      sceneElapsedRef.current += delta;
      totalElapsedRef.current += delta;

      const sIdx = currentSceneIdxRef.current;
      const currentSc = scenes[sIdx] || scenes[0];
      const scDuration = getSceneDurationSeconds(currentSc);

      // Render directly to canvas (60 FPS, 0 React overhead)
      renderFrame(sceneElapsedRef.current, sIdx);

      // Throttled UI state updates (~10 times/sec) so button interactions stay instant
      if (now - lastUiUpdateRef.current > 100) {
        lastUiUpdateRef.current = now;
        setSceneProgress(Math.min(1, sceneElapsedRef.current / scDuration));
        setTotalTimeElapsed(totalElapsedRef.current);
      }

      // Check scene transition
      if (sceneElapsedRef.current >= scDuration) {
        if (currentSceneIdxRef.current < scenes.length - 1) {
          const nextIdx = currentSceneIdxRef.current + 1;
          currentSceneIdxRef.current = nextIdx;
          sceneElapsedRef.current = 0;
          setCurrentSceneIdx(nextIdx);
          setSceneProgress(0);
          speakVoiceover(scenes[nextIdx].voiceover || scenes[nextIdx].onScreenText);
        } else {
          // Video finished
          isPlayingRef.current = false;
          setIsPlaying(false);
          stopMusicLoop();
          stopVoiceover();
          setSceneProgress(1);
          setTotalTimeElapsed(totalVideoDuration);
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    isPlayingRef.current = true;
    lastTimestamp = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, scenes, renderFrame, getSceneDurationSeconds, speakVoiceover, stopMusicLoop, stopVoiceover, totalVideoDuration]);

  // Handle Play/Pause
  const handleTogglePlay = () => {
    try {
      if (isPlaying) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        stopMusicLoop();
        stopVoiceover();
      } else {
        // If at end of video, restart from beginning
        if (currentSceneIdx >= scenes.length - 1 && sceneProgress >= 0.98) {
          currentSceneIdxRef.current = 0;
          sceneElapsedRef.current = 0;
          totalElapsedRef.current = 0;
          setCurrentSceneIdx(0);
          setSceneProgress(0);
          setTotalTimeElapsed(0);
        }

        initAudio();
        startMusicLoop();

        isPlayingRef.current = true;
        setIsPlaying(true);

        const activeIdx = currentSceneIdxRef.current;
        const scene = scenes[activeIdx] || scenes[0];
        if (scene) {
          speakVoiceover(scene.voiceover || scene.onScreenText);
        }
      }
    } catch (err) {
      console.warn('handleTogglePlay notice:', err);
    }
  };

  // Handle Restart
  const handleRestart = () => {
    try {
      isPlayingRef.current = false;
      setIsPlaying(false);
      stopMusicLoop();
      stopVoiceover();
      currentSceneIdxRef.current = 0;
      sceneElapsedRef.current = 0;
      totalElapsedRef.current = 0;
      setCurrentSceneIdx(0);
      setSceneProgress(0);
      setTotalTimeElapsed(0);
      renderFrame(0, 0);
      showStudioToast('वीडियो शुरू से रीसेट हो गया', 'info');
    } catch (err) {
      console.warn('handleRestart error:', err);
    }
  };

  // Handle Jump to Scene
  const handleJumpToScene = (idx: number) => {
    try {
      const targetIdx = Math.max(0, Math.min(scenes.length - 1, idx));
      currentSceneIdxRef.current = targetIdx;
      sceneElapsedRef.current = 0;
      setCurrentSceneIdx(targetIdx);
      setSceneProgress(0);

      // Calculate new total elapsed time up to this scene
      let accumulatedTime = 0;
      for (let i = 0; i < targetIdx; i++) {
        accumulatedTime += getSceneDurationSeconds(scenes[i]);
      }
      totalElapsedRef.current = accumulatedTime;
      setTotalTimeElapsed(accumulatedTime);

      renderFrame(0, targetIdx);

      if (isPlayingRef.current) {
        stopVoiceover();
        const sc = scenes[targetIdx];
        if (sc) {
          speakVoiceover(sc.voiceover || sc.onScreenText);
        }
      }
    } catch (err) {
      console.warn('handleJumpToScene error:', err);
    }
  };

  // Video Export Engine (MediaRecorder + Canvas Stream + Web Audio with instant fallbacks)
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      showStudioToast('कैनवास उपलब्ध नहीं है।', 'error');
      return;
    }

    // Stop playback during export
    isPlayingRef.current = false;
    setIsPlaying(false);
    stopMusicLoop();
    stopVoiceover();

    setIsRecording(true);
    setRecordProgress(5);

    try {
      // Check if canvas captureStream is available
      const captureStreamFn = (canvas as any).captureStream || (canvas as any).mozCaptureStream;
      if (typeof captureStreamFn !== 'function' || typeof window.MediaRecorder === 'undefined') {
        // Fallback: Export high resolution storyboard keyframes
        await fallbackExportKeyframes();
        return;
      }

      initAudio();
      const canvasStream: MediaStream = captureStreamFn.call(canvas, 30);

      if (audioDestinationRef.current) {
        try {
          const audioTracks = audioDestinationRef.current.stream.getAudioTracks();
          audioTracks.forEach((track) => canvasStream.addTrack(track));
        } catch (e) {}
      }

      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }

      const recorder = new MediaRecorder(canvasStream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
        videoBitsPerSecond: 4000000
      });

      const recordedChunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      const exportPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: mimeType || 'video/webm' });
          resolve(blob);
        };
      });

      recorder.start();
      startMusicLoop();

      const totalScenes = scenes.length;
      const fps = 25;

      for (let sIdx = 0; sIdx < totalScenes; sIdx++) {
        const sc = scenes[sIdx];
        const scDuration = getSceneDurationSeconds(sc);
        const totalFrames = Math.floor(scDuration * fps);

        speakVoiceover(sc.voiceover || sc.onScreenText);

        for (let f = 0; f < totalFrames; f += 2) {
          const elapsed = f / fps;
          renderFrame(elapsed, sIdx);
          const percent = Math.min(95, Math.round(((sIdx + f / totalFrames) / totalScenes) * 100));
          setRecordProgress(percent);
          await new Promise((r) => setTimeout(r, (1000 / fps) * 2));
        }
      }

      stopMusicLoop();
      stopVoiceover();
      recorder.stop();

      const finalBlob = await exportPromise;
      const url = URL.createObjectURL(finalBlob);
      setIsRecording(false);
      setRecordProgress(100);

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_viral_video_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showStudioToast('🎉 वीडियो सफलतापूर्वक डाउनलोड हो गया!', 'success');
    } catch (err) {
      console.warn('Video export standard flow failed, triggering fallback poster export:', err);
      await fallbackExportKeyframes();
    } finally {
      setIsRecording(false);
    }
  };

  // Fallback: Export high resolution current canvas image
  const fallbackExportKeyframes = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      renderFrame(1, currentSceneIdxRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `scene_${currentSceneIdxRef.current + 1}_keyframe.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showStudioToast('सीन की HD कीफ्रेम इमेज डाउनलोड हो गई!', 'success');
    } catch (e) {
      showStudioToast('इमेज डाउनलोड करने में असमर्थ। कृपया पुनः प्रयास करें।', 'error');
    }
  };

  // Image Upload handler for custom scene visual
  const handleImageUpload = (sceneNum: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const img = new Image();
        img.onload = () => {
          imageCacheRef.current[dataUrl] = img;
          setCustomSceneImages((prev) => ({ ...prev, [sceneNum]: dataUrl }));
          renderFrame(sceneElapsedRef.current, currentSceneIdxRef.current);
          showStudioToast(`Scene ${sceneNum} में कस्टम इमेज लग गई!`, 'success');
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div
      id="in-app-video-studio-container"
      className="p-4 sm:p-6 rounded-3xl bg-[#09090d] border border-emerald-500/40 shadow-2xl space-y-4 text-white animate-in fade-in duration-300 relative"
    >
      {/* Studio In-UI Notification Toast */}
      {studioToast && (
        <div className="absolute top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-200">
          <div
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xl backdrop-blur-md border ${
              studioToast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                : studioToast.type === 'error'
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/50'
                : 'bg-[#181822] text-gray-200 border-[#333344]'
            }`}
          >
            {studioToast.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span>{studioToast.text}</span>
          </div>
        </div>
      )}

      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e1e26]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                <span>इन-ऐप डायरेक्ट AI वीडियो स्टूडियो</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                0 Cost • Runs Locally
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                HD 60FPS Player
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              बिना किसी बाहरी ऐप के, यहीं वीडियो चलाएं, एडिट करें और तुरंत MP4/WebM में डाउनलोड करें
            </p>
          </div>
        </div>

        {/* Right controls: Aspect Ratio & Settings */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Aspect Ratio Toggle */}
          <div className="flex items-center bg-[#13131a] p-1 rounded-xl border border-[#252530]">
            <button
              type="button"
              id="ratio-btn-9-16"
              onClick={() => {
                setAspectRatio('9:16');
                setTimeout(() => renderFrame(sceneElapsedRef.current, currentSceneIdxRef.current), 50);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                aspectRatio === '9:16'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              9:16 Shorts
            </button>
            <button
              type="button"
              id="ratio-btn-16-9"
              onClick={() => {
                setAspectRatio('16:9');
                setTimeout(() => renderFrame(sceneElapsedRef.current, currentSceneIdxRef.current), 50);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                aspectRatio === '16:9'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              16:9 YT
            </button>
          </div>

          <button
            type="button"
            id="studio-settings-drawer-btn"
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              showSettingsDrawer
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-[#13131a] text-gray-400 hover:text-white border-[#252530]'
            }`}
            title="ऑडियो व स्टाइल सेटिंग्स"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-[#1c1c24] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Video Stage / Canvas Player */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-3">
          <div
            className={`relative rounded-2xl overflow-hidden border border-[#272733] bg-black shadow-2xl transition-all duration-300 ${
              aspectRatio === '9:16'
                ? 'w-full max-w-[340px] aspect-[9/16]'
                : 'w-full aspect-video'
            }`}
          >
            <canvas
              ref={canvasRef}
              width={aspectRatio === '9:16' ? 720 : 1280}
              height={aspectRatio === '9:16' ? 1280 : 720}
              className="w-full h-full object-contain cursor-pointer"
              onClick={handleTogglePlay}
            />

            {/* Overlay Play Button when paused */}
            {!isPlaying && (
              <div
                id="canvas-play-overlay-btn"
                onClick={handleTogglePlay}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity hover:bg-black/30 select-none"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-xl shadow-emerald-950/60 hover:scale-110 active:scale-95 transition-transform">
                  <Play className="w-8 h-8 translate-x-0.5 fill-white" />
                </div>
                <span className="text-xs font-mono text-emerald-300 font-bold bg-black/70 px-3 py-1 rounded-full border border-emerald-500/30 shadow">
                  वीडियो चलाएं (Tap to Play)
                </span>
              </div>
            )}

            {/* Recording Indicator Overlay */}
            {isRecording && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
                <div className="w-12 h-12 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    HD वीडियो तैयार और रेंडर हो रहा है...
                  </h4>
                  <p className="text-xs text-gray-400 font-mono">
                    सीन्स, काइनेटिक टेक्स्ट और ऑडियो ट्रैक कंपोज़ हो रहे हैं: {recordProgress}%
                  </p>
                </div>
                <div className="w-48 bg-[#1f1f28] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${recordProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Player Controls */}
          <div className="w-full max-w-[420px] bg-[#101016] border border-[#22222d] rounded-2xl p-3 space-y-2.5 shadow-lg">
            {/* Timeline Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>
                  सीन {currentSceneIdx + 1}/{scenes.length}: {currentScene.sceneTitle}
                </span>
                <span className="text-emerald-400">
                  {totalTimeElapsed.toFixed(1)}s / {totalVideoDuration.toFixed(1)}s
                </span>
              </div>
              <div
                id="studio-timeline-scrub"
                className="w-full bg-[#1c1c26] h-2 rounded-full overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  const targetSceneIdx = Math.min(
                    scenes.length - 1,
                    Math.floor(pos * scenes.length)
                  );
                  handleJumpToScene(targetSceneIdx);
                }}
              >
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-100"
                  style={{
                    width: `${Math.min(100, ((currentSceneIdx + sceneProgress) / scenes.length) * 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  id="studio-restart-btn"
                  onClick={handleRestart}
                  className="p-2 rounded-xl bg-[#16161f] text-gray-300 hover:text-white hover:bg-[#20202c] transition-colors cursor-pointer active:scale-95"
                  title="शुरू से चलाएं (Restart)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="studio-prev-scene-btn"
                  onClick={() => handleJumpToScene(currentSceneIdx - 1)}
                  disabled={currentSceneIdx === 0}
                  className="p-2 rounded-xl bg-[#16161f] text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#20202c] transition-colors cursor-pointer active:scale-95"
                  title="पिछला दृश्य (Previous Scene)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="studio-play-pause-btn"
                  onClick={handleTogglePlay}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Video</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="studio-next-scene-btn"
                  onClick={() => handleJumpToScene(currentSceneIdx + 1)}
                  disabled={currentSceneIdx >= scenes.length - 1}
                  className="p-2 rounded-xl bg-[#16161f] text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#20202c] transition-colors cursor-pointer active:scale-95"
                  title="अगला दृश्य (Next Scene)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Audio & Export Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  id="studio-voice-mute-btn"
                  onClick={() => {
                    const next = !isMutedVoice;
                    setIsMutedVoice(next);
                    if (next) stopVoiceover();
                    showStudioToast(next ? 'वॉयसओवर म्यूट किया गया' : 'वॉयसओवर चालू किया गया', 'info');
                  }}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer active:scale-95 ${
                    isMutedVoice
                      ? 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                      : 'bg-[#16161f] text-gray-300 border-[#2b2b38] hover:text-white'
                  }`}
                  title={isMutedVoice ? 'वॉयसओवर चालू करें' : 'वॉयसओवर म्यूट करें'}
                >
                  {isMutedVoice ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  id="studio-music-mute-btn"
                  onClick={() => {
                    const next = !isMutedMusic;
                    setIsMutedMusic(next);
                    if (musicGainRef.current && audioCtxRef.current) {
                      musicGainRef.current.gain.setValueAtTime(
                        next ? 0 : musicVolume,
                        audioCtxRef.current.currentTime
                      );
                    }
                    showStudioToast(next ? 'बैकग्राउंड संगीत म्यूट' : 'संगीत चालू', 'info');
                  }}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer active:scale-95 ${
                    isMutedMusic
                      ? 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                      : 'bg-[#16161f] text-gray-300 border-[#2b2b38] hover:text-white'
                  }`}
                  title={isMutedMusic ? 'बैकग्राउंड संगीत चालू करें' : 'संगीत म्यूट करें'}
                >
                  {isMutedMusic ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Music className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  id="studio-export-video-btn"
                  onClick={handleExportVideo}
                  disabled={isRecording}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-950/50 active:scale-95"
                  title="पूर्ण वीडियो फ़ाइल (MP4/WebM) सीधे डाउनलोड करें"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scene Storyboard Details & Scene Editor */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Scene Card */}
          <div className="p-4 rounded-2xl bg-[#0f0f15] border border-emerald-500/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center border border-emerald-500/30">
                  {currentScene.sceneNumber}
                </span>
                <h4 className="text-sm font-bold text-white">
                  {currentScene.sceneTitle}
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#1b1b26] text-gray-300 font-mono text-[10px] border border-[#2f2f3e]">
                ⏱️ {currentScene.duration || '8s'}
              </span>
            </div>

            {/* Caption on Screen */}
            <div className="p-3 rounded-xl bg-[#08080c] border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold">
                <span>ON-SCREEN CAPTION (स्क्रीन टेक्स्ट):</span>
              </div>
              <p className="text-xs font-bold text-amber-200 leading-snug">
                "{currentScene.caption || currentScene.onScreenText}"
              </p>
            </div>

            {/* Voiceover Script */}
            <div className="p-3 rounded-xl bg-[#08080c] border border-[#232330] space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold">
                <span>VOICEOVER NARRATION (आवाज़):</span>
                <button
                  type="button"
                  id="studio-speak-scene-btn"
                  onClick={() => speakVoiceover(currentScene.voiceover || currentScene.onScreenText)}
                  className="text-gray-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>सुने</span>
                </button>
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                {currentScene.voiceover || currentScene.voiceoverScript}
              </p>
            </div>

            {/* Visual Direction & Custom Image Upload */}
            <div className="p-3 rounded-xl bg-[#08080c] border border-[#232330] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold">
                <span>SCENE VISUAL (दृश्य व इमेज):</span>
                <label className="text-[10px] text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer underline active:scale-95">
                  <ImageIcon className="w-3 h-3" />
                  <span>अपनी फोटो लगाएं</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(currentScene.sceneNumber, file);
                    }}
                  />
                </label>
              </div>
              <p className="text-[11px] text-gray-400 font-mono leading-relaxed line-clamp-3">
                {currentScene.imagePrompt || currentScene.visualDescription}
              </p>
            </div>
          </div>

          {/* Quick Scene Selector Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-gray-400 block font-semibold">
              सभी सीन्स (JUMP TO SCENE):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {scenes.map((sc, idx) => {
                const isActive = currentSceneIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    id={`studio-jump-scene-pill-${idx}`}
                    onClick={() => handleJumpToScene(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-[#101016] border-[#22222d] text-gray-400 hover:text-white hover:border-[#383846]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-emerald-400">Scene {sc.sceneNumber}</span>
                      <span>{sc.duration || '8s'}</span>
                    </div>
                    <p className="text-[11px] font-medium text-gray-200 truncate mt-1">
                      {sc.sceneTitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Drawer (Expandable) */}
          {showSettingsDrawer && (
            <div className="p-4 rounded-2xl bg-[#0e0e14] border border-[#252535] space-y-3 animate-in fade-in">
              <h5 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>STUDIO PREFERENCES (स्टूडियो सेटिंग्स)</span>
              </h5>

              {/* Theme style */}
              <div className="space-y-1">
                <span className="text-[11px] text-gray-400 font-mono">Visual Style:</span>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {(['neon', 'cyber', 'gold', 'cinematic'] as const).map((th) => (
                    <button
                      key={th}
                      type="button"
                      id={`studio-theme-btn-${th}`}
                      onClick={() => {
                        setSelectedThemeStyle(th);
                        setTimeout(() => renderFrame(sceneElapsedRef.current, currentSceneIdxRef.current), 20);
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold transition-all cursor-pointer active:scale-95 ${
                        selectedThemeStyle === th
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#161620] text-gray-400 hover:text-white'
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>

              {/* Music Volume */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Music Volume:</span>
                  <span>{Math.round(musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={musicVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setMusicVolume(val);
                    if (musicGainRef.current && audioCtxRef.current) {
                      musicGainRef.current.gain.setValueAtTime(
                        isMutedMusic ? 0 : val,
                        audioCtxRef.current.currentTime
                      );
                    }
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Speech Rate */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Voice Speed (गति):</span>
                  <span>{speechRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
