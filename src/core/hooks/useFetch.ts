import { useState, useEffect } from "react";

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
};

type FetchFailed = {
    status: FetchStatus.Failed;
    error: string;
};

export default function useFetch<T>(url: string): FetchResult<T> {
    const [status, setStatus] = useState<FetchStatus>(FetchStatus.Loading);
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<null | string>(null);
    const [controller, setController] = useState<null | AbortController>(null);

    useEffect(() => {
        const abortController = new AbortController();
        setController(abortController);

        fetch("http://localhost:3000/api/v1" + url, { signal: abortController.signal })
            .then(async (response) => {
                const json = await response.json();
                if (response.status >= 400) {
                    setError(json.message);
                    setStatus(FetchStatus.Failed);
                    return;
                }

                setData(json as T);
                setStatus(FetchStatus.Success);
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    console.log("Request cancelled");
                    return;
                }

                setError(error instanceof Error ? error.message : `${error}`);
                setStatus(FetchStatus.Failed);
            });

        return () => abortController.abort();
    }, [url]);

    const handleCancelRequest = () => {
        if (controller) {
            controller.abort();
            setError("Request cancelled");
        }
    };

    switch (status) {
        case FetchStatus.Loading: return { status, handleCancelRequest };
        case FetchStatus.Success: return { status, data: data! };
        case FetchStatus.Failed: return { status, error: error! };
    }
}
