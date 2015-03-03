Renderjson
==========

Render JSON into collapsible, themeable HTML. This library aims to be very
simple with few options and no external dependencies. It's aimed at debugging
but you can use it wherever it is useful.

The code renders the JSON lazily, only building the HTML when the user
reveals the JSON by clicking the disclosure icons. This makes it extremely
fast to do the initial render of huge JSON objects, since the only thing
that renders initially is a single disclosure icon.



Live Example
------------

[A live example can be found here](http://caldwell.github.io/renderjson).

Here's the code:

```html
<div id="test">
<script type="text/javascript" src="renderjson.js"></script>
<script>
var example = {
    "glossary": {
        "title": "example glossary",
        "GlossDiv": {
            "title": "S",
            "GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
                    "SortAs": "SGML",
                    "GlossTerm": "Standard Generalized Markup Language",
                    "Acronym": "SGML",
                    "Abbrev": "ISO 8879:1986",
                    "GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
                        "GlossSeeAlso": ["GML", "XML"]
                    },
                    "GlossSee": "markup"
                }
            }
        }
    }
};
    document.getElementById("test").appendChild(renderjson(example));
</script>
```

And here's the CSS:

```css
.renderjson a              { text-decoration: none; }
.renderjson .disclosure    { color: crimson;
                             font-size: 150%; }
.renderjson .syntax        { color: grey; }
.renderjson .string        { color: red; }
.renderjson .number        { color: cyan; }
.renderjson .boolean       { color: plum; }
.renderjson .key           { color: lightblue; }
.renderjson .keyword       { color: lightgoldenrodyellow; }
.renderjson .object.syntax { color: lightseagreen; }
.renderjson .array.syntax  { color: lightsalmon; }
```

Usage
-----

The module exports one entry point, the `renderjson()` function. It takes in
the JSON you want to render as a single argument and returns an HTML
element.

Options
-------

There are a couple functions to call to customize the output:

```javascript
renderjson.set_icons('+', '-');
```

Call `set_icons()` to set the disclosure icons to something other than "⊕" and
"⊖".

```javascript
renderjson.set_show_to_level(level);
```

Call `set_show_to_level()` to show different amounts of the JSON by
default. The default is `0`, and `1` is a popular choice. As a special case,
if `level` is the string `"all"` then all the JSON will be shown by
default. This, of course, removes the benefit of the lazy rendering, so it
may be slow with large JSON objects.

```javascript
renderjson.set_max_string_length(length);
```

Strings will be truncated and made expandable if they are longer than
`length`. As a special case, if `length` is the string `"none"` then there
will be no truncation. The default is `"none"`.

```javascript
renderjson.set_sort_objects(sort_bool);
```

Sort objects by key (default: false)

These functions are chainable so you may do:

```javascript
renderjson.set_icons('+', '-')
          .set_show_to_level(2)
        ({ hello: [1,2,3,4], there: { a:1, b:2, c:["hello", null] } })
```

Theming
-------

The HTML output uses a number of classes so that you can theme it the way
you'd like:

    .disclosure    ("⊕", "⊖")
    .syntax        (",", ":", "{", "}", "[", "]")
    .string        (includes quotes)
    .number
    .boolean
    .key           (object key)
    .keyword       ("null", "undefined")
    .object.syntax ("{", "}")
    .array.syntax  ("[", "]")


Copyright and License
---------------------

Copyright © 2013-2014 David Caldwell \<david@porkrind.org\>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
