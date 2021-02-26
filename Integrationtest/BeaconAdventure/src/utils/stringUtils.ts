export function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export function firstLetter(s: string): string {
    return capitalize(s.charAt(0).toUpperCase())
}

export function hashCode(str: string): string {
    // let hash = 0, i, chr;
    // if (s.length === 0) return hash;
    // for (i = 0; i < s.length; i++) {
    //     chr = s.charCodeAt(i);
    //     hash = ((hash << 5) - hash) + chr;
    //     hash |= 0; // Convert to 32bit integer
    // }
    // return hash;

    let hash = 5381,
        i = str.length;

    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }

    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return String(hash >>> 0);
};