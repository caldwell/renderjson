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

exports = {};
exports.renderjson = renderjson = (function() {
    var text = function(txt) { return document.createTextNode(txt) };
    var div = function() { return document.createElement("div") };
    var span = function() { return document.createElement("span") };
    var A = function(txt, callback) { var a = document.createElement("a");
                                      a.appendChild(text(txt));
                                      a.href = '#';
                                      a.onclick = function() { callback(); return false; };
                                      return a; };

    function _renderjson(json, indent, dont_indent) {
        var my_indent = dont_indent ? "" : indent;

        if (json === null) return text(my_indent + "null");
        if (json === void 0) return text(my_indent + "undefined");
        if (typeof(json) != "object") // Strings, numbers and bools
            return text(my_indent + JSON.stringify(json));

        var disclosure = function(content, open, close) {
            content.insertBefore(A("⊖", function() { content.style.display="none";
                                                     empty.style.display="inline"; } ), content.firstChild);

            var empty = span();
            var show = function() { content.style.display="inline";
                                    empty.style.display="none"; };
            empty.appendChild(A("⊕", show));
            empty.appendChild(text(open+" "));
            empty.appendChild(A("...", show));
            empty.appendChild(text(" "+close));

            content.firstChild.onclick();

            var s = span()
            s.appendChild(text(my_indent));
            s.appendChild(content);
            s.appendChild(empty);
            return s;
        };

        if (json.constructor == Array) {
            if (json.length == 0) return text(my_indent +"[]");

            var as = span();
            as.appendChild(text("[\n"));
            for (var i=0; i<json.length; i++) {
                as.appendChild(_renderjson(json[i], indent+"    "));
                as.appendChild(text((i != json.length ? "," : "")+ "\n"));
            }
            as.appendChild(text(indent+"]"));


            return disclosure(as, "[", "]");
        }

        // object
        var os = span();
        os.appendChild(text("{\n"));
        for (var k in json) {
            os.appendChild(text(indent+"    "+'"'+k+'": '));
            os.appendChild(_renderjson(json[k], indent+"    ", true));
            os.appendChild(text(",\n"));
        }
        os.appendChild(text(indent+"}"));

        return disclosure(os, "{", "}");
    }

    return function renderjson(json)
    {
        var pre = document.createElement("pre");
        pre.appendChild(_renderjson(json, ""));
        pre.className = "renderjson";
        return pre;
    }
})();
