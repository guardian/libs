/** Nominal data */
type Properties = Record<string, string>;
/** Numerical data */
type Metrics = Record<string, number>;

type Flatten<R extends Record<string, string | number>> = Array<{
	name: keyof R;
	value: R[keyof R];
}>;

/** This turns an object’s key-value pairs into an array objects
 * with `name` and `value` keys.
 *
 * @example
 * ({
 *   label: 'libs',
 *   network: 'wifi',
 * }) => [
 *   {
 *		name: 'label',
 *		value: 'libs',
 *   },
 *		name: 'network',
 *		value: 'wifi',
 *   },
 * ]
 */
const flatten = <Value extends string | number>(obj: Record<string, Value>) =>
	Object.entries(obj).map(([name, value]) => ({
		name,
		value,
	}));

type Payload = {
	label: string;
	properties: Flatten<Properties>;
	metrics: Flatten<Metrics>;
};

const generateJSONPayload = (
	label: string,
	properties: Properties,
	metrics: Metrics,
): string => {
	const payload: Payload = {
		label,
		properties: flatten(properties),
		metrics: flatten(metrics),
	};

	return JSON.stringify(payload);
};

/** Helper method to get default logging endpoints */
const getLoggingEndpoint = (
	isDev: boolean,
): `https://logs.${string}guardianapis.com/log` =>
	isDev
		? 'https://logs.code.dev-guardianapis.com/log'
		: 'https://logs.guardianapis.com/log';

type Data = {
	endpoint?: string;
	metrics?: Metrics;
	properties?: Properties;
};

/**
 * Record log to our Data Lake.
 * ⚠️ Make sure the data collection is GDPR compliant.
 *
 * Send nominal and numerical data:
 * - Nominal datum is of type `string`
 * - Numerical datum is of type `number`
 *
 * @param label Used to identify the data in BigQuery
 * @param {Data} options The data to send
 * @param {Properties} [options.properties] Nominal data. Defaults to an empty object.
 * @param {Metrics} [options.metrics] Numerical data. Defaults to an empty object.
 * @param {Metrics} [options.isDev] Record on CODE Data Lake if `true` or PROD if `false`. Defaults to `false`
 * @returns {boolean} whether the metrics have been queued
 */
export const recordLog = (
	label: string,
	{ properties = {}, metrics = {}, endpoint }: Data = {},
): boolean => {
	if (typeof label !== 'string' || label === '') return false;
	if (!endpoint) return false;

	const body = generateJSONPayload(label, properties, metrics);

	if ('sendBeacon' in navigator) {
		return navigator.sendBeacon(
			endpoint,
			generateJSONPayload(label, properties, metrics),
		);
	}

	void fetch(endpoint, {
		body,
	});
	return true;
};

export { getLoggingEndpoint };
