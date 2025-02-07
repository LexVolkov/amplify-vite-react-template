import {useCallback, useState} from "react";
import {useError} from "../utils/setError.tsx";

type UseRequestOptions<TRequest, TResult> = {
    model?: (data?: TRequest | null) => Promise<TResult>;
    errorCode?: string;
    debug?: boolean;
};

const useRequest = <TRequest = void, TResult = unknown>({
                                                            model,
                                                            errorCode = "#",
                                                            debug = false,
                                                        }: UseRequestOptions<TRequest, TResult>) => {
    const setError = useError();

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<TResult | null>(null);

    const makeRequest = useCallback(async (requestData:any = null) => {
        if(!model){
            console.warn('Немає моделі для запиту');
        }else{
            try {
                setIsLoading(true);

                debug?console.log('=>',errorCode,requestData):null;

                const data = await model(requestData);

                debug?console.log('<=', data):null;

                const newData =
                    Array.isArray(data)?[...data]:{...data};

                setResult(newData as TResult);
            } catch (error) {
                console.log(error);
                setError(errorCode, 'Помилка при отриманні даних від сервера', (error as Error).message)
            } finally {
                setIsLoading(false);
            }
        }


    }, [model, debug, errorCode, setError]);

    return {isLoading, result, makeRequest};
};

export default useRequest;
