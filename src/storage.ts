const store = (type: 'sessionStorage' | 'localStorage') => ({
	available: undefined as boolean | undefined,
	storage: window[type],
	isAvailable(): boolean | undefined {
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
	},

	get(key: string): unknown | null {
		if (!this.available) {
			return;
		}

		let data;

		// try and parse the data
		try {
			const value = this.getRaw(key);

			if (value === null || value === undefined) {
				return null;
			}

			data = JSON.parse(value);

			if (data === null) {
				return null;
			}
		} catch (e) {
			this.remove(key);
			return null;
		}

		// has it expired?
		if (data.expires && new Date() > new Date(data.expires)) {
			this.remove(key);
			return null;
		}

		return data.value;
	},

	set(
		key: string,
		value: unknown,
		expires?: string | number | Date,
	): unknown {
		if (!this.available) {
			return;
		}

		return this.storage.setItem(
			key,
			JSON.stringify({
				value,
				expires,
			}),
		);
	},

	getRaw(key: string): string | null {
		if (this.available) {
			return this.storage.getItem(key);
		}
		return null;
	},

	remove(key: string): null | void {
		if (this.available) {
			return this.storage.removeItem(key);
		}
		return null;
	},
});

export const storage = {
	local: (): unknown => store('localStorage'),
	session: (): unknown => store('sessionStorage'),
};
