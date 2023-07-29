import { redirect } from '@remix-run/node';

interface ExtendendRequestInit extends RequestInit {
  token?: string;
}

type FetchFunction = (
  input: RequestInfo | URL,
  init?: ExtendendRequestInit | undefined
) => Promise<Response>;

type Options = {
  baseUrl?: string;
  onError?: (response: Response, request: Request) => any;
};

export class Requester {
  _options;
  constructor(options?: Options) {
    this._options = options;
  }
  static create(options?: Options) {
    return new Requester(options);
  }
  private async _fetch(
    input: RequestInfo | URL,
    init?: ExtendendRequestInit | undefined
  ) {
    const baseUrl = this._options?.baseUrl ?? '';
    const request = new Request(
      typeof input === 'string' ? baseUrl + input : input,
      init
    );

    if (typeof window !== 'undefined') {
      request.headers.set('Authorization', `Bearer ${window.token}`);
    }
    if (init?.token) {
      request.headers.set('Authorization', `Bearer ${init.token}`);
    }

    const response = await fetch(request);

    if (!response.ok) {
      await this._options?.onError?.(response, request);
    }
    return response;
  }
  get: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'GET' });
  post: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'POST' });
  put: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'PUT' });
  patch: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'PATCH' });
  delete: FetchFunction = async (input, init) =>
    this._fetch(input, { ...init, method: 'DELETE' });
}

export class RequesterError extends Error {
  data;
  status;
  constructor(message: string, status: number, data: Record<string, any>) {
    super(message);
    this.data = data;
    this.status = status;
  }
}

export const requester = new Requester({
  baseUrl: process.env.API_URL!,
  async onError(response) {
    if (response.status === 401) {
      if (typeof window === 'undefined') {
        throw redirect('/login');
      } else {
        window.location.replace('/login');
        return;
      }
    }

    const content = await response.text();
    const json = JSON.parse(content);
    const message = json?.errors?.[0]?.message ?? 'Unexpected Error'; // this can change based on the json returned by the api
    throw new RequesterError(message, response.status, json);
  },
});
