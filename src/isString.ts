export const isString = (_: unknown): boolean => {
	return Object.prototype.toString.call(_) === '[object String]';
};
