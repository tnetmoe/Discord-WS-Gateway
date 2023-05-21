import {WebSocketShardEvents} from '@discordjs/ws';
import {Event} from '../event.js';

export default class HelloEvent extends Event {
	constructor() {
		super(WebSocketShardEvents.Hello);
	}
}