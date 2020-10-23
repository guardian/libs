/**
 * Manages using `localStorage` and `sessionStorage`.
 *
 * Has a few advantages over the native API, including
 * - failing gracefully if storage is not available
 * - you can save and retrieve any JSONable data
 *
 * All methods are available for both `localStorage` and `sessionStorage`.
 */

import { lazyProp } from './lazyProp';

class Storage {
	private storage: globalThis.Storage | undefined;

	constructor(storage: globalThis.Storage) {
		// Inspired by https://mathiasbynens.be/notes/localstorage-pattern
		try {
			const uid = new Date().toString();
			storage.setItem(uid, uid);

			// ensure value we get is the one we set
			const available = storage.getItem(uid) == uid;
			storage.removeItem(uid);

			// if we haven't failed by now, it is `available`
			if (available) this.storage = storage;
		} catch (e) {
			// do nothing
		}
	}

	/**
	 * Check whether storage is available.
	 */
	isAvailable(): boolean {
		return typeof this.storage !== 'undefined';
	}

	/**
	 * Retrieve an item from storage.
	 *
	 * @param key - the name of the item
	 */
	get(key: string): unknown {
		if (this.storage) {
			try {
				/* eslint-disable @typescript-eslint/no-unsafe-assignment --
				we're using the `try` to handle anything bad happening */
				const { value, expires } = JSON.parse(
					this.storage.getItem(key) ?? '',
				);
				/* eslint-enable @typescript-eslint/no-unsafe-assignment */

				// is this item has passed its sell-by-date,
				// remove it and return null
				if (expires && new Date() > new Date(expires)) {
					this.remove(key);
					return null;
				}

				return value;
			} catch (e) {
				return null;
			}
		}
	}

	/**
	 * Save a value to storage.
	 *
	 * @param key - the name of the item
	 * @param value - the data to save
	 * @param expires - optional date on which this data will expire
	 */
	set(key: string, value: unknown, expires?: string | number | Date): void {
		if (this.storage) {
			return this.storage.setItem(
				key,
				JSON.stringify({
					value,
					expires,
				}),
			);
		}
	}

	/**
	 * Remove an item from storage.
	 *
	 * @param key - the name of the item
	 */
	remove(key: string): void {
		if (this.storage) {
			return this.storage.removeItem(key);
		}
	}
}

const storage = {} as {
	local: Storage;
	session: Storage;
};

lazyProp(storage, 'local', () => new Storage(window.localStorage));
lazyProp(storage, 'session', () => new Storage(window.sessionStorage));

export { storage };
