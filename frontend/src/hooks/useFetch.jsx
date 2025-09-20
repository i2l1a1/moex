import {useEffect, useState} from "react";

function useFetch(url, requestParameters) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        async function fetchData(url) {
            try {
                const res = await fetch(url, {
                    signal: signal,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestParameters)
                });
                if (!res.ok) {
                    throw new Error(`HTTP ERROR: ${res.status}`);
                }
                const data = await res.json();
                setData(data);
            } catch (err) {
                if (err.name === "AbortError") {
                    //
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData(url).then((r) => {
        });

        return () => {
            abortController.abort();
        };
    }, [url, requestParameters]);

    return {data, loading, error};
}

export default useFetch;
