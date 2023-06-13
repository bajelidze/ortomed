import { Knex } from 'knex';

// limitOffset sets the limit and offset
// for given query, if they are defined.
export function limitOffset(
  query: Knex.QueryBuilder,
  limit?: number,
  offset?: number,
): Knex.QueryBuilder {
  if (limit != undefined && limit > 0) {
    query = query.limit(limit);
  }

  if (offset != undefined && offset > 0) {
    query = query.offset(offset);
  }

  return query;
}

export function applyQueryFilters(
  query: Knex.QueryBuilder,
  filter: QueryFilter,
): Knex.QueryBuilder {
  if (filter.limit != undefined && filter.limit > 0) {
    query = query.limit(filter.limit);
  }

  if (filter.offset != undefined && filter.offset > 0) {
    query = query.offset(filter.offset);
  }

  if (filter.like) {
    if (!filter.where) {
      throw Error('filter must contain WHERE when LIKE is set');
    }

    query = query.whereLike(filter.where, filter.like);
  } else if(filter.where) {
    query = query.where(filter.where);
  }

  return query;
}

// QueryFilter contains filters that limit
// the final result of the query.
type QueryFilter = {
  limit?: number;
  offset?: number;
  where?: string;
  like?: string;
}
