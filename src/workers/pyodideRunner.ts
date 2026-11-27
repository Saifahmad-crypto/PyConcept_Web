// pyodideRunner.ts: Manages lifecycle of Pyodide Web Worker, 10s timeout, stop button aborting, and status streaming

export type PyodideProgressStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface PyodideRunResponse {
  success: boolean;
  output: string;
  error?: {
    type: string;
    message: string;
    hint: string;
  };
}

class PyodideService {
  private worker: Worker | null = null;
  private status: PyodideProgressStatus = 'idle';
  private statusMessage: string = '';
  private statusListeners = new Set<(status: PyodideProgressStatus, message: string) => void>();
  private activeRun: {
    runId: number;
    resolve: (res: PyodideRunResponse) => void;
    timer: any;
    stdoutBuffer: string[];
  } | null = null;
  private runCounter = 0;

  public getStatus(): { status: PyodideProgressStatus; message: string } {
    return { status: this.status, message: this.statusMessage };
  }

  public subscribeStatus(listener: (status: PyodideProgressStatus, message: string) => void) {
    this.statusListeners.add(listener);
    listener(this.status, this.statusMessage);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private notify(status: PyodideProgressStatus, message: string) {
    this.status = status;
    this.statusMessage = message;
    this.statusListeners.forEach((l) => l(status, message));
  }

  public init() {
    if (this.worker || this.status === 'loading') return;
    this.createWorker();
  }

  private createWorker() {
    this.notify('loading', 'Initializing CPython WebAssembly Web Worker...');
    try {
      this.worker = new Worker(
        new URL('./pyodideWorker.ts', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (e: MessageEvent) => {
        const { type, runId, text, output, error, status, message } = e.data;

        if (type === 'STATUS') {
          this.notify(status, message);
          return;
        }

        if (!this.activeRun || this.activeRun.runId !== runId) return;

        if (type === 'STDOUT') {
          this.activeRun.stdoutBuffer.push(text);
          return;
        }

        if (type === 'SUCCESS') {
          clearTimeout(this.activeRun.timer);
          const fullOutput = output || this.activeRun.stdoutBuffer.join('\n');
          this.activeRun.resolve({
            success: true,
            output: fullOutput,
          });
          this.activeRun = null;
          return;
        }

        if (type === 'ERROR') {
          clearTimeout(this.activeRun.timer);
          const fullOutput = output || this.activeRun.stdoutBuffer.join('\n');
          this.activeRun.resolve({
            success: false,
            output: fullOutput,
            error: error || {
              type: 'PythonExecutionError',
              message: 'Execution encountered an error.',
              hint: 'Check your syntax and variables.',
            },
          });
          this.activeRun = null;
          return;
        }
      };

      this.worker.onerror = (err) => {
        this.notify('error', 'Web Worker error occurred: ' + err.message);
        if (this.activeRun) {
          clearTimeout(this.activeRun.timer);
          this.activeRun.resolve({
            success: false,
            output: '',
            error: {
              type: 'WorkerCrash',
              message: 'Web Worker terminated unexpectedly.',
              hint: 'Click Run again to spin up a clean Python instance.',
            },
          });
          this.activeRun = null;
        }
      };

      this.worker.postMessage({ type: 'INIT' });
    } catch (err: any) {
      this.notify('error', 'Failed to create worker: ' + (err?.message || err));
    }
  }

  public runCode(code: string, inputs: string[] = [], timeoutMs = 10000): Promise<PyodideRunResponse> {
    if (!this.worker) {
      this.createWorker();
    }

    if (this.activeRun) {
      this.stop();
    }

    const runId = ++this.runCounter;

    return new Promise<PyodideRunResponse>((resolve) => {
      const timer = setTimeout(() => {
        // Timeout guard (e.g. infinite loop while True:)
        this.stop();
        resolve({
          success: false,
          output: this.activeRun?.stdoutBuffer.join('\n') || '',
          error: {
            type: 'TimeoutError (Infinite Loop Guard)',
            message: `Execution timed out after ${timeoutMs / 1000} seconds. Your code may contain an infinite loop.`,
            hint: 'Ensure while loops have an incrementing counter or condition that eventually becomes False.',
          },
        });
      }, timeoutMs);

      this.activeRun = {
        runId,
        resolve,
        timer,
        stdoutBuffer: [],
      };

      this.worker?.postMessage({
        type: 'RUN',
        runId,
        code,
        inputs,
      });
    });
  }

  public stop() {
    if (this.activeRun) {
      clearTimeout(this.activeRun.timer);
      this.activeRun.resolve({
        success: false,
        output: this.activeRun.stdoutBuffer.join('\n'),
        error: {
          type: 'ExecutionAborted',
          message: 'Execution stopped by user.',
          hint: 'You clicked Stop to halt the running script.',
        },
      });
      this.activeRun = null;
    }

    // Terminate and re-create worker so an infinite loop is cleanly obliterated from thread
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.createWorker();
  }
}

export const pyodideService = new PyodideService();
