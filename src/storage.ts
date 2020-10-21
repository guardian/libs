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
			this.storage.setItem(key, 'graun');
			this.storage.removeItem(key);
			this.available = true;
		} catch (err) {
			this.available = false;
		}

		return this.available;
	}

	getRaw(key: string): string | null {
		try {
			return this.storage.getItem(key);
		} catch (e) {
			return null;
		}
	}

	get(key: string): unknown {
		try {
			/* eslint-disable @typescript-eslint/no-unsafe-assignment --
				- we're using the `try` to handle anything bad
			*/

			const { value, expires } = JSON.parse(this.getRaw(key) ?? '');

			if (value === null) {
				return null;
			}

			if (expires && new Date() > new Date(expires)) {
				this.remove(key);
				return null;
			}

			/* eslint-enable @typescript-eslint/no-unsafe-assignment */

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
