import {WebSocketShardEvents} from '@discordjs/ws';
import {Event} from '../event.js';

export default class ClosedEvent extends Event {
	constructor() {
		super(WebSocketShardEvents.Closed);
	}
}