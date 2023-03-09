export type APIError = {
  message: string;
  errors: {
    name: string;
    message: string;
    kind: string;
    path: string;
    value: string;
  }[];
};

function parseError(error: any): APIError {
  return {
    message: error.message || "Error!",
    errors: Object.values(error.errors),
  };
}

export default parseError;
