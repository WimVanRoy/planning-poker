import Cookies from 'js-cookie';
import type { VoteCount } from './types';

export function jsonScriptContents(id: string): any {
    const element = document.getElementById(id) as HTMLElement;
    if (element && element.textContent) {
        return JSON.parse(element.textContent);
    }
    return undefined;
}

export function csrfToken(): string {
    return Cookies.get('csrftoken') || '';
}

// https://formito.com/tools/favicon
function faviconHref(emoji: string): string {
    return `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2280%22>${emoji}</text></svg>`;
}

export function changeFavicon(emoji: string) {
    const document = window.document;
    const link = (document.querySelector('link[rel*="icon"]') || document.createElement('link')) as HTMLLinkElement;
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = faviconHref(emoji);

    document.getElementsByTagName('head')[0].appendChild(link);
}

export function formatNumber(num: number): string {
    const absNum = Math.abs(num);
    if (absNum > 999) {
        return Math.sign(num) * Number((absNum / 1000).toFixed(1)) + 'k';
    } else {
        return Math.sign(num) * absNum + '';
    }
}

/* Function returning function which returns a pseudo-random number between min and max with a seed.
 */
export function pseudoRandomGenerator(seed: number, min: number, max: number): () => number {
    return function random(): number {
        const x = Math.sin(seed++) * 10000;
        const n = x - Math.floor(x);

        return n * (max - min) + min;
    };
}

// Count votes in a list of votes, returning a list of (card, votes)-pairs in descending order.
// [1, 1, 2, 3, 3, 3, 3] => [[3, 3], [1, 2], [2, 1]]
export function countVotes(votes: Array<string | null>): Array<VoteCount> {
    const _votes: { [vote: string]: number } = {};
    votes.forEach((vote: string | null) => {
        if (vote != null) {
            if (!(vote in _votes)) {
                _votes[vote] = 0;
            }
            _votes[vote] += 1;
        }
    });
    const voteCounts: Array<VoteCount> = Object.entries(_votes);
    return voteCounts.sort((a, b) => b[1] - a[1]);
}

export function averageVotes(votes: Array<string | null>): string {
    let _votes = 0.0;
    let _count = 0.0;
    votes.forEach((vote: string | null) => {
        if (vote != null) {
            _count += 1;
            if (vote == "L") {
                _votes += 2;
            } else if (vote == "XL") {
                _votes += 3;
            } else if (vote == "M") {
                _votes += 1;
            } else if (vote == "S") {
                _votes += 0.5;
            } else if (vote == "XS") {
                _votes += 0.25;
            } else if (vote == "1/2") {
                _votes += 0.5;
            } else if (vote == "☕️") {
                _votes += 0.1;
            } else {
                let val = parseFloat(vote);
                if (!isNaN(val)) {
                    _votes += val;
                } else {
                    _count -= 1;
                }
            }
        }
    });
    if (_count == 0.0) {
        return "-";
    }
    return (Math.round(10 * _votes / _count) / 10).toString();
}
