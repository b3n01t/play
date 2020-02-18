/**
 * utilities
 */

const debugEl = document.getElementById('debug');
export const debug = (txt: string) => {
    if (debugEl) {
        debugEl.innerHTML = `<pre>${txt}</pre>`;
    } else {
        console.log(txt);
    }
}