namespace ApiCore {
  /**
   * Endpoint response
   */
  export namespace Response {
    /**
     * Success response message
     */
    export interface Success {
      statusCode: string;
      message: string;
    }

    /**
     * Error or Bad Request response
     */
    export interface Failure {
      statusCode: string;
      message: string | string[];
    }
  }
}

export declare function isEmpty(object: Record<string, unknown>): boolean;

export declare interface IResponseOptionsRecords {
  totalPages: number;
  perPage: number;
  pageCount: number;
  currentPage: number;
  slNo: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prev: number | null;
  next: number | null;
}

export declare interface IResponseDataRecords {
  data: [];
  records: IResponseOptionsRecords;
}

export declare interface DataTypeRoles {
  [key: string]: string;
}
