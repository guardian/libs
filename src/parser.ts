// ----- Imports ----- //

import type { Option, Result } from '@guardian/types';
import {
	err,
	ok,
	resultAndThen,
	ResultKind,
	resultMap,
	toOption,
} from '@guardian/types';

// ----- Types ----- //

interface Parser<A> {
	run: (a: unknown) => Result<string, A>;
}

// ----- Core Functions ----- //

const parser = <A>(f: (a: unknown) => Result<string, A>): Parser<A> => ({
	run: f,
});

const succeed = <A>(a: A): Parser<A> => parser((_) => ok(a));

const fail = <A>(e: string): Parser<A> => parser((_) => err(e));

const isObject = (a: unknown): a is Record<string, unknown> =>
	typeof a === 'object' && a !== null;

const run = <A>(pa: Parser<A>) => (a: unknown): Result<string, A> => pa.run(a);

// ----- Basic Parsers ----- //

const parseString: Parser<string> = parser((a) =>
	typeof a === 'string'
		? ok(a)
		: err(`Unable to parse ${String(a)} as a string`),
);

const parseNumber: Parser<number> = parser((a) =>
	typeof a === 'number' && !isNaN(a)
		? ok(a)
		: err(`Unable to parse ${String(a)} as a number`),
);

const parseDate: Parser<Date> = parser((a) => {
	if (typeof a === 'string' || typeof a === 'number' || a instanceof Date) {
		const d = new Date(a);

		if (d.toString() === 'Invalid Date') {
			return err(`${String(a)} isn't a valid Date`);
		}

		return ok(d);
	}

	return err(`Can't transform ${String(a)} into a date`);
});

const maybe = <A>(pa: Parser<A>): Parser<Option<A>> =>
	parser((a) => ok(toOption(pa.run(a))));

// ----- Data Structure Parsers ----- //

const parseField = <A>(field: string, pa: Parser<A>): Parser<A> =>
	parser((a) => {
		if (!isObject(a)) {
			return err(
				`Can't lookup field '${field}' on something that isn't an object`,
			);
		}

		return pa.run(a[field]);
	});

const parseIndex = <A>(index: number, pa: Parser<A>): Parser<A> =>
	parser((a) => {
		if (!Array.isArray(a)) {
			return err(
				`Can't lookup index ${index} on something that isn't an Array`,
			);
		}

		const value: unknown = a[index];

		if (value === undefined) {
			return err(`Nothing found at index ${index}`);
		}

		return pa.run(value);
	});

const parseAt = <A>(location: string[], pa: Parser<A>): Parser<A> =>
	parser((a) => {
		if (location.length === 1) {
			return parseField(location[0], pa).run(a);
		}

		if (location.length > 1) {
			return parseField(location[0], parseAt(location.slice(1), pa)).run(
				a,
			);
		}

		return err(
			`I need a list of fields to lookup a location in object ${String(
				a,
			)}`,
		);
	});

const parseArray = <A>(pa: Parser<A>): Parser<A[]> =>
	parser((a) => {
		const f = (acc: A[], remainder: unknown[]): Result<string, A[]> => {
			if (remainder.length === 0) {
				return ok(acc);
			}

			const [item, ...tail] = remainder;
			const parsed = pa.run(item);

			if (parsed.kind === ResultKind.Ok) {
				return f([...acc, parsed.value], tail);
			}

			return err(`Could not parse array item ${String(item)}`);
		};

		if (Array.isArray(a)) {
			return f([], a);
		}

		return err(`Could not parse ${String(a)} as an array`);
	});

// ----- Combinator Functions ----- //

const map = <A, B>(f: (a: A) => B) => (pa: Parser<A>): Parser<B> =>
	parser((a) => resultMap(f)(pa.run(a)));

const map2 = <A, B, C>(f: (a: A, b: B) => C) => (
	pa: Parser<A>,
	pb: Parser<B>,
): Parser<C> =>
	parser((a) => {
		const resultA = pa.run(a);

		if (resultA.kind === ResultKind.Err) {
			return resultA;
		}

		const resultB = pb.run(a);

		if (resultB.kind === ResultKind.Err) {
			return resultB;
		}

		return ok(f(resultA.value, resultB.value));
	});

const map3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (
	pa: Parser<A>,
	pb: Parser<B>,
	pc: Parser<C>,
): Parser<D> =>
	parser((a) => {
		const resultA = pa.run(a);

		if (resultA.kind === ResultKind.Err) {
			return resultA;
		}

		const resultB = pb.run(a);

		if (resultB.kind === ResultKind.Err) {
			return resultB;
		}

		const resultC = pc.run(a);

		if (resultC.kind === ResultKind.Err) {
			return resultC;
		}

		return ok(f(resultA.value, resultB.value, resultC.value));
	});

const map4 = <A, B, C, D, E>(f: (a: A, b: B, c: C, d: D) => E) => (
	pa: Parser<A>,
	pb: Parser<B>,
	pc: Parser<C>,
	pd: Parser<D>,
): Parser<E> =>
	parser((a) => {
		const resultA = pa.run(a);

		if (resultA.kind === ResultKind.Err) {
			return resultA;
		}

		const resultB = pb.run(a);

		if (resultB.kind === ResultKind.Err) {
			return resultB;
		}

		const resultC = pc.run(a);

		if (resultC.kind === ResultKind.Err) {
			return resultC;
		}

		const resultD = pd.run(a);

		if (resultD.kind === ResultKind.Err) {
			return resultD;
		}

		return ok(
			f(resultA.value, resultB.value, resultC.value, resultD.value),
		);
	});

const map5 = <A, B, C, D, E, F>(f: (a: A, b: B, c: C, d: D, e: E) => F) => (
	pa: Parser<A>,
	pb: Parser<B>,
	pc: Parser<C>,
	pd: Parser<D>,
	pe: Parser<E>,
): Parser<F> =>
	parser((a) => {
		const resultA = pa.run(a);

		if (resultA.kind === ResultKind.Err) {
			return resultA;
		}

		const resultB = pb.run(a);

		if (resultB.kind === ResultKind.Err) {
			return resultB;
		}

		const resultC = pc.run(a);

		if (resultC.kind === ResultKind.Err) {
			return resultC;
		}

		const resultD = pd.run(a);

		if (resultD.kind === ResultKind.Err) {
			return resultD;
		}

		const resultE = pe.run(a);

		if (resultE.kind === ResultKind.Err) {
			return resultE;
		}

		return ok(
			f(
				resultA.value,
				resultB.value,
				resultC.value,
				resultD.value,
				resultE.value,
			),
		);
	});

const map6 = <A, B, C, D, E, F, G>(
	f: (a: A, b: B, c: C, d: D, e: E, f: F) => G,
) => (
	pa: Parser<A>,
	pb: Parser<B>,
	pc: Parser<C>,
	pd: Parser<D>,
	pe: Parser<E>,
	pf: Parser<F>,
): Parser<G> =>
	parser((a) => {
		const resultA = pa.run(a);

		if (resultA.kind === ResultKind.Err) {
			return resultA;
		}

		const resultB = pb.run(a);

		if (resultB.kind === ResultKind.Err) {
			return resultB;
		}

		const resultC = pc.run(a);

		if (resultC.kind === ResultKind.Err) {
			return resultC;
		}

		const resultD = pd.run(a);

		if (resultD.kind === ResultKind.Err) {
			return resultD;
		}

		const resultE = pe.run(a);

		if (resultE.kind === ResultKind.Err) {
			return resultE;
		}

		const resultF = pf.run(a);

		if (resultF.kind === ResultKind.Err) {
			return resultF;
		}

		return ok(
			f(
				resultA.value,
				resultB.value,
				resultC.value,
				resultD.value,
				resultE.value,
				resultF.value,
			),
		);
	});

const map7 = <A, B, C, D, E, F, G, H>(
	f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H,
) => (
	pa: Parser<A>,
	pb: Parser<B>,
	pc: Parser<C>,
	pd: Parser<D>,
	pe: Parser<E>,
	pf: Parser<F>,
	pg: Parser<G>,
): Parser<H> =>
	parser((a) => {
		const resultA = pa.run(a);

		if (resultA.kind === ResultKind.Err) {
			return resultA;
		}

		const resultB = pb.run(a);

		if (resultB.kind === ResultKind.Err) {
			return resultB;
		}

		const resultC = pc.run(a);

		if (resultC.kind === ResultKind.Err) {
			return resultC;
		}

		const resultD = pd.run(a);

		if (resultD.kind === ResultKind.Err) {
			return resultD;
		}

		const resultE = pe.run(a);

		if (resultE.kind === ResultKind.Err) {
			return resultE;
		}

		const resultF = pf.run(a);

		if (resultF.kind === ResultKind.Err) {
			return resultF;
		}

		const resultG = pg.run(a);

		if (resultG.kind === ResultKind.Err) {
			return resultG;
		}

		return ok(
			f(
				resultA.value,
				resultB.value,
				resultC.value,
				resultD.value,
				resultE.value,
				resultF.value,
				resultG.value,
			),
		);
	});

const map8 = <A, B, C, D, E, F, G, H, I>(
	f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I,
) => (
	pa: Parser<A>,
	pb: Parser<B>,
	pc: Parser<C>,
	pd: Parser<D>,
	pe: Parser<E>,
	pf: Parser<F>,
	pg: Parser<G>,
	ph: Parser<H>,
): Parser<I> =>
	parser((a) => {
		const resultA = pa.run(a);

		if (resultA.kind === ResultKind.Err) {
			return resultA;
		}

		const resultB = pb.run(a);

		if (resultB.kind === ResultKind.Err) {
			return resultB;
		}

		const resultC = pc.run(a);

		if (resultC.kind === ResultKind.Err) {
			return resultC;
		}

		const resultD = pd.run(a);

		if (resultD.kind === ResultKind.Err) {
			return resultD;
		}

		const resultE = pe.run(a);

		if (resultE.kind === ResultKind.Err) {
			return resultE;
		}

		const resultF = pf.run(a);

		if (resultF.kind === ResultKind.Err) {
			return resultF;
		}

		const resultG = pg.run(a);

		if (resultG.kind === ResultKind.Err) {
			return resultG;
		}

		const resultH = ph.run(a);

		if (resultH.kind === ResultKind.Err) {
			return resultH;
		}

		return ok(
			f(
				resultA.value,
				resultB.value,
				resultC.value,
				resultD.value,
				resultE.value,
				resultF.value,
				resultG.value,
				resultH.value,
			),
		);
	});

const andThen = <A, B>(f: (a: A) => Parser<B>) => (pa: Parser<A>): Parser<B> =>
	parser((a) => resultAndThen<string, A, B>((x) => f(x).run(a))(pa.run(a)));

const oneOf = <A>(pas: Array<Parser<A>>): Parser<A> =>
	parser((a) => {
		const f = (
			remPas: Array<Parser<A>>,
			errs: string[],
		): Result<string, A> => {
			if (pas.length === 0) {
				return err(errs.join(' '));
			}

			if (pas.length === 1) {
				return pas[0].run(a);
			}

			const [head, ...tail] = remPas;
			const result = head.run(a);

			if (result.kind === ResultKind.Ok) {
				return result;
			}

			return f(tail, [...errs, result.err]);
		};

		return f(pas, []);
	});

// ----- Exports ----- //

export type { Parser };

export {
	succeed,
	fail,
	run,
	parseString,
	parseNumber,
	parseDate,
	maybe,
	parseField,
	parseIndex,
	parseAt,
	parseArray,
	map,
	map2,
	map3,
	map4,
	map5,
	map6,
	map7,
	map8,
	andThen,
	oneOf,
};
