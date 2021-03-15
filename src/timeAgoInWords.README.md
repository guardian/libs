
# `timeAgoInWords`

Takes an absolute date in [epoch format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#description) and returns a string representing relative time ago.

## Props
```typescript
type FormatType = 'short' | 'med' | 'long';

type RelativeDateOptions = {
	maxAge?: number; // Return false if the date ago is past a cutoff
	format?: FormatType; // Change string format (default 'med')
	showTime?: boolean; // Append time to string
};
```


## Usage
`timeAgoInWords(twoDaysAgoAsEpoch) // '2d ago'`
`timeAgoInWords(twoDaysAgoAsEpoch, { format: 'long' }) // '2 days ago'`
`timeAgoInWords(twoDaysAgoAsEpoch, { format: 'short' }) // '2d'`
`timeAgoInWords(threeYearsAgo, { maxAge: 1YearAgo }) // false`
`timeAgoInWords(threeDaysAgo, { showTime: true, format: 'long' }) // 'Friday 12 March 2021 10:00'`
