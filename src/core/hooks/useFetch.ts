import { useState, useEffect } from "react";

interface FetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    handleCancelRequest: () => void;
  }

export default function useFetch<T> (url:string) : FetchResult<T>  {

    const[data, setData] = useState< T | null>(null);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState<null | string>(null);
    const[controller, setController] = useState<null | AbortController>(null);

    useEffect (()=>{
        const abortController = new AbortController();
        setController(abortController)
        setLoading(true);

        fetch(url, { signal: abortController.signal })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => {
            if(error.name === "AbortError"){
                console.log("Request cancelled");
            } else {
                setError(error);
            }
        })
            
        .finally(() => setLoading(false))

        return () => abortController.abort();

    }, []);

    const handleCancelRequest = () => {
        if(controller){
            controller.abort()
            setError("Request cancelled");
        }
    }

    return {data, loading, error, handleCancelRequest}
}