
# `timeAgo`

Takes an absolute date in [epoch format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#description) and returns a string representing relative time ago.

## Usage
`timeAgo(epoch, opts)`

Returns: `string | false`

Converts an absolute epoch to a relative time ago string

`epoch`

Type: `number`

The date when an event happened in epoch format

`opts`

Type:
```typescript
{
	format?: 'short' | 'med' | 'long'; // Change string format (default 'med')
}
```

Options to control the response

## Examples
```
timeAgo(twoDaysAgoAsEpoch) // '2d ago'
timeAgo(twoDaysAgoAsEpoch, { format: 'long' }) // '2 days ago'
timeAgo(twoDaysAgoAsEpoch, { format: 'short' }) // '2d'
```
