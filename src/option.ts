// ----- Types ----- //

enum OptionKind {
	Some,
	None,
}

type Some<A> = {
	kind: OptionKind.Some;
	value: A;
};

type None = {
	kind: OptionKind.None;
};

/**
 * Represents a value that may or may not exist; it's either a Some or a None.
 */
type Option<A> = Some<A> | None;

// ----- Constructors ----- //

const some = <A>(a: A): Some<A> => ({ kind: OptionKind.Some, value: a });
const none: None = { kind: OptionKind.None };

/**
 * Turns a value that may be `null` or `undefined` into an `Option`.
 * If it's `null` or `undefined` the `Option` will be a `None`. If it's
 * some other value the `Option` will be a `Some` "wrapping" that value.
 * @param a The value that may be `null` or `undefined`
 * @returns {Option<A>} An `Option`
 */
const fromNullable = <A>(a: A | null | undefined): Option<A> =>
	a === null || a === undefined ? none : some(a);

// ----- Functions ----- //

/**
 * Returns the value if `Some`, otherwise returns `a`. You can think of it
 * as "unwrapping" the `Option`, getting you back a plain value
 * @param a The value to fall back to if the `Option` is `None`
 * @param optA The Option
 * @returns {A} The value for a `Some`, `a` for a `None`
 * @example
 * const bylineOne = some('CP Scott');
 * withDefault('Jane Smith')(bylineOne); // Returns 'CP Scott'
 *
 * const bylineTwo = none;
 * withDefault('Jane Smith')(bylineTwo); // Returns 'Jane Smith'
 */
const withDefault = <A>(a: A) => (optA: Option<A>): A =>
	optA.kind === OptionKind.Some ? optA.value : a;

/**
 * Applies a function to a `Some`, does nothing to a `None`.
 * @param f The function to apply
 * @param optA The Option
 * @returns {Option<B>} A new `Option`
 * @example
 * const creditOne = some('Nicéphore Niépce');
 * // Returns Some('Photograph: Nicéphore Niépce')
 * map(name => `Photograph: ${name}`)(creditOne);
 *
 * const creditTwo = none;
 * map(name => `Photograph: ${name}`)(creditTwo); // Returns None
 *
 * // All together
 * compose(withDefault(''), map(name => `Photograph: ${name}`))(credit);
 */
const map = <A, B>(f: (a: A) => B) => (optA: Option<A>): Option<B> =>
	optA.kind === OptionKind.Some ? some(f(optA.value)) : none;

/**
 * Takes two Options and applies a function if both are `Some`,
 * does nothing if either are a `None`.
 * @param f The function to apply
 * @param optA The first Option
 * @param optB The second Option
 * @returns {Option<C>} A new `Option`
 */
const map2 = <A, B, C>(f: (a: A, b: B) => C) => (optA: Option<A>) => (
	optB: Option<B>,
): Option<C> =>
	optA.kind === OptionKind.Some && optB.kind === OptionKind.Some
		? some(f(optA.value, optB.value))
		: none;

/**
 * Like `map` but applies a function that *also* returns an `Option`.
 * Then "unwraps" the result for you so you don't end up with
 * `Option<Option<A>>`
 * @param f The function to apply
 * @param optA The Option
 * @returns {Option<B>} A new `Option`
 * @example
 * type GetUser = number => Option<User>;
 * type GetUserName = User => Option<string>;
 *
 * const userId = 1;
 * const username: Option<string> = compose(andThen(getUserName), getUser)(userId);
 */
const andThen = <A, B>(f: (a: A) => Option<B>) => (
	optA: Option<A>,
): Option<B> => (optA.kind === OptionKind.Some ? f(optA.value) : none);

// ----- Exports ----- //

export {
	OptionKind,
	some,
	none,
	fromNullable,
	withDefault,
	map,
	map2,
	andThen,
};

export type { Option };
