import { describe, it, expect } from 'vitest';
import { createSearchCriteria } from './SearchCriteria';

describe('SearchCriteria Value Object', () => {
    it('should create search criteria with normalized query', () => {
        const criteria = createSearchCriteria('  TEST Query  ');

        expect(criteria.query).toBe('test query');
        expect(criteria.tags).toEqual([]);
        expect(criteria.category).toBeUndefined();
        expect(criteria.minTrustScore).toBeUndefined();
    });

    it('should include optional filters', () => {
        const criteria = createSearchCriteria('test', {
            tags: ['tag1', 'tag2'],
            category: 'compliance',
            minTrustScore: 90
        });

        expect(criteria.tags).toEqual(['tag1', 'tag2']);
        expect(criteria.category).toBe('compliance');
        expect(criteria.minTrustScore).toBe(90);
    });
});
