import {
	join as pathJoin,
	dirname as pathDirname
} from 'node:path';
import {fileURLToPath} from 'node:url';
import {WebSocketManager, CompressionMethod, WorkerShardingStrategy} from '@discordjs/ws';
import {REST} from "@discordjs/rest";
import {GatewayIntentBits} from "discord-api-types/v10";
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

export class Manager {
	private static token: string = process.env.TOKEN;
	private static rest: REST = new REST({version: '10'}).setToken(this.token);
	private static manager: WebSocketManager;
	private static intents: GatewayIntentBits|number = 0;

	public static start(): void {
		this.setIntents();
		this.registerWSManager();
		this.manager.connect();
		console.log('Gateway started!');
	}

	private static setIntents(): void {
		if (process.env.INTENTS) {
			const intents = process.env.INTENTS.split(',');
			for (const intent of intents) {
				this.intents |= GatewayIntentBits[intent as keyof typeof GatewayIntentBits];
			}
		}
	}
	private static registerWSManager(): void {
		this.manager = new WebSocketManager({
			token: this.token,
			intents: this.intents,
			rest: this.rest,
			compression: CompressionMethod.ZlibStream,
			buildStrategy: (manager: WebSocketManager) => new WorkerShardingStrategy(manager, {
				shardsPerWorker: 1,
				workerPath: pathJoin(__dirname, '..', 'worker', 'worker.js'), // let the workers handle all events.
			}),
		});
	}
}