export const isEnum = (object: Record<string, unknown>): boolean => {
	const keys = new Set(Object.keys(object));
	const values = new Set(Object.values(object));

	return keys.size > 0 && keys.size === values.size;
};
