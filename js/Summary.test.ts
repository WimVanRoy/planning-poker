import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import type { VoteCount } from './types';

import Summary from './Summary.svelte';
import { countVotes } from './utils';

describe('Summary.svelte', () => {
    test('no votes', () => {
        render(Summary, { props: { votes: [], average: 0 } });

        expect(screen.getByText('No votes')).toBeInTheDocument();
    });

    test('votes', () => {
        const votes: Array<VoteCount> = countVotes(['s', 's', 'm', 'm', 'm']);
        render(Summary, { props: { votes: votes, average: 5 } });

        expect(screen.queryByText('No votes')).not.toBeInTheDocument();
    });
});
