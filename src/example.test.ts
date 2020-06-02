import { example } from './example';

describe('example', () => {
	it('should want to be deleted', () => {
		expect(example().deleteme).toBe(true);
	});
});
