import axios, { AxiosResponse } from "axios";

export default function makeRequest(
  method: "post" | "put" | "patch",
  endpoint: `/${string}`,
  payload: object,
  token: string | null,
  successCallback: SuccessCallback,
  errorCallback: ErrorCallback
): void;

export default function makeRequest(
  method: "get" | "delete",
  endpoint: `/${string}`,
  token: string | null,
  successCallback: SuccessCallback,
  errorCallback: ErrorCallback
): void;

export default function makeRequest(
  method: "get" | "post" | "put" | "patch" | "delete",
  endpoint: `/${string}`,
  payload: object | string | null,
  token: string | null | SuccessCallback,
  successCallback: SuccessCallback | ErrorCallback,
  errorCallback?: ErrorCallback
): void {
  if (typeof payload === "object" && payload) {
    axios[method]("http://localhost:3000/api/v1" + endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(successCallback)
      .catch(errorCallback);
  } else {
    errorCallback = successCallback;
    successCallback = token as SuccessCallback;
    token = payload;

    axios[method]("http://localhost:3000/api/v1" + endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(successCallback)
      .catch(errorCallback);
  }
}

type SuccessCallback = (response: AxiosResponse) => void | Promise<void>;
type ErrorCallback = (error: any) => void | Promise<void>;
