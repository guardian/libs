type Payload = {
	label: string;
	properties: Array<{ name: string; value: string }>;
	metrics: Array<{ name: string; value: number }>;
};

type Properties = Record<string, string>;
type Metrics = Record<string, number>;

const generateJSONPayload = (
	label: string,
	properties: Properties,
	metrics: Metrics,
): string => {
	const payload: Payload = {
		label,
		properties: Object.entries(properties).map(([name, value]) => ({
			name,
			value,
		})),
		metrics: Object.entries(metrics).map(([name, value]) => ({
			name,
			value,
		})),
	};

	return JSON.stringify(payload);
};

const getLoggingEndpoint = (
	isDev: boolean,
): `https://logs.${string}guardianapis.com/log` =>
	isDev
		? 'https://logs.code.dev-guardianapis.com/log'
		: 'https://logs.guardianapis.com/log';

type Data = {
	isDev?: boolean;
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
	{ properties = {}, metrics = {}, isDev = false }: Data = {},
): boolean =>
	typeof label === 'string' &&
	label.length > 0 &&
	navigator.sendBeacon(
		getLoggingEndpoint(isDev),
		generateJSONPayload(label, properties, metrics),
	);
