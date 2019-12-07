import renderjson from './renderjson'

test('has appropriate html', ()=>{
    const e = renderjson({})
    expect(e.className).toBe("renderjson")
    expect(e.innerHTML).toBe('<span></span><span class=\"object syntax\">{}</span>')
})

test('handles empty json', ()=>{
    const e = renderjson({})
    expect(e.textContent).toBe("{}")
})

test('handles string', ()=>{
    const e = renderjson("hello world")
    console.log(e)
    expect(e.textContent).toBe('"hello world"')
})

test('arrays are truncated', ()=>{
    const e = renderjson([1,2,3])
    console.log(e)
    expect(e.textContent).toBe("⊕[3 items]")
})

test('json is truncated', ()=>{
    const e = renderjson({"a":3})
    console.log(e)
    expect(e.textContent).toBe('⊕{1 item}')
})

test('icons can be set', ()=>{
    const e = renderjson.set_icons("+", "-")([1,2,3])
    expect(e.textContent).toBe("+[3 items]")
    // reset to default
    renderjson.set_icons("⊕","⊖")
})

test('show to level', ()=>{
    const e = renderjson.set_show_to_level(1)([1,2,3])
    expect(e.firstChild.lastChild.textContent).toBe(`⊖[
    1,
    2,
    3
]`)
    renderjson.set_show_to_level(0)
})

test('max string length is none by default', ()=>{
    // personally I think the max string length should be set by default
    // but I can leave that for later, right now I just want to write tests
    const e = renderjson("a".repeat(10000))
    console.log(e)
    expect(e.textContent).toBe('"' + "a".repeat(10000) + '"')
})

test('has appropriate html for complicated json', ()=>{
    // we want to verify entire json
    renderjson.set_show_to_level(999)

    const e = renderjson({
        "glossary": {
            "title": "example glossary",
            "comprehensive": true,
            "link": undefined,
            "count": 1,
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
    })
    expect(e.innerHTML).toMatchSnapshot()
    
    renderjson.set_show_to_level(0)
})