// Copyright © 2013-2017 David Caldwell <david@porkrind.org>
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
// Options
// -------
// see function documentation
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

interface Options{
    /** show icon */
    show:string
    /** hide icon */
    hide:string
    replacer?: (key: string, value: any) => any
    show_to_level: number
    sort_objects: boolean
    collapse_msg:Function
    property_list:any[]
    max_string_length:number
}

export {} // hack to get typescript to stop complaining about window being redeclared

let module, window, define:Function, renderjson=(function() {
    const themetext = function(...args: string[] /* [class, text]+ */) {
        const spans = [];
        while (args.length)
            spans.push(append(span(Array.prototype.shift.call(args)),
                              text(Array.prototype.shift.call(args))));
        return spans;
    };
    const append = function(...args:(Node|null|Node[])[] /* el, ... */) {
        const el:Node|null = Array.prototype.shift.call(args);
        for (let a=0; a<args.length; a++)
            if (args[a].constructor == Array)
                append.apply(this, [el].concat(args[a]));
            else
                el.appendChild(<Node>args[a]);
        return el;
    };
    const prepend = function<T extends Node>(el:Node, child:T) {
        el.insertBefore<T>(child, el.firstChild);
        return el;
    }
    const isempty = function(obj:{}, pl:any[]) { const keys = pl || Object.keys(obj);
                                      for (const i in keys) if (Object.hasOwnProperty.call(obj, keys[i])) return false;
                                      return true; }
    const text = function(txt:string) { return document.createTextNode(txt) };
    const span = function(classname?:string) { const s = document.createElement("span");
                                     if (classname) s.className = classname;
                                     return s; };
    const A = function A(txt:string, classname:string, callback:Function) { const a = document.createElement("a");
                                                   if (classname) a.className = classname;
                                                   a.appendChild(text(txt));
                                                   a.href = '#';
                                                   a.onclick = function(e) { callback(); if (e) e.stopPropagation(); return false; };
                                                   return a; };

    function _renderjson(json:any, indent:string, dont_indent:boolean, show_level:number, options:Options) {
        const my_indent = dont_indent ? "" : indent;

        const disclosure = function(open:string, placeholder:string, close:string, type:string, builder:Function) {
            let content:HTMLElement;
            const empty = span(type);
            const show = function() { if (!content) append(empty.parentNode,
                                                         content = <HTMLElement>prepend(builder(),
                                                                           A(options.hide, "disclosure",
                                                                             function() { content.style.display="none";
                                                                                          empty.style.display="inline"; } )));
                                    content.style.display="inline";
                                    empty.style.display="none"; };
            append(empty,
                   A(options.show, "disclosure", show),
                   themetext(type+ " syntax", open),
                   A(placeholder, null, show),
                   themetext(type+ " syntax", close));

            const el = append(span(), text(my_indent.slice(0,-1)), empty);
            if (show_level > 0 && type != "string")
                show();
            return el;
        };

        if (json === null) return themetext(null, my_indent, "keyword", "null");
        if (json === void 0) return themetext(null, my_indent, "keyword", "undefined");

        if (typeof(json) == "string" && json.length > options.max_string_length)
            return disclosure('"', json.substr(0,options.max_string_length)+" ...", '"', "string", function () {
                return append(span("string"), themetext(null, my_indent, "string", JSON.stringify(json)));
            });

        if (typeof(json) != "object" || [Number, String, Boolean, Date].indexOf(json.constructor) >= 0) // Strings, numbers and bools
            return themetext(null, my_indent, typeof(json), JSON.stringify(json));

        if (json.constructor == Array) {
            if (json.length == 0) return themetext(null, my_indent, "array syntax", "[]");

            return disclosure("[", options.collapse_msg((<any[]>json).length), "]", "array", function () {
                const as = append(span("array"), themetext("array syntax", "[", null, "\n"));
                for (let i=0; i<(<any[]>json).length; i++)
                    append(as,
                           _renderjson(options.replacer.call(json, i, (<any[]>json)[i]), indent+"    ", false, show_level-1, options),
                           i != json.length-1 ? themetext("syntax", ",") : [],
                           text("\n"));
                append(as, themetext(null, indent, "array syntax", "]"));
                return as;
            });
        }

        // object
        if (isempty(json, options.property_list))
            return themetext(null, my_indent, "object syntax", "{}");

        return disclosure("{", options.collapse_msg(Object.keys(json).length), "}", "object", function () {
            const os = append(span("object"), themetext("object syntax", "{", null, "\n"));
            for (const k in json) var last = k;
            let keys = options.property_list || Object.keys(json);
            if (options.sort_objects)
                keys = keys.sort();
            for (const i in keys) {
                const k = keys[i];
                if (!(k in json)) continue;
                append(os, themetext(null, indent+"    ", "key", '"'+k+'"', "object syntax", ': '),
                       _renderjson(options.replacer.call(json, k, json[k]), indent+"    ", true, show_level-1, options),
                       k != last ? themetext("syntax", ",") : [],
                       text("\n"));
            }
            append(os, themetext(null, indent, "object syntax", "}"));
            return os;
        });
    }

    const renderjson = function renderjson(json:any)
    {
        //@ts-ignore
        const options:Options = new Object(renderjson.options);
        options.replacer = typeof(options.replacer) == "function" ? options.replacer : function<T>(k:any,v:T) { return v; };
        const pre = <Element>append(document.createElement("pre"), _renderjson(json, "", false, options.show_to_level, options));
        pre.className = "renderjson";
        return pre;
    }

    /**
     * This allows you to override the disclosure icons.
     */
    renderjson.set_icons = function(show:string, hide:string) { 
        renderjson.options.show = show;
        renderjson.options.hide = hide;
        return renderjson;
    };

    /**
     * Pass the number of levels to expand when rendering. The default is 0, which
     * starts with everything collapsed. As a special case, if level is the string
     * "all" then it will start with everything expanded.
     */
    renderjson.set_show_to_level = function(level:string|number) { 
        renderjson.options.show_to_level = typeof level == "string" &&
            level.toLowerCase() === "all" ? Number.MAX_VALUE : <number>level;
        return renderjson;
    };

    /**
     * Strings will be truncated and made expandable if they are longer than
     * `length`. As a special case, if `length` is the string "none" then
     * there will be no truncation. The default is "none".
     */
    renderjson.set_max_string_length = function(length:string|number) {
        renderjson.options.max_string_length = typeof length == "string" &&
             length.toLowerCase() === "none" ? Number.MAX_VALUE : <number>length;
        return renderjson;
    };

    /**
     * Sort objects by key (default: false)
     */
    renderjson.set_sort_objects = function(sort:boolean) {
        renderjson.options.sort_objects = sort;
        return renderjson;
    };

    /**
     * Equivalent of JSON.stringify() `replacer` argument when it's a function
     */
    renderjson.set_replacer = function(replacer?:(key: string, value: any) => any) {
        renderjson.options.replacer = replacer;
        return renderjson;
    };

    /**
     * Accepts a function (len:number):string => {} where len is the length of the
     * object collapsed.  Function should return the message displayed when a
     * object is collapsed.  The default message is "X items"
     */
    renderjson.set_collapse_msg = function(collapse_msg:(len:number)=>string) {
        renderjson.options.collapse_msg = collapse_msg;
        return renderjson;
    };

    /**
     * Equivalent of JSON.stringify() `replacer` argument when it's an array
     */
    renderjson.set_property_list = function(prop_list?:any[]) {
        renderjson.options.property_list = prop_list;
        return renderjson;
    };
    // Backwards compatiblity. Use set_show_to_level() for new code.
    renderjson.set_show_by_default = function(show:boolean) {
        renderjson.options.show_to_level = show ? Number.MAX_VALUE : 0;
        return renderjson;
    };
    renderjson.options = <Options>{};
    renderjson.set_icons('⊕', '⊖');
    renderjson.set_show_by_default(false);
    renderjson.set_sort_objects(false);
    renderjson.set_max_string_length("none");
    renderjson.set_replacer(void 0);
    renderjson.set_property_list(void 0);
    renderjson.set_collapse_msg(function(len:number) { return len + " item" + (len==1 ? "" : "s") })
    return renderjson;
})();

if (define) define({renderjson:renderjson})
// @ts-ignore
else (module||{}).exports = (window||{}).renderjson = renderjson;
