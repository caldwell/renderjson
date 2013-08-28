Renderjson
==========

Render JSON into collapsible, themeable HTML. This library aims to be very
simple with no options and no external dependencies. It's aimed at debugging
but you can use it wherever it is useful.

The code renders the JSON lazily, only building the HTML when the user
reveals the JSON by clicking the disclosure icons. This makes it extremely
fast to do the initial render of huge JSON objects, since the only thing
that renders initially is a single disclosure icon.


Live Example
------------

[A live example can be found here](http://caldwell.github.io/renderjson).

Example
-------

```
<div id="test">
<script type="text/javascript" src="renderjson.js"></script>
<script>
    document.getElementById("test").appendChild(
        renderjson({ hello: [1,2,3,4], there: { a:1, b:2, c:["hello", null] } })
    );
</script>
```

Usage
-----

The module exports one entry point, the `renderjson()` function. It takes in
the JSON you want to render as a single argument and returns an HTML
element.

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

Copyright © 2013 David Caldwell \<david@porkrind.org\>

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
