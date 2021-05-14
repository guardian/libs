# `parser`

A module for parsing `unknown` values into other TypeScript types. It's generic enough to work for any `unknown` value, but is probably most useful for parsing JSON. It attempts to simplify the parsing process by abstracting the repetitive manual checks behind a declarative-style API, based on parser combinators.

It's inspired by the [Elm JSON module](https://package.elm-lang.org/packages/elm/json/latest/), Haskell modules like [ReadP](https://hackage.haskell.org/package/base-4.14.1.0/docs/Text-ParserCombinators-ReadP.html), and various other parser-combinator libraries. It also uses the `Result` and `Option` types available in our [`@guardian/types`](https://github.com/guardian/types) library.

**Note:** There's nothing about this module that requires the use of TypeScript - it will also work perfectly well when used with plain JavaScript.

## Example

Attempting to parse an object of type `Person` from a blob of unknown JSON.

```ts
type Person = { name: string, age: number };

const makePerson = (name: string, age: number): Person => ({
    name,
    age,
});

const parsePerson: Parser<Person> =
  map2(makePerson)(
    parseField('name', parseString),
    parseField('age', parseNumber),
  );

// The JSON is valid
const jsonA: unknown = JSON.parse('{ "name": "CP Scott", "age": 85 }');
const resultA = run(parsePerson)(jsonA); // Ok<Person>

// The JSON is invalid
const jsonB: unknown = JSON.parse('{ "name": "CP Scott" }');
const resultB = run(parsePerson)(jsonB); // Err<string>, 'missing field' err
```

## Background

[`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) and related methods like [`Body.json`](https://developer.mozilla.org/en-US/docs/Web/API/Body/json) from the Fetch API return their parsed JS data structures as type [`any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any). The use of `any` is a bit like an escape hatch from the TypeScript type system, and can result in runtime errors elsewhere in the codebase as the value with this type gets passed around and used.

One way around this is to type the returned value from `JSON.parse` as [`unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown) (as discussed in [this issue](https://github.com/typescript-eslint/typescript-eslint/issues/2118#issuecomment-641464651)). TypeScript will then _force_ you to verify the structure of this value, through methods like [type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards) and [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), before using it. This should significantly reduce the possibility of runtime errors.

A downside to taking this approach, however, is that it can result in quite verbose, repetitive code - particularly when working with complex, nested objects. This is where this module comes in.

## API

### `succeed: <A>(a: A) => Parser<A>`

Ignores whatever the input is and instead provides a successful parsing result containing `a`.

<dl>
  <dt>Parameter <code>a</code></dt>
  <dd>The value to be contained in the successful parsing result</dd>
  <dt>Returns</dt>
  <dd>A <code>Parser</code> of <code>A</code></dd>
</dl>

#### Example

```ts
const parseFoo = succeed('foo'); // Parser<string>

const result = run(parseFoo)(42); // Ok<string>, with value 'foo'
```

### `fail: <A>(e: string) => Parser<A>`

Ignores whatever the input is and instead provides a failed parsing result containing the error string `e`.

<dl>
  <dt>Parameter <code>e</code></dt>
  <dd>The error string to be provided as the parsing error</dd>
  <dt>Returns</dt>
  <dd>A <code>Parser</code> of <code>A</code></dd>
</dl>

#### Example

```ts
const parseFoo = fail('Uh oh!'); // Parser<A>

const result = run(parseFoo)(42); // Err<string>, with value 'Uh oh!'
```

### `run: <A>(pa: Parser<A>) => (a: unknown): Result<string, A>`

Run a parser over a given input that's currently `unknown`, and attempt to parse that input into a value of type `A`. If the parsing was successful the result will be an `Ok<A>`. If it failed the result will be an `Err<string>`.

<dl>
  <dt>Parameter <code>pa</code></dt>
  <dd>The parser to run over the input</dd>
  <dt>Parameter <code>a</code></dt>
  <dd>The <code>unknown</code> input to be parsed into type-safe value of type <code>A</code></dd>
  <dt>Returns</dt>
  <dd>A parsing result, wrapped in a <code>Result</code> type</dd>
</dl>

#### Example

```ts
const json: unknown = JSON.parse('{ "foo": 42 }');

const parserA = parseField('foo', parseNumber); // Parser<number>
const resultA = run(parserA)(json); // Ok<number>, with value 42

const parserB = parseField('bar', parseNumber); // Parser<number>
const resultB = run(parserB)(json); // Err<string>, with 'missing field' err
```

### `parseString: Parser<string>`

Parses a value into a `string`.

### `parseNumber: Parser<number>`

Parses a value into a `number`.

### `parseDate: Parser<Date>`

Parses a value into a `Date`.

### `maybe: <A>(pa: Parser<A>) => Parser<Option<A>>`

Makes the value handled by the given parser optional.

**Note:** This will effectively absorb any failure to parse the value, converting it to a `None` instead.

<dl>
  <dt>Parameter <code>pa</code></dt>
  <dd>A parser</dd>
  <dt>Returns</dt>
  <dd>A new <code>Parser</code> with an optional value</dd>
</dl>

#### Example

```ts
const json: unknown = JSON.parse('{ "foo": 42 }');

const parserA = maybe(parseField('bar', parseNumber)); // Parser<Option<number>>
const resultA = run(parserA)(json); // Ok<None>

const parserB = parseField('bar', maybe(parseNumber)); // Parser<Option<number>>
const resultB = run(parserB)(json); // Err<string>, with 'missing field' err
```

### `parseField: <A>(field: string, pa: Parser<A>) => Parser<A>`

Runs the parser `pa` over the value found at a given field in an object. Will fail if the input isn't an object or the field is missing.

<dl>
  <dt>Parameter <code>field</code></dt>
  <dd>The field containing the value to parse</dd>
  <dt>Parameter <code>pa</code></dt>
  <dd>The parser to use on the field value</dd>
  <dt>Return</dt>
  <dd>A parser for the value at the given field</dd>
</dl>

#### Example

```ts
const json: unknown = JSON.parse('{ "foo": 42 }');

const parserA = parseField('foo', parseNumber); // Parser<number>
const resultA = run(parserA)(json); // Ok<number>, with value 42

const parserB = parseField('bar', parseNumber); // Parser<number>
const resultB = run(parserB)(json); // Err<string>, with 'missing field' err
```

### `parseIndex: <A>(index: number, pa: Parser<A>) => Parser<A>`

Runs the parser `pa` over the value found at a given index in an array. Will fail if the input isn't an array or the index is empty.

<dl>
  <dt>Parameter <code>index</code></dt>
  <dd>The array index containing the value to parse</dd>
  <dt>Parameter <code>pa</code></dt>
  <dd>The parser to use on the value at the given index</dd>
  <dt>Return</dt>
  <dd>A parser for the value at the given index</dd>
</dl>

#### Example

```ts
const json: unknown = JSON.parse('[41, 42, 43]');

const parserA = parseIndex(1, parseNumber); // Parser<number>
const resultA = run(parserA)(json); // Ok<number>, with value 42

const parserB = parseIndex(7, parseNumber); // Parser<number>
const resultB = run(parserB)(json); // Err<string>, with 'missing index' err
```

### `parseAt: <A>(location: string[], pa: Parser<A>) => Parser<A>`

A convenience for parsing values in nested objects. Takes a list of fields used to pinpoint a location within the nested objects.

<dl>
  <dt>Parameter <code>location</code></dt>
  <dd>Field names designating a location inside a nested object</dd>
  <dt>Parameter <code>pa</code></dt>
  <dd>The parser to use on the value at the location</dd>
  <dt>Return</dt>
  <dd>A parser for the value at the given location</dd>
</dl>

#### Example

```ts
const json: unknown = JSON.parse('{ "foo": { "bar": 42 } }');

const parser = parseAt(['foo', 'bar'], parseNumber); // Parser<number>
const result = run(parser)(json); // Ok<number>, with value 42
```

### `parseArray: <A>(pa: Parser<A>) => Parser<A[]>`

Parses an array containing values of type `A`. Will fail if the input isn't an array, or the values can't be parsed as `A`.

<dl>
  <dt>Parameter <code>pa</code></dt>
  <dd>A parser for the values in the array</dd>
  <dt>Return</dt>
  <dd>A parser for the array</dd>
</dl>

#### Example

```ts
const json: unknown = JSON.parse('[41, 42, 43]');

const parser = parseArray(parseNumber); // Parser<number[]>
const result = run(parser)(json); // Ok<number[]>, with value [41, 42, 43]
```

### `map: <A, B>(f: (a: A) => B) => (pa: Parser<A>) => Parser<B>`

Converts a `Parser` of `A` to a `Parser` of `B`. Will apply the given function `f` to the result of the given parser (`Parser<A>`) if that parser is successful.

<dl>
  <dt>Parameter <code>f</code></dt>
  <dd>The function to apply</dd>
  <dt>Parameter <code>pa</code></dt>
  <dd>The parser to convert</dd>
  <dt>Return</dt>
  <dd>A new parser for type <code>B</code></dd>
</dl>

#### Example

```ts
const parser = map(n => n + 1)(parseNumber); // Parser<number>

const valueA: unknown = 41;
const resultA = run(parser)(valueA); // Ok<number>, with value 42

const valueB: unknown = 'foo';
const resultB = run(parser)(valueB); // Err<string>, with 'not a number' err
```

### `map2: <A, B, C>(f: (a: A, b: B) => C) => (pa: Parser<A>, pb: Parser<B>) => Parser<C>`

Similar to `map`. Will apply the given function `f` to the results of two given parsers (`Parser<A>` and `Parser<B>`) if both of those parsers are successful.

<dl>
  <dt>Parameter <code>f</code></dt>
  <dd>A function with two arguments, <code>a</code> and <code>b</code>, which correspond to the values potentially returned by the two parsers</dd>
  <dt>Parameter <code>pa</code></dt>
  <dd>The first parser, for a value of type <code>A</code></dd>
  <dt>Parameter <code>pb</code></dt>
  <dd>The second parser, for a value of type <code>B</code></dd>
  <dt>Return</dt>
  <dd>A new parser for type <code>C</code></dd>
</dl>

#### Example

```ts
type Person = { name: string, age: number };

const makePerson = (name: string, age: number): Person => ({ name, age });
const parsePerson: Parser<Person> =
  map2(makePerson)(
    parseField('name', parseString),
    parseField('age', parseNumber),
  );

const jsonA: unknown = JSON.parse('{ "name": "CP Scott", "age": 85 }');
const resultA = run(parsePerson)(jsonA); // Ok<Person>

const jsonB: unknown = JSON.parse('{ "name": "CP Scott" }');
const resultB = run(parsePerson)(jsonB); // Err<string>, 'missing field' err
```

### `map3`, `map4`, `map5`, `map6`, `map7`, `map8`

All similar to `map2`, but for more parsers. See the docs for that function for more details and examples.

### `andThen: <A, B>(f: (a: A) => Parser<B>) => (pa: Parser<A>) => Parser<B>`

Like `map` but applies a function that *also* returns an `Parser`. Then "unwraps" the result for you so you don't end up with `Parser<Parser<A>>`. Can be useful for stringing together multiple parsing steps, where each step relies on the result of the previous one.

If the first parser fails, the function won't be called and the error will be returned instead. If the second parser fails the error for that will be returned.

<dl>
  <dt>Parameter <code>f</code></dt>
  <dd>The function to apply</dd>
  <dt>Parameter <code>pa</code></dt>
  <dd>The parser whose result is to be passed to the function</dd>
  <dt>Return</dt>
  <dd>A new parser, built from <code>pa</code> and <code>f</code></dd>
</dl>

#### Example

```ts
type MultipleChoiceAnswer = 'a' | 'b' | 'c';

const parseAnswerValue = (value: string): Parser<MultipleChoiceAnswer> =>
  value === 'a' || value === 'b' || value === 'c'
    ? succeed(value)
    : fail("Needed 'a', 'b' or 'c'.");

const parseAnswer = pipe(
  parseField('answer', parseString),
  andThen(parseAnswerValue),
);

const jsonA: unknown = JSON.parse('{ "answer": "a" }');
const resultA = run(parseAnswer)(jsonA); // Ok<MultipleChoiceAnswer>, 'a'

const jsonB: unknown = JSON.parse('{ "answer": "d" }');
const resultB = run(parseAnswer)(jsonB); // Err<string>, "Needed 'a', 'b' or 'c'."
```

### `oneOf: <A>(pas: Array<Parser<A>>) => Parser<A>`

Docs todo.
