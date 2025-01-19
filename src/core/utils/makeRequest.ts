import axios, { AxiosResponse } from "axios";

export default function makeRequest(
  method: "post" | "put" | "patch",
  endpoint: `/${string}`,
  options: MakeRequestOptionsWithPayload
): Promise<void>;

export default function makeRequest(
  method: "get" | "delete",
  endpoint: `/${string}`,
  options: MakeRequestOptions
): Promise<void>;

export default function makeRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  endpoint: `/${string}`,
  options: MakeRequestOptions | MakeRequestOptionsWithPayload
): Promise<void> {
  return new Promise<void>((resolve) => {
    let request: Promise<AxiosResponse<any, any>>;

    const { token, successCallback, errorCallback } = options;

    if ("payload" in options) {
      const { payload, contentType } = options;

      request = axios[method](
        "http://localhost:3000/api/v1" + endpoint,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...contentType && { "Content-Type": contentType },
          },
        }
      );
    } else {
      request = axios[method]("http://localhost:3000/api/v1" + endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    request
      .then((...args) => {
        successCallback?.(...args);
        resolve();
      })
      .catch((...args) => {
        errorCallback?.(...args);
        resolve();
      });
  });
}

type SuccessCallback = (response: AxiosResponse) => void | Promise<void>;
type ErrorCallback = (error: any) => void | Promise<void>;

type MakeRequestOptions = {
  token?: string | null,
  successCallback?: SuccessCallback,
  errorCallback?: ErrorCallback
};

type MakeRequestOptionsWithPayload = MakeRequestOptions & {
  payload: object;
  contentType?: ContentType;
};

type ContentType =
  | "application/json"
  | "application/octet-stream"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/html"
  | "text/plain";
