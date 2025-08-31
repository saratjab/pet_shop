export type errorType = {
  name: string;
  errors: { path: string; message: string; received: string }[];
  message?: string;
  keyValue?: string;
};