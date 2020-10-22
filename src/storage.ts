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
	private storage: globalThis.Storage;
	private available: boolean | undefined;

	constructor(storage: globalThis.Storage) {
		this.storage = storage;
	}

	/**
	 * Check whether storage type is available.
	 */
	isAvailable(): boolean {
		if (this.available !== undefined) {
			return this.available;
		}

		try {
			// https://mathiasbynens.be/notes/localstorage-pattern
			const uid = new Date().toString();
			this.storage.setItem(uid, uid);

			// ensure value we get is the one we set
			const result = this.storage.getItem(uid) === uid;
			this.storage.removeItem(uid);

			// if we haven't failed by now, `result` is the last thing we need to check
			this.available = result;
		} catch (err) {
			this.available = false;
		}

		return this.available;
	}

	/**
	 * Retrieve a value from the storage type.
	 *
	 * @param key - the name of the value
	 */
	get(key: string): unknown {
		if (this.isAvailable()) {
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
	 * Save a value to the storage type.
	 *
	 * @param key - the name of the value
	 * @param value - the data to save
	 * @param expires - optional date on which this data will expire
	 */
	set(key: string, value: unknown, expires?: string | number | Date): void {
		if (this.isAvailable())
			return this.storage.setItem(
				key,
				JSON.stringify({
					value,
					expires,
				}),
			);
	}

	/**
	 * Remove an item from the storage type.
	 *
	 * @param key - the name of the value
	 */
	remove(key: string): void {
		if (this.isAvailable()) return this.storage.removeItem(key);
	}

	// just used in tests
	__setAvailable(available: boolean | undefined) {
		this.available = available;
	}
	__getAvailable() {
		return this.available;
	}
}

export const storage = {
	local: new Storage(window.localStorage),
	session: new Storage(window.sessionStorage),
};
