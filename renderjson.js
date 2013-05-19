// Copyright © 2013 David Caldwell <david@porkrind.org>
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
// OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

// Usage
// -----
// The module exports one entry point, the `renderjson()` function. It takes in
// the JSON you want to render as a single argument and returns an HTML
// element.
//
// Theming
// -------
// The HTML output uses a number of classes so that you can theme it the way
// you'd like:
//     .disclosure    ("⊕", "⊖")
//     .syntax        (",", ":", "{", "}", "[", "]")
//     .string        (includes quotes)
//     .number
//     .boolean
//     .key           (object key)
//     .keyword       ("null", "undefined")
//     .object.syntax ("{", "}")
//     .array.syntax  ("[", "]")

exports = {};
exports.renderjson = renderjson = (function() {
    var themetext = function(/* [class, text]+ */) {
        var spans = [];
        while (arguments.length)
            spans.push(append(span(Array.prototype.shift.call(arguments)),
                              text(Array.prototype.shift.call(arguments))));
        return spans;
    };
    var append = function(/* el, ... */) {
        var el = Array.prototype.shift.call(arguments);
        for (var a=0; a<arguments.length; a++)
            if (arguments[a].constructor == Array)
                append.apply(this, [el].concat(arguments[a]));
            else
                el.appendChild(arguments[a]);
        return el;
    };
    var text = function(txt) { return document.createTextNode(txt) };
    var div = function() { return document.createElement("div") };
    var span = function(classname) { var s = document.createElement("span");
                                     if (classname) s.className = classname;
                                     return s; };
    var A = function A(txt, classname, callback) { var a = document.createElement("a");
                                                   if (classname) a.className = classname;
                                                   a.appendChild(text(txt));
                                                   a.href = '#';
                                                   a.onclick = function() { callback(); return false; };
                                                   return a; };

    function _renderjson(json, indent, dont_indent) {
        var my_indent = dont_indent ? "" : indent;

        if (json === null) return themetext(null, my_indent, "keyword", "null");
        if (json === void 0) return themetext(null, my_indent, "keyword", "undefined");
        if (typeof(json) != "object") // Strings, numbers and bools
            return themetext(null, my_indent, typeof(json), JSON.stringify(json));

        var disclosure = function(content, open, close, type) {
            content.insertBefore(A("⊖", "disclosure",
                                   function() { content.style.display="none";
                                                empty.style.display="inline"; } ), content.firstChild);

            var empty = span(type);
            var show = function() { content.style.display="inline";
                                    empty.style.display="none"; };
            append(empty,
                   A("⊕", "disclosure", show),
                   themetext(type+ " syntax", open),
                   A(" ... ", null, show),
                   themetext(type+ " syntax", close));

            content.firstChild.onclick(); // start everything hidden

            return append(span(), text(my_indent), content, empty);
        };

        if (json.constructor == Array) {
            if (json.length == 0) return themetext(null, my_indent, "array syntax", "[]");

            var as = append(span("array"), themetext("array syntax", "[", null, "\n"));
            for (var i=0; i<json.length; i++)
                append(as,
                       _renderjson(json[i], indent+"    "),
                       i != json.length ? themetext("syntax", ",") : [],
                       text("\n"));
            append(as, themetext(null, indent, "array syntax", "]"));

            return disclosure(as, "[", "]", "array");
        }

        // object
        var os = append(span("object"), themetext("object syntax", "{", null, "\n"));
        var empty = true;
        for (var k in json) {
            empty = false;
            append(os, themetext(null, indent+"    ", "key", '"'+k+'"', "object syntax", ': '),
                   _renderjson(json[k], indent+"    ", true),
                   themetext("syntax", ",", null, "\n"));
        }
        append(os, themetext(null, indent, "object syntax", "}"));

        if (empty)
            return themetext(null, my_indent, "object syntax", "{}");

        return disclosure(os, "{", "}", "object");
    }

    return function renderjson(json)
    {
        var pre = append(document.createElement("pre"), _renderjson(json, ""));
        pre.className = "renderjson";
        return pre;
    }
})();
