type KeyCommand = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  command: () => void;
  description: string;
};

class KeyboardManager {
  private static instance: KeyboardManager;
  private commands: Map<string, KeyCommand> = new Map();

  private constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  static getInstance(): KeyboardManager {
    if (!KeyboardManager.instance) {
      KeyboardManager.instance = new KeyboardManager();
    }
    return KeyboardManager.instance;
  }

  private getCommandKey(e: KeyboardEvent): string {
    const parts: string[] = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const commandKey = this.getCommandKey(e);
    const command = this.commands.get(commandKey);
    
    if (command) {
      e.preventDefault();
      command.command();
    }
  }

  registerCommand(
    key: string,
    command: () => void,
    description: string,
    modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
  ): void {
    const parts: string[] = [];
    if (modifiers.ctrl) parts.push('Ctrl');
    if (modifiers.shift) parts.push('Shift');
    if (modifiers.alt) parts.push('Alt');
    parts.push(key.toLowerCase());
    const commandKey = parts.join('+');

    this.commands.set(commandKey, {
      key,
      ...modifiers,
      command,
      description
    });
  }

  unregisterCommand(key: string, modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}): void {
    const parts: string[] = [];
    if (modifiers.ctrl) parts.push('Ctrl');
    if (modifiers.shift) parts.push('Shift');
    if (modifiers.alt) parts.push('Alt');
    parts.push(key.toLowerCase());
    const commandKey = parts.join('+');

    this.commands.delete(commandKey);
  }

  getRegisteredCommands(): KeyCommand[] {
    return Array.from(this.commands.values());
  }
}

export const keyboardManager = KeyboardManager.getInstance();
export type { KeyCommand };