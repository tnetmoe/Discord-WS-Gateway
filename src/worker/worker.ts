import {threadId} from 'node:worker_threads';
import {readdirSync} from 'node:fs';
import {
	join as pathJoin,
	dirname as pathDirname
} from 'node:path';
import {fileURLToPath} from 'node:url';
import { WorkerBootstrapper, WebSocketShardEvents, WebSocketShard} from '@discordjs/ws';
import {
	pino,
	Logger as pinoLogger
} from "pino";
import PinoPretty from 'pino-pretty';
import {Queue} from './queue.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

export class Worker {
	public static logger: pinoLogger;

	private static bootstrapper: WorkerBootstrapper = new WorkerBootstrapper();

	private static events: Array<WebSocketShardEvents> = [];

	static shard: WebSocketShard;

	public static start(): void {
		this.bootstrap();
	}

	private static registerLogger(): void {
		this.logger = pino(
			{
				name: `[Shard: ${this.shard.id}] [Thread: ${threadId}]`,
				level: 'debug',
			},
			PinoPretty({
			translateTime: 'yyyy-mm-dd HH:MM:ss',
			colorize: true,
			ignore: 'pid,hostname',
			errorLikeObjectKeys: ['err', 'error'],
			errorProps: '',
			levelFirst: false,
			messageFormat: false
		}));
	}
	private static bootstrap(): void {
		void this.bootstrapper.bootstrap({
			// Those will be sent to the main thread for the manager to handle. Necessary for e.g. worker crashes or ws reconnection.
			forwardEvents: [
				WebSocketShardEvents.Closed,
				WebSocketShardEvents.Debug,
				WebSocketShardEvents.Hello,
				WebSocketShardEvents.Ready,
				WebSocketShardEvents.Resumed
			],
			shardCallback: (shard: WebSocketShard) => {
				Queue.init();
				this.shard = shard;
				this.registerLogger();
				this.registerEvents();
			},
		});
	}

	private static async registerEvents(): Promise<void> {
		const files = readdirSync(pathJoin(__dirname, 'events')).filter((file: string) => file.endsWith('.js'));
		for (const file of files) {
			const module = await import('file://' + pathJoin(__dirname, 'events', file));
			const event = new module.default();
			if(this.events.find((c: WebSocketShardEvents) => c === event.name)) {
				console.warn(`The event "${event.name}" is already registered`);
				this.logger.warn(`The event "${event.name}" is already registered`);
			} else {
				this.events.push(event);
				event.registerEvent();
			}
		}
	}
}

Worker.start();