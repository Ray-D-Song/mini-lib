export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export interface CreateInstanceParam {
	prefix: string
	method: HttpMethod
}

export function createInstance(param: CreateInstanceParam) {
}
