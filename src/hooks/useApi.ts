"use client";

import api from "@/api";
import { RequestResult } from "@hey-api/client-fetch";
import { useEffect, useState } from "react";

export enum FetchStatus {
    Loading,
    Success,
    Failed,
}

export type FetchResult<T> = FetchInProgress | FetchSuccess<T> | FetchFailed;

type FetchInProgress = {
    status: FetchStatus.Loading;
    onCancelRequest: () => void;
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

type Api = typeof api;

type BaseOptions = {
    signal: AbortSignal;
}

type ApiResponse<R> = {
    data: R | undefined;
    error: any;
};

function apiWrapper(baseOptions: BaseOptions): Api {
    return Object.fromEntries(Object.entries(api).map(([key, fn]) =>
        [key, (options = {}) =>
            // @ts-expect-error: options is always an object
            fn({ ...baseOptions, ...options })
        ]
    )) as unknown as Api;
}

export function useApi<R, Deps extends readonly unknown[] = []>(
    deps: [...Deps],
    callback: (api: Api, ...args: Deps) => Promise<ApiResponse<R>>,
): FetchResult<R> {
    const [status, setStatus] = useState<FetchStatus>(FetchStatus.Loading);
    const [data, setData] = useState<R | null>(null);
    const [error, setError] = useState<null | string>(null);
    const [controller, setController] = useState<null | AbortController>(null);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const abortController = new AbortController();
        setController(abortController);

        callback(apiWrapper({ signal: abortController.signal }), ...deps)
            .then(async (result) => {
                if (!result.data) {
                    setError(getErrorMessage(result.error));
                    setStatus(FetchStatus.Failed);
                    return;
                }

                setData(result.data);
                setStatus(FetchStatus.Success);
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    setError("Request cancelled");
                    return;
                }

                setError(getErrorMessage(error));
                setStatus(FetchStatus.Failed);
            });

        return () => abortController.abort();
    }, [counter, ...deps]);

    const onCancelRequest = () => {
        if (controller) {
            controller.abort();
            setError("Request cancelled");
        }
    };

    const forceReload = () => setCounter(x => x + 1);

    switch (status) {
        case FetchStatus.Loading:
            return { status, onCancelRequest };
        case FetchStatus.Success:
            return { status, data: data!, forceReload };
        case FetchStatus.Failed:
            return { status, error: error!, forceReload };
    }
}

function getErrorMessage(error: unknown) {
    return error && typeof error === "object" && "message" in error && typeof error.message === "string"
        ? error.message
        : `${error}`;
}
