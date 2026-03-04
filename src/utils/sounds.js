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

export default { playRuneSound, playUncheckSound, playDeleteSound, playLevelUpSound };
