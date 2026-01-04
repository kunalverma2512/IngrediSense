import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Logger {
    constructor() {
        this.logsDir = path.join(__dirname, '../../logs');
        this.ensureLogsDirectory();
    }

    ensureLogsDirectory() {
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    formatMessage(level, message) {
        return `[${this.getTimestamp()}] [${level.toUpperCase()}] ${message}`;
    }

    writeToFile(level, message) {
        const logFile = path.join(this.logsDir, `${level}.log`);
        const formattedMessage = this.formatMessage(level, message);
        fs.appendFileSync(logFile, formattedMessage + '\n');
    }

    info(message) {
        console.log(`ℹ️  ${message}`);
        this.writeToFile('info', message);
    }

    error(message) {
        console.error(`❌ ${message}`);
        this.writeToFile('error', message);
    }

    warn(message) {
        console.warn(`⚠️  ${message}`);
        this.writeToFile('warn', message);
    }

    debug(message) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🐛 ${message}`);
            this.writeToFile('debug', message);
        }
    }
}

export default new Logger();
