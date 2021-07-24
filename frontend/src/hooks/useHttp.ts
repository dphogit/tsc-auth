import { useCallback, useEffect, useRef, useState } from "react";

interface RequestConfig {
  url: RequestInfo;
  options?: RequestInit;
  processData: (data: any) => void;
}

interface JSONResponse {
  status: "success" | "fail" | "error";
  data: Object;
}

interface JSONFail extends JSONResponse {
  status: "fail";
  data: {
    reason: string;
  };
}

interface JSONError extends JSONResponse {
  status: "error";
  data: {
    message: string;
  };
}

const useHttp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const sendRequest = useCallback(
    async ({ url, options, processData }: RequestConfig) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(url, {
          method: options && options.method ? options.method : "GET",
          headers: options && options.headers ? options.headers : {},
          body: options && options.body ? options.body : null,
          signal: options && options.signal,
        });

        const json: JSONResponse = await response.json();

        switch (json.status) {
          case "fail":
            throw new Error((json as JSONFail).data.reason);
          case "error":
            throw new Error((json as JSONError).data.message);
          case "success":
            processData(json.data);
        }
      } catch (error) {
        setErrorMessage(`${error || "Something went wrong!"}`);
        console.log(error);
      }

      // Memory leak seems to occur here and this solves it.
      // Probably need to relook in future
      if (mounted.current) {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    errorMessage,
    sendRequest,
    setErrorMessage,
  };
};

export default useHttp;
