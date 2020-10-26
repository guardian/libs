/**
 * Manages using `localStorage` and `sessionStorage`.
 *
 * Has a few advantages over the native API, including
 * - failing gracefully if storage is not available
 * - you can save and retrieve any JSONable data
 *
 * All methods are available for both `localStorage` and `sessionStorage`.
 */

class Storage {
	private __storage: globalThis.Storage;
	private __available: boolean | undefined;

	constructor(storage: globalThis.Storage) {
		this.__storage = storage;
	}

	/**
	 * Check whether storage is available.
	 */
	isAvailable(): boolean {
		if (typeof this.__available !== 'undefined') return this.__available;

		// Inspired by https://mathiasbynens.be/notes/localstorage-pattern
		try {
			const uid = new Date().toString();
			this.__storage.setItem(uid, uid);

			// ensure value we get is the one we set
			const available = this.__storage.getItem(uid) === uid;
			this.__storage.removeItem(uid);

			// if we haven't failed by now, it is `available`
			return (this.__available = available);
		} catch (e) {
			return false;
		}
	}

	/**
	 * Retrieve an item from storage.
	 *
	 * @param key - the name of the item
	 */
	get(key: string): unknown {
		if (this.isAvailable()) {
			try {
				/* eslint-disable @typescript-eslint/no-unsafe-assignment --
				we're using the `try` to handle anything bad happening */
				const { value, expires } = JSON.parse(
					this.__storage.getItem(key) ?? '',
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
		if (this.isAvailable()) {
			return this.__storage.setItem(
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
		if (this.isAvailable()) {
			return this.__storage.removeItem(key);
		}
	}

	/**
	 * Removes all items from storage.
	 */
	clear(): void {
		if (this.isAvailable()) {
			return this.__storage.clear();
		}
	}

	/**
	 * Retrieve an item from storage in its raw state.
	 *
	 * @param key - the name of the item
	 */
	getRaw(key: string): string | null {
		if (this.isAvailable()) {
			return this.__storage.getItem(key);
		}
		return null;
	}

	/**
	 * Save a raw value to storage.
	 *
	 * @param key - the name of the item
	 * @param value - the data to save
	 */
	setRaw(key: string, value: string): void {
		if (this.isAvailable()) {
			return this.__storage.setItem(key, value);
		}
	}
}

export const storage = {
	local: new Storage(window.localStorage),
	session: new Storage(window.sessionStorage),
};
