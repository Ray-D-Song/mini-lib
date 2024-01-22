import type { Ref } from 'vue-demi'

export type DataType = 'text' | 'json' | 'blob' | 'arrayBuffer' | 'formData'

/**
 * useFetch param type
 */
export interface UseFetchConfig {
	options?: NativeFetchOptions
	hooks?: UseFetchHooks
}

export type NativeFetchOptions = RequestInit

export interface UseFetchHooks<T = any> {

	/**
	 * Will run immediately before the fetch request is dispatched
	 * return value will be merged into config
	 */
	beforeFetch?: (options: NativeFetchOptions) => Partial<NativeFetchOptions> | Promise<Partial<NativeFetchOptions>> | void

	/**
	 * Will run immediately after the fetch request is returned.
	 * Runs after any 2xx response
	 * ctx = raw data
	 * return value will replace data
	 */
	afterFetch?: (data?: T) => Partial<T> | Promise<Partial<T>> | void

	/**
	 * Will run immediately after the fetch request is returned.
	 * Runs after any 4xx and 5xx response
	 */
	onFetchError?: (err?: any) => void | Promise<void>
}

/** useFetch return type */
export interface UseFetchReturn<T> {
	/**
	 * Indicates if the fetch request has finished
	 */
	isFinished: Ref<boolean>

	/**
	 * The statusCode of the HTTP fetch response
	 */
	statusCode: Ref<number | null>

	/**
	 * The raw response of the fetch response
	 */
	response: Ref<Response | null>

	/**
	 * Any fetch errors that may have occurred
	 */
	error: Ref<any>

	/**
	 * The fetch response body on success, may either be JSON or text
	 */
	data: Ref<T | null>

	/**
	 * Indicates if the request is currently being fetched.
	 */
	isFetching: Ref<boolean>

	/**
	 * Refetch trigger
	 */
	refetch: () => Promise<any>

	// type
	json: () => UseFetchReturn<JSON> & PromiseLike<UseFetchReturn<JSON>>
	text: () => UseFetchReturn<string> & PromiseLike<UseFetchReturn<string>>
	blob: () => UseFetchReturn<Blob> & PromiseLike<UseFetchReturn<Blob>>
	arrayBuffer: () => UseFetchReturn<ArrayBuffer> & PromiseLike<UseFetchReturn<ArrayBuffer>>
	formData: () => UseFetchReturn<FormData> & PromiseLike<UseFetchReturn<FormData>>
}
