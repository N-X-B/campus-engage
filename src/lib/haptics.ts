export const haptic = {
  // Ultra-light tap (for tabs, navigation, selecting chips)
  light: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  },
  // Medium tap (for opening modals, clicking main buttons)
  medium: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  },
  // Heavy tap (for destructive actions or major state changes)
  heavy: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  },
  // Success pattern (double-tap for sending icebreakers, completing onboarding)
  success: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 60, 40]);
    }
  },
  // Error pattern (three quick pulses for access denied, failed sends)
  error: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 40, 40, 40, 40]);
    }
  }
};
