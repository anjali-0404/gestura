import { spawn } from 'child_process';
import path from 'path';
import config from '../config.js';
import { EventEmitter } from 'events';

class MLService extends EventEmitter {
    constructor() {
        super();
        this.worker = null;
        this.isReady = false;
        this.pendingRequests = new Map();
        this.requestCounter = 0;
        this.initTimeout = 30000; // 30 seconds for TF startup
    }

    start() {
        if (this.worker) return;

        console.log('启动 ML Persistent Worker...');
        const scriptPath = path.resolve(config.pythonScriptPath);

        this.worker = spawn('python', [scriptPath]);

        this.worker.stdout.on('data', (data) => {
            const output = data.toString().trim();
            console.log(`ML Worker Output: ${output}`);

            try {
                const lines = output.split('\n');
                for (const line of lines) {
                    if (!line) continue;
                    const result = JSON.parse(line);

                    if (result.status === 'ready') {
                        console.log('✅ ML Worker is ready and model loaded.');
                        this.isReady = true;
                        this.emit('ready');
                    } else {
                        // Since we process one at a time for now, we can resolve the oldest pending promise
                        this.emit('result', result);
                    }
                }
            } catch (e) {
                console.error('Failed to parse ML Worker output:', output, e);
            }
        });

        this.worker.stderr.on('data', (data) => {
            // TensorFlow logs often go to stderr, so we just log it unless it looks like a crash
            const errorMsg = data.toString();
            if (errorMsg.includes('Traceback') || errorMsg.includes('Error')) {
                console.error(`ML Worker Error: ${errorMsg}`);
            }
        });

        this.worker.on('close', (code) => {
            console.warn(`ML Worker process exited with code ${code}`);
            this.worker = null;
            this.isReady = false;
            // Restart after a short delay
            setTimeout(() => this.start(), 5000);
        });
    }

    async predict(filePath, type = 'image') {
        if (!this.isReady) {
            // Wait for ready if we just started
            if (!this.worker) this.start();
            await new Promise((resolve) => this.once('ready', resolve));
        }

        return new Promise((resolve, reject) => {
            const onResult = (result) => {
                this.removeListener('error', onError);
                resolve(result);
            };

            const onError = (err) => {
                this.removeListener('result', onResult);
                reject(err);
            };

            this.once('result', onResult);

            const request = JSON.stringify({ file: filePath, type });
            this.worker.stdin.write(request + '\n');
        });
    }
}

const mlService = new MLService();
export default mlService;
