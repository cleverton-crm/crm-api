import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { isBoolean, isString } from 'class-validator';
import { Request } from 'express';

const FIRST_PAGE: number = 1;
const DEFAULT_NUMBER_OF_RESULTS: number = 25;

/**
 * Mongo query
 */
export interface MongoPagination {
  page: number;
  limit: number;
  offset?: number;
  lean?: boolean;
  sort?: {
    [key: string]: SortValue;
  };
}

/**
 * Sort values available for Mongoose
 * Ref: https://mongoosejs.com/docs/api/query.html#query_Query-sort
 */
type SortValue = 'asc' | 'desc' | 'ascending' | 'descending' | 1 | -1;

/**
 * Configuration Options
 */
interface MongoPaginationOptions {
  pageName?: string;
  pageLimit?: string;
  pageOffset?: string;
  pageLean?: string;
  pageField?: string;
  pageCollation?: {};
  defaultLimit?: number;
  excludedKeys?: string[];
}

export const getMongoQuery = (
  options: MongoPaginationOptions = {},
  ctx: ExecutionContext,
): MongoPagination => {
  const req: Request = ctx.switchToHttp().getRequest();

  const {
    pageName = 'page',
    pageLimit = 'limit',
    pageOffset = 'offset',
    pageLean = 'lean',
    pageField = 'field',
    defaultLimit = DEFAULT_NUMBER_OF_RESULTS,
    excludedKeys = ['$where', 'mapreduce', '$accumulator', '$function'],
  } = options;

  const page: number = !isNaN(Number(req.query[pageName]))
    ? Number(req.query[pageName])
    : FIRST_PAGE;
  const limit: number = !isNaN(Number(req.query[pageLimit]))
    ? Number(req.query[pageLimit])
    : defaultLimit;
  const offset: number = !isNaN(Number(req.query[pageOffset]))
    ? Number(req.query[pageOffset])
    : null;
  const lean: boolean = !isBoolean(Boolean(req.query[pageLean]))
    ? Boolean(req.query[pageLean])
    : false;
  const field: string = isString(req.query[pageField])
    ? String(req.query[pageField])
    : '';
  let sort: {};
  let sortField: string;

  let excludePattern: string = '';

  try {
    sortField =
      req.query.sort !== undefined
        ? JSON.parse(req.query.sort as string)
        : null;
    if (sortField) {
      sort =
        req.query.sort !== undefined ? createSortField(field, sortField) : {};
    }
  } catch (exception) {
    throw new BadRequestException(
      'Either the sort or field parameter cannot be parsed',
    );
  }

  if (Array.isArray(excludedKeys)) {
    const excludeStrings: string[] = excludedKeys.filter(
      (elem: unknown): boolean => typeof elem === 'string',
    );

    if (excludeStrings.length > 0) {
      excludePattern = buildExcludePattern(excludeStrings);
    }
  }

  if (excludePattern) {
    const excludeRegex: RegExp = new RegExp(excludePattern);
  }

  let result = { page, limit };

  if (lean) {
    result = Object.assign(result, { lean: lean });
  }
  if (sort !== undefined) {
    result = Object.assign(result, { sort: sort });
  }
  if (offset !== null) {
    result = Object.assign(result, { offset: offset });
  }

  return result;
};

const createSortField = (
  fieldName: string,
  sort: string | number,
): { [key: string]: string } => {
  let property = {};

  switch (sort) {
    case 'asc':
    case 'desc':
    case 'ascending':
    case 'descending':
    case '1':
    case '-1':
      throw new BadRequestException(
        'Either the sort or field parameter cannot be parsed',
      );
  }

  switch (fieldName) {
    case 'id':
      property = { _id: sort };
      break;
    case 'create':
      property = { createdAt: sort };
      break;
    case 'update':
      property = { updatedAt: sort };
      break;
    default:
      property = { content: sort };
      break;
  }

  return property;
};

const buildExcludePattern = (excludeArray: string[]): string => {
  // Traverse the list of excluding keywords to build a regex pattern, e.g. ^(\$where|mapreduce|\$function)$
  return excludeArray
    .reduce(
      (
        previousValue: string,
        currentValue: string,
        currentIndex: number,
      ): string => {
        let accumulator: string = previousValue;

        if (currentIndex > 0) {
          accumulator += '|';
        }

        if (currentValue && currentValue.charAt(0) === '$') {
          accumulator += '\\';
        }

        return accumulator + currentValue;
      },
      '^(',
    )
    .concat(')$');
};

const sanitize = (value: unknown, excludeRegex: RegExp): unknown => {
  // Recursively traverse the keys to detect and remove the matching ones
  if (value instanceof Object) {
    for (const key in value) {
      if (excludeRegex.test(key)) {
        // tslint:disable-next-line
        delete (value as any)[key];
      } else {
        // tslint:disable-next-line
        sanitize((value as any)[key], excludeRegex);
      }
    }
  }

  return value;
};

// tslint:disable-next-line
export const MongoPaginationDecorator = createParamDecorator(getMongoQuery);
