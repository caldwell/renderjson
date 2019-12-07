export interface Options {
    /** show icon */
    show: string;
    /** hide icon */
    hide: string;
    replacer?: (key: string, value: any) => any;
    show_to_level: number;
    sort_objects: boolean;
    collapse_msg: Function;
    property_list: any[];
    max_string_length: number;
}
export {};
declare var renderjson: {
    (json: any): Element;
    /**
     * This allows you to override the disclosure icons.
     */
    set_icons(show: string, hide: string): any;
    /**
     * Pass the number of levels to expand when rendering. The default is 0, which
     * starts with everything collapsed. As a special case, if level is the string
     * "all" then it will start with everything expanded.
     */
    set_show_to_level(level: string | number): any;
    /**
     * Strings will be truncated and made expandable if they are longer than
     * `length`. As a special case, if `length` is the string "none" then
     * there will be no truncation. The default is "none".
     */
    set_max_string_length(length: string | number): any;
    /**
     * Sort objects by key (default: false)
     */
    set_sort_objects(sort: boolean): any;
    /**
     * Equivalent of JSON.stringify() `replacer` argument when it's a function
     */
    set_replacer(replacer?: (key: string, value: any) => any): any;
    /**
     * Accepts a function (len:number):string => {} where len is the length of the
     * object collapsed.  Function should return the message displayed when a
     * object is collapsed.  The default message is "X items"
     */
    set_collapse_msg(collapse_msg: (len: number) => string): any;
    /**
     * Equivalent of JSON.stringify() `replacer` argument when it's an array
     */
    set_property_list(prop_list?: any[]): any;
    set_show_by_default(show: boolean): any;
    options: Options;
};
export default renderjson;
