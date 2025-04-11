interface KeyCommand {
  key: string;
  description: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
}

class KeyboardManager {
  private commands: Map<string, KeyCommand> = new Map();

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private getCommandKey(key: string, modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean }): string {
    return `${modifiers.ctrl ? 'ctrl+' : ''}${modifiers.shift ? 'shift+' : ''}${modifiers.alt ? 'alt+' : ''}${key}`;
  }

  registerCommand(
    key: string,
    handler: () => void,
    description: string,
    modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
  ): void {
    const commandKey = this.getCommandKey(key.toLowerCase(), modifiers);
    this.commands.set(commandKey, {
      key,
      description,
      ...modifiers,
      handler
    });
  }

  unregisterCommand(
    key: string,
    modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
  ): void {
    const commandKey = this.getCommandKey(key.toLowerCase(), modifiers);
    this.commands.delete(commandKey);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    const commandKey = this.getCommandKey(key, {
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey
    });

    const command = this.commands.get(commandKey);
    if (command) {
      event.preventDefault();
      command.handler();
    }
  }

  getRegisteredCommands(): KeyCommand[] {
    return Array.from(this.commands.values());
  }
}

export const keyboardManager = new KeyboardManager();
export type { KeyCommand };