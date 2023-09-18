export type APIError = {
  name?: string;
  message: string;
  errors?: {
    name: string;
    message: string;
    kind: string;
    path: string;
    value: string;
  }[];
};

function parseError(error: any): APIError {
  return {
    name: error.name || "Server error",
    message: error.message || "Something wrong happend.",
    errors: error.errors && Object.values(error.errors),
  };
}

export default parseError;
