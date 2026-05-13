// Audio context for generating sounds
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Generate a pleasant "coin" sound for earning runes
export const playRuneSound = (rank = 'D') => {
  try {
    const ctx = getAudioContext();
    
    // Different frequencies based on rank for variety
    const frequencies = {
      D: { start: 523.25, end: 659.25 },  // C5 to E5
      C: { start: 587.33, end: 783.99 },  // D5 to G5
      B: { start: 659.25, end: 880.00 },  // E5 to A5
      A: { start: 783.99, end: 987.77 },  // G5 to B5
      S: { start: 880.00, end: 1174.66 }, // A5 to D6
    };
    
    const freq = frequencies[rank] || frequencies.D;
    
    // Create oscillator
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq.start, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(freq.end, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Subtle click sound for unchecking
export const playUncheckSound = () => {
  try {
    const ctx = getAudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Delete sound
export const playDeleteSound = () => {
  try {
    const ctx = getAudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Level Up chime - plays when mission is completed
export const playLevelUpSound = () => {
  try {
    const ctx = getAudioContext();
    
    // Play a triumphant ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + index * 0.1 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.1 + 0.3);
      
      oscillator.start(ctx.currentTime + index * 0.1);
      oscillator.stop(ctx.currentTime + index * 0.1 + 0.4);
    });
  } catch (e) {
    console.log('Audio not supported');
  }
};

// Level Up Fanfare — bigger, layered, plays on the LevelUpAnimation overlay.
// Self-contained, no CDN. Avoids the previous Pixabay 403 issue.
export const playLevelUpFanfare = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Layer 1: Ascending power chord (C major triad sweeping up two octaves)
    const chordNotes = [
      [261.63, 329.63, 392.0],   // C4, E4, G4
      [392.0,  493.88, 587.33],  // G4, B4, D5
      [523.25, 659.25, 783.99],  // C5, E5, G5
      [1046.5, 1318.5, 1567.98], // C6, E6, G6
    ];

    chordNotes.forEach((chord, idx) => {
      const t0 = now + idx * 0.15;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === chordNotes.length - 1 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(0.12, t0 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.55);
      });
    });

    // Layer 2: Low impact "boom" on the first chord
    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(80, now);
    boom.frequency.exponentialRampToValueAtTime(40, now + 0.4);
    boomGain.gain.setValueAtTime(0.25, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    boom.connect(boomGain);
    boomGain.connect(ctx.destination);
    boom.start(now);
    boom.stop(now + 0.65);

    // Layer 3: Final shimmering high octave on the last chord
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(2093.0, now + 0.6); // C7
    shimmerGain.gain.setValueAtTime(0, now + 0.6);
    shimmerGain.gain.linearRampToValueAtTime(0.08, now + 0.65);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.start(now + 0.6);
    shimmer.stop(now + 1.25);
  } catch (e) {
    console.log('Level-up fanfare not supported');
  }
};

export default { playRuneSound, playUncheckSound, playDeleteSound, playLevelUpSound, playLevelUpFanfare };

