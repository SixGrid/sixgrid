Standards are required to maintain clean, readable, and consistent code across all modifications, updates, and features of the SixGrid and esix-api Projects. All code that is written must appear to be written by the same person to help with the productivity and consistency of the SixGrid and esix-api Projects.

This Code Standard is targeted towards the use of the JavaScript langauge and is derived from the [jQuery Javascript Style Guide](https://contribute.jquery.org/style-guide/js/).

Our standard differs from the jQuery Javascript Style Guide in the following ways;
- For JavaScript files we use backticks instead of double quotes, and for JSON files we use double quotes

## Spacing
- Indentation with hard tabs with a character width of 4
- No Whitespace at the end of a line or on blank lines.
- Lines should have a maximum of 4 indents and a character limit of 120 (not including indents)
    - Lines including URL's or regex is an exception to this rule.
- `if`/`else`/`for`/`while`/`try` statements must have their brackes on their own independent lines.
- Special-Character operators (`!`, `++`, etc...) must not have space before or after it.
- Any `,` and `;` must not have a preceding space.
- Any `;` used as a statement terminator must be at the end of the line.
- Any `:` after a property name in an object definition must not have preceding space(s).
- The `?` and `:` in a ternary conditional must have space on both sides.
- No spaces inside of constructors (e.g; `{}` `[]` `function()`)
- New line at the end of each file

### Bad Examples
```javascript
if(condition) doSomething();
while(condition) iterating++;
for (let i =0; 100 > i; i = i + 1) object[array[i]] = someFunction(i);
```

### Good Examples
```javascript
var i = 0;

if (condition) 
{
    doSomething();
}

if (condition)
{
    // stuff
} else if (otherCondition)
{
    // more stuff
} else
{
    // aaaaaaaa
}

while (!condition)
{
    object[ array[i] ] = someFunction(i);
}

try
{

} catch (e)
{

}
```
