/**
 * a simple impl of @vueuse/core/useFetch
 * include: error, isFetching, refetch(as return value), .blob(), .json(), .text(), hooks
 */
import type { Ref } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import { until } from '@lib/utils/until'
import type { DataType, NativeFetchOptions, UseFetchConfig, UseFetchReturn } from '@lib/utils/useFetch/index.type'

function useFetch<T>(url: string, config?: UseFetchConfig): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> {
	/** return value */
	const isFinished = ref(false)
	const isFetching = ref(false)
	const statusCode = ref<number | null>(null)
	const response = shallowRef<Response | null>(null)
	const error = shallowRef<any>(null)
	const data = shallowRef<T | null>(null)

	const fetchOptions: NativeFetchOptions = {
		method: 'GET',
		...config?.options,
	}

	function loading(isLoading: boolean): void {
		isFetching.value = isLoading
		isFinished.value = !isLoading
	}

	const dataType: Ref<DataType> = ref('json')
	async function exec(): Promise<any> {
		loading(true)
		error.value = null
		statusCode.value = null

		let responseData: any

		if (config?.hooks?.beforeFetch)
			Object.assign(fetchOptions, (await config.hooks.beforeFetch(fetchOptions)) ?? {})

		await fetch(url, fetchOptions)
			.then(async (fetchResponse) => {
				response.value = fetchResponse
				statusCode.value = fetchResponse.status

				responseData = await fetchResponse.clone()[dataType.value]()

				if (!fetchResponse.ok) {
					data.value = null
					throw new Error(fetchResponse.statusText)
				}

				if (config?.hooks?.afterFetch)
					responseData = (await config.hooks.afterFetch(responseData)) ?? responseData

				data.value = responseData
				loading(false)
			})
			.catch(async (fetchError) => {
				const errorData = fetchError.message || fetchError.name

				if (config?.hooks?.onFetchError)
					await config.hooks.onFetchError(fetchError)

				error.value = errorData

				loading(false)
			})
	}

	Promise.resolve().then(() => exec())

	const shell: UseFetchReturn<T> = {
		isFinished,
		statusCode,
		response,
		error,
		data,
		isFetching,
		refetch: exec,
		json: setType('json'),
		text: setType('text'),
		blob: setType('blob'),
		arrayBuffer: setType('arrayBuffer'),
		formData: setType('formData'),
	}

	function waitUntilFinished() {
		return new Promise<UseFetchReturn<T>>((resolve, reject) => {
			until(isFinished).toBe(true)
				.then(() => { resolve(shell) })
				.catch((error) => { reject(error) })
		})
	}

	function setType(type: DataType) {
		return () => {
			if (!isFetching.value) {
				dataType.value = type
				return {
					...shell,
					then(onFulfilled: any, onRejected: any) {
						return waitUntilFinished()
							.then(onFulfilled, onRejected)
					},
				} as any
			}
			return undefined
		}
	}

	return {
		...shell,
		then(onFulfilled, onRejected) {
			return waitUntilFinished()
				.then(onFulfilled, onRejected)
		},
	}
}

export {
	useFetch,
}
