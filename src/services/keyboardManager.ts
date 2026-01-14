// ============================================
// Keyboard Manager
// Centralized keyboard shortcut handling
// ============================================

import { onMounted, onUnmounted, type Ref } from "vue";

export interface KeyboardShortcut {
  key: string;
  action: () => void;
  description: string;
  enabled?: Ref<boolean> | boolean;
}

/**
 * Keyboard shortcuts definition
 */
export const SHORTCUTS = {
  CHECK: { key: "Enter", description: "Check answer / Continue" },
  SKIP: { key: "s", description: "Skip problem" },
  HINT: { key: "h", description: "Show hint" },
  NEW: { key: "n", description: "New session" },
  ESCAPE: { key: "Escape", description: "Close modal / Cancel" },
} as const;

/**
 * Composable for keyboard shortcut management
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  // Shortcuts that should work even when input is focused
  const globalShortcuts = ["n", "h", "s", "Escape"];

  const handleKeydown = (event: KeyboardEvent) => {
    // Check if we're in an input field
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

    for (const shortcut of shortcuts) {
      // Check if shortcut is enabled
      const enabled = shortcut.enabled === undefined ? true : typeof shortcut.enabled === "boolean" ? shortcut.enabled : shortcut.enabled.value;

      if (!enabled) continue;

      // Match the key
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase() || event.key === shortcut.key;

      if (keyMatches) {
        // Check if this shortcut should work in input fields
        const isGlobalShortcut = globalShortcuts.includes(shortcut.key.toLowerCase()) || shortcut.key === "Enter" || shortcut.key === "Escape";

        // Block shortcuts in input fields unless they're global shortcuts
        if (isInputField && !isGlobalShortcut) {
          continue;
        }

        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
}

/**
 * Focus answer input when typing numbers
 */
export function useAutoFocusInput(inputRef: Ref<HTMLInputElement | null>) {
  const handleKeydown = (event: KeyboardEvent) => {
    // Check if it's a number key
    if (/^[0-9]$/.test(event.key)) {
      const target = event.target as HTMLElement;
      const isAlreadyInInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (!isAlreadyInInput && inputRef.value) {
        inputRef.value.focus();
        // Don't prevent default - let the number be typed
      }
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
}

/**
 * Get shortcut display text (for button labels)
 */
export function getShortcutLabel(key: string): string {
  if (key === "Enter") return "↵";
  if (key === "Escape") return "Esc";
  return key.toUpperCase();
}
