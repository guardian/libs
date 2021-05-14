import { err, none, ok, ResultKind } from '@guardian/types';
import { fail as parseFail, maybe, parseDate, parseField, parseIndex, parseNumber, parseString, run, succeed } from './parser';

describe('parser', () => {
    describe('succeed', () => {
        it('ignores whatever the input is and instead provides a successful parsing result containing `a`', () => {
            const parseFoo = succeed('foo');

            const result = run(parseFoo)(42);
            expect(result).toStrictEqual(ok('foo'));
        });
    });

    describe('fail', () => {
        it('ignores whatever the input is and instead provides a failed parsing result containing the error string `e`', () => {
            const parseFoo = parseFail('Uh oh!');
            const result = run(parseFoo)(42);

            expect(result).toStrictEqual(err('Uh oh!'));
        });
    });

    describe('run', () => {
        const json: unknown = JSON.parse('{ "foo": 42 }');

        it('runs the parser over a given input and provides a successful `ok` result', () => {
            const parser = parseField('foo', parseNumber);
            const result = run(parser)(json);

            expect(result).toStrictEqual(ok(42));
        });

        it('runs the parser over a given input and provides a failed `err` result', () => {
            const parser = parseField('bar', parseNumber);
            const result = run(parser)(json);

            expect(result.kind).toBe(ResultKind.Err);
        });
    });

    describe('parseString', () => {
        it('produces a successful parsing result if the input is a string', () => {
            const input: unknown = 'foo';

            const result = run(parseString)(input);
            expect(result).toStrictEqual(ok('foo'));
        });

        it('produces a failed parsing result if the input is not a string', () => {
            const inputOne: unknown = 42;
            const resultOne = run(parseString)(inputOne);
            expect(resultOne.kind).toBe(ResultKind.Err);
            
            const inputTwo: unknown = ['foo', 'bar'];
            const resultTwo = run(parseString)(inputTwo);
            expect(resultTwo.kind).toBe(ResultKind.Err);
            
            const inputThree: unknown = { foo: 'bar' };
            const resultThree = run(parseString)(inputThree);
            expect(resultThree.kind).toBe(ResultKind.Err);
        });
    });

    describe('parseNumber', () => {
        it('produces a successful parsing result if the input is a number', () => {
            const input: unknown = 42;

            const result = run(parseNumber)(input);
            expect(result).toStrictEqual(ok(42));
        });

        it('produces a failed parsing result if the input is not a number', () => {
            const inputOne: unknown = 'foo';
            const resultOne = run(parseNumber)(inputOne);
            expect(resultOne.kind).toBe(ResultKind.Err);
            
            const inputTwo: unknown = ['foo', 'bar'];
            const resultTwo = run(parseNumber)(inputTwo);
            expect(resultTwo.kind).toBe(ResultKind.Err);
            
            const inputThree: unknown = { foo: 'bar' };
            const resultThree = run(parseNumber)(inputThree);
            expect(resultThree.kind).toBe(ResultKind.Err);
        });
    });

    describe('parseDate', () => {
        it('produces a successful parsing result if the input can make a valid Date', () => {
            const inputOne: unknown = 42;
            const resultOne = run(parseDate)(inputOne);
            expect(resultOne).toStrictEqual(ok(new Date(42)));

            const inputTwo: unknown = '1970-01-01T00:00:00.042Z';
            const resultTwo = run(parseDate)(inputTwo);
            expect(resultTwo).toStrictEqual(ok(new Date('1970-01-01T00:00:00.042Z')));

            const inputThree: unknown = new Date(42);
            const resultThree = run(parseDate)(inputThree);
            expect(resultThree).toStrictEqual(ok(new Date(42)));
        });

        it('produces a failed parsing result if the input can\'t make a valid Date', () => {
            const inputOne: unknown = 'foo';
            const resultOne = run(parseDate)(inputOne);
            expect(resultOne.kind).toBe(ResultKind.Err);
            
            const inputTwo: unknown = NaN;
            const resultTwo = run(parseDate)(inputTwo);
            expect(resultTwo.kind).toBe(ResultKind.Err);

            const inputThree: unknown = ['foo', 'bar'];
            const resultThree = run(parseDate)(inputThree);
            expect(resultThree.kind).toBe(ResultKind.Err);

            const inputFour: unknown = { foo: 'bar' };
            const resultFour = run(parseDate)(inputFour);
            expect(resultFour.kind).toBe(ResultKind.Err);

            const inputFive: unknown = new Date(NaN);
            const resultFive = run(parseDate)(inputFive);
            expect(resultFive.kind).toBe(ResultKind.Err);
        });
    });

    describe('maybe', () => {
        it('produces a successful parse result by making the value handled by a parser optional', () => {
            const json: unknown = JSON.parse('{ "foo": 42 }');

            const parser = maybe(parseField('bar', parseNumber));
            const result = run(parser)(json);

            expect(result).toStrictEqual(ok(none));
        });

        it('produces a failed parse result when it doesn\'t wrap the parser that fails', () => {
            const json: unknown = JSON.parse('{ "foo": 42 }');

            const parser = parseField('bar', maybe(parseNumber));
            const result = run(parser)(json);

            expect(result.kind).toBe(ResultKind.Err);
        });
    });

    describe('parseField', () => {
        const json: unknown = JSON.parse('{ "foo": 42 }');

        it('provides a successful parse result if the field exists and the value parses', () => {
            const parser = parseField('foo', parseNumber);
            const result = run(parser)(json);

            expect(result).toStrictEqual(ok(42));
        });

        it('provides a failed parse result if the field doesn\'t exist', () => {
            const parser = parseField('bar', parseNumber);
            const result = run(parser)(json);

            expect(result.kind).toBe(ResultKind.Err);
        });

        it('provides a failed parse result if the value doesn\'t parse', () => {
            const parser = parseField('foo', parseString);
            const result = run(parser)(json);

            expect(result.kind).toBe(ResultKind.Err);
        });
    });

    describe('parseIndex', () => {
        const json: unknown = JSON.parse('[41, 42, 43]');

        it('provides a successful parse result if the index exists and the value parses', () => {
            const parser = parseIndex(1, parseNumber);
            const result = run(parser)(json);

            expect(result).toStrictEqual(ok(42));
        });
        
        it('provides a failed parse result if the index doesn\'t exist', () => {
            const parser = parseIndex(7, parseNumber);
            const result = run(parser)(json);

            expect(result.kind).toBe(ResultKind.Err);
        });

        it('provides a failed parse result if the value doesn\'t parse', () => {
            const parser = parseIndex(1, parseString);
            const result = run(parser)(json);

            expect(result.kind).toBe(ResultKind.Err);
        });
    });
});
