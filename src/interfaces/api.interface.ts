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
