/**
 * Manages using `localStorage` and `sessionStorage`.
 *
 * Advantages:
 *
 * - fails gracefully is storage is not available
 * - provides `isAvailable` if you want to manually check
 * - `set` accepts a 3rd argument for an expiry date
 *
 */

class Storage {
	storage: globalThis.Storage;
	available: boolean | undefined;

	constructor(type: 'sessionStorage' | 'localStorage') {
		this.storage = window[type];
	}

	isAvailable(): boolean {
		const key = 'local-storage-test';

		if (this.available !== undefined) {
			return this.available;
		}

		try {
			// to fully test, need to set item
			// http://stackoverflow.com/questions/9077101/iphone-localstorage-quota-exceeded-err-issue#answer-12976988
			this.storage.setItem(key, key);
			this.storage.removeItem(key);
			this.available = true;
		} catch (err) {
			this.available = false;
		}

		return this.available;
	}

	get(key: string): unknown {
		try {
			/* eslint-disable @typescript-eslint/no-unsafe-assignment --
				we're using the `try` to handle anything bad happening */
			const { value, expires } = JSON.parse(
				this.storage.getItem(key) ?? '',
			);
			/* eslint-enable @typescript-eslint/no-unsafe-assignment */

			if (expires && new Date() > new Date(expires)) {
				this.remove(key);
				return null;
			}

			return value;
		} catch (e) {
			return null;
		}
	}

	set(key: string, value: unknown, expires?: string | number | Date): void {
		try {
			return this.storage.setItem(
				key,
				JSON.stringify({
					value,
					expires,
				}),
			);
		} catch (e) {
			// do nothing
		}
	}

	remove(key: string): void {
		try {
			return this.storage.removeItem(key);
		} catch (e) {
			// do nothing
		}
	}
}

export const storage = {
	local: new Storage('localStorage'),
	session: new Storage('sessionStorage'),
};
