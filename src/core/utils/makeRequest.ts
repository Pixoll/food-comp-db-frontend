import axios, { AxiosResponse } from "axios";

export default function makeRequest(
  method: "post" | "put" | "patch",
  endpoint: `/${string}`,
  payload: object,
  token: string | null,
  successCallback: (response: AxiosResponse) => void | Promise<void>,
  errorCallback: (error: any) => void | Promise<void>
): void {
  axios[method]("http://localhost:3000/api/v1" + endpoint, payload, {
    headers: {
      Authorization: `Bearer ${token}`,  
    },

  })
    .then(successCallback)
    .catch(errorCallback);
}
