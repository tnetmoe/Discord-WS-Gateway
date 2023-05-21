import {GatewayCloseCodes, GatewayDispatchPayload, GatewayReadyDispatchData} from "discord-api-types/v10";
import {WebSocketShardEvents} from "@discordjs/ws";
import {Brotli} from '../lib/brotli.js';
import {Worker} from './worker.js';
import {Queue} from './queue.js';

export type TEvent = TCloseEvent|TDebugEvent|TDispatchEvent|TErrorEvent|THeartbeatEvent|THelloEvent|TReadyEvent|TResumedEvent;

export type TCloseEvent = {
	code: GatewayCloseCodes
};

export type TDebugEvent = {
	message: string
};

export type TDispatchEvent = {
	data: GatewayDispatchPayload
};

export type TErrorEvent = {
	error: Error
};

export type THeartbeatEvent = {
	ackAt: number,
	heartbeatAt: number,
	latency: number
};

export type THelloEvent = {};

export type TReadyEvent = {
	data: GatewayReadyDispatchData
};

export type TResumedEvent = any;

export class Event {
	constructor(name: WebSocketShardEvents) {
		this.name = name;
	}

	protected readonly name: WebSocketShardEvents;

	public registerEvent(): void {
		Worker.shard.on(this.name, async (event: TEvent) => await this.run(event));
	}

	protected async run(event: TEvent): Promise<void> {
		Worker.logger.debug(`[${this.name}]: `, event);
	}

	protected async forward(event: TEvent): Promise<{time: number; job: string}> {
		const t = Date.now();
		const data = await Brotli.compress(JSON.stringify(event));
		const job = await Queue.job(this.name, {c: "brotli", data: data});
		return {job: job, time: t};
	}
}