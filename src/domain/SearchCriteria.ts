/**
 * SearchCriteria Value Object
 * 
 * Encapsulates search parameters for agent discovery.
 */

export interface SearchCriteria {
    query: string;
    tags?: string[];
    category?: string;
    minTrustScore?: number;
}

export function createSearchCriteria(query: string, options?: Partial<Omit<SearchCriteria, 'query'>>): SearchCriteria {
    return {
        query: query.trim().toLowerCase(),
        tags: options?.tags || [],
        category: options?.category,
        minTrustScore: options?.minTrustScore,
    };
}
