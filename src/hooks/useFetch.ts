'use client'
import { useEffect, useState } from "react";

export enum FetchStatus {
  Loading,
  Success,
  Failed,
}

type FetchResult<T> = FetchInProgress | FetchSuccess<T> | FetchFailed;

type FetchInProgress = {
  status: FetchStatus.Loading;
  handleCancelRequest: () => void;
};

type FetchSuccess<T> = {
  status: FetchStatus.Success;
  data: T;
  forceReload: () => void;
};

type FetchFailed = {
  status: FetchStatus.Failed;
  error: string;
  forceReload: () => void;
};

export function useFetch<T>(url: string): FetchResult<T> {
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.Loading);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [controller, setController] = useState<null | AbortController>(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    setController(abortController);

    // TODO use generated api object
    fetch(process.env.NEXT_PUBLIC_API_URL + url, { signal: abortController.signal })
      .then(async (response) => {
        const contentType = response.headers.get("content-type");
        let jsonOrText: object | string;
        if (contentType && contentType.indexOf("application/json") !== -1) {
          jsonOrText = await response.json();
        } else {
          jsonOrText = await response.text();
        }
        if (response.status >= 400) {
          // @ts-expect-error
          setError(jsonOrText?.message ?? `${jsonOrText}`);
          setStatus(FetchStatus.Failed);
          return;
        }

        setData(jsonOrText as T);
        setStatus(FetchStatus.Success);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setError(error instanceof Error ? error.message : `${error}`);
        setStatus(FetchStatus.Failed);
      });

    return () => abortController.abort();
  }, [url, counter]);

  const handleCancelRequest = () => {
    if (controller) {
      controller.abort();
      setError("Request cancelled");
    }
  };

  const forceReload = () => setCounter(x => x + 1);

  switch (status) {
    case FetchStatus.Loading:
      return { status, handleCancelRequest };
    case FetchStatus.Success:
      return { status, data: data!, forceReload };
    case FetchStatus.Failed:
      return { status, error: error!, forceReload };
  }
}
