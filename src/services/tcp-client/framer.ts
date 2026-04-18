export class Framer {
  private buffer = '';
  public onMessage?: (msg: object) => void;
  public onError?: (error: Error) => void;

  feed(chunkText: string): void {
    this.buffer += chunkText;

    let startIndex = this.buffer.indexOf('{');

    while (startIndex !== -1) {
      let depth = 0;
      let inString = false;
      let escape = false;
      let i = startIndex;
      let foundEnd = false;

      for (; i < this.buffer.length; i++) {
        const char = this.buffer[i];

        if (inString) {
          if (escape) {
            escape = false;
          } else if (char === '\\') {
            escape = true;
          } else if (char === '"') {
            inString = false;
          }
        } else {
          if (char === '"') {
            inString = true;
          } else if (char === '{') {
            depth++;
          } else if (char === '}') {
            depth--;
            if (depth === 0) {
              foundEnd = true;
              break;
            }
          }
        }
      }

      if (foundEnd) {
        const jsonStr = this.buffer.substring(startIndex, i + 1);
        try {
          const msg = JSON.parse(jsonStr);
          if (this.onMessage) this.onMessage(msg);
        } catch {
          if (this.onError) this.onError(new Error(`Invalid JSON: ${jsonStr.slice(0, 80)}`));
        }
        this.buffer = this.buffer.substring(i + 1);
        startIndex = this.buffer.indexOf('{');
      } else {
        if (startIndex > 0) {
          this.buffer = this.buffer.substring(startIndex);
        }
        break;
      }
    }
  }

  encode(msg: object): string {
    return JSON.stringify(msg);
  }
}
