import {
	Queue as bullQueue,
} from "bullmq";

export class Queue {
	private static queue: bullQueue;
	private static queueName: string = process.env.QUEUE_NAME || 'discord';

	public static init(): void {
		this.getQueueInstance();
	}

	/**
	 * Creates Bull instance and connects to Redis server.
	 */
	private static getQueueInstance(): void {
		if (!this.queue) {
			this.queue = new bullQueue(this.queueName, {
				connection: {
					enableOfflineQueue: false,
					host: process.env.REDIS_HOST,
					port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : undefined,
					username: process.env.REDIS_USER,
					password: process.env.REDIS_PASS,
					db: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : undefined
				}
			});
		}
	}

	/**
	 * Adds a job to the queue.
	 * @param {string} name name of the event.
	 * @param {any} data event data.
	 * @returns {Promise<string>} job id.
	 */
	public static async job(name, data): Promise<string> {
		const job = await this.queue.add(name, data);
		return job.id;
	}
}