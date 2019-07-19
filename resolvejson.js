// Usage
// -----
// The module exports one entry point, the `resovlejson()` function. It takes in
// the JSON that has id/ref that you want to render as a single argument and returns JSON
// with whatever graph cycles that are in the document.  Note that typically you can't
// fully expand the json as its a graph.  But when navigating via the + sign it is what
// you would expect.
//
// There are two use cases,
// the first is microsoft's encodes it's graphs with $id $ref, to avoid cyclic graphs
// (or just to save space).  This is resolved renderjson(resolvejson("$id","$idref", ...
//
// the second is for json schema's they encode their graphs with id $ref
// These can be resolved by renderjson(resolvejson("id", "$ref", ...
var resolvejson = (function () {
    var resolvejson = function resolvejson(idProp, refProp, json) {
        let byid = {}; //dictionary to keep the reference objects
        (function collectObjIds(o) {
            if (o.hasOwnProperty(idProp)) {
                let id = o[idProp];
                byid[id] = o;
            }
            for (var i in o) {
                if (o[i] !== null && typeof (o[i]) == "object")
                    collectObjIds(o[i]);
            }
        })(json)
        json = (function replaceRefs(obj) {
            if (typeof obj !== 'object' || !obj) // a primitive value
                return obj;
            if (obj.hasOwnProperty(refProp)) {
                let ref = obj[refProp];
                //we will always have the ref stored in the map
                if (ref in byid) {
                    var wrk = byid[ref]
                    if (Object.keys(obj).length == 1) {
                        return wrk;
                    }
                    var rtn = {}
                    for (var i in wrk) {
                        rtn[i] = wrk[i]
                    }
                    for (var i in obj) {
                        if (i != refProp && rtn[i] !== null) {
                            rtn[i] = obj[i]
                        }
                    }
                    return rtn;
                } else {
                    return obj
                }
            }
            if (Array.isArray(obj)) {
                obj = obj.map(replaceRefs);
            } else {
                for (let prop in obj) {
                    obj[prop] = replaceRefs(obj[prop]);
                }
            }
            return obj;
        })(json);

        return json;
    }
    return resolvejson;
})();

if (define) define({resolvejson: resolvejson})
else (module || {}).exports = (window || {}).resolvejson = resolvejson;
