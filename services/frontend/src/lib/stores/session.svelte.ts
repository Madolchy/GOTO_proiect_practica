import { uuidv7 } from 'uuidv7';

let userId = $state<string>(uuidv7());

export function getUserId() {
	return userId;
}

export function setUserId(id: string) {
	userId = id;
}

export function regenerateUserId() {
	userId = uuidv7();
	return userId;
}
