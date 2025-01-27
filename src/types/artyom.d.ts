declare module "artyom.js" {
  export default class Artyom {
    static default: typeof Artyom;
    initialize(options: {
      lang: string;
      continuous?: boolean;
      soundex?: boolean;
      mode: string;
      volume?: number;
      listen?: boolean;
      debug?: boolean;
      speed?: number;
    }): Promise<void>;
    remoteProcessorService(callback: (phrase: any) => void): void;
    say(text: string): void;
    startListening(): void;
    stopListening(): void;
    fatality(): void;
    on(event: string, callback: (index: number, text: string) => void): void;
  }
}

declare module "artyom.js" {
  const Artyom: any;
  export default Artyom;
}
