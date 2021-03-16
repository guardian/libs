
# `timeAgoInWords`

Takes an absolute date in [epoch format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#description) and returns a string representing relative time ago.

## Usage
`timeAgoInWords(epoch, opts)`

Returns: `string | false`

Converts an absolute epoch to a relative time ago string

`epoch`

Type: `number`

The date when an event happened in epoch format

`opts`

Type:
```typescript
{
	length?: 'short' | 'med' | 'long'; // Change string length (default 'med')
	showTime?: boolean; // Append time to string
}
```

Options to control the response

## Examples
```
timeAgoInWords(twoDaysAgoAsEpoch) // '2d ago'
timeAgoInWords(twoDaysAgoAsEpoch, { length: 'long' }) // '2 days ago'
timeAgoInWords(twoDaysAgoAsEpoch, { length: 'short' }) // '2d'
timeAgoInWords(threeDaysAgo, { showTime: true, length: 'long' }) // 'Friday 12 Mar 2021 10:00'
```
