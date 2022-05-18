export type Data = {
	label?: never;
	properties: Record<string, string>;
	metrics: Record<string, number>;
};

export type Collector = () => Data;
export type Track = (collect: boolean) => void;
