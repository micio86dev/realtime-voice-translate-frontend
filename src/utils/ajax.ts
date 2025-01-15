const env = import.meta.env;
import Cookies from "js-cookie";
import minimongo from "minimongo";
import { isOnline } from '~/utils/connection-status';
import { DEFAULT_LOCALE } from "../routes/[locale]/i18n-utils";

const defaultHeaders = (withContentType = true) => {
  const res = {
    "lang": DEFAULT_LOCALE,
    "Authorization": `Bearer ${ Cookies.get("token") }`,
  } as any;

  if (withContentType) {
    res["Content-Type"] = "application/json";
  }

  return res;
};

const LocalDb = minimongo.MemoryDb;
const db = new LocalDb();

const storeAppendRequest = async (path: String, params: any, method: String) => {
  const url = `${ env._API_URL }/${ path }`;
  const collection = 'requests';
  db.addCollection(collection);
  const req = {
    id: Date.now().toString(36) + Math.random().toString(36),
    url,
    path,
    params,
    method,
  };

  console.log(req, collection, 'minimongo');
  return await db.collections[collection].upsert(req);
};

export default {
  get: async (path: string, params?: any) => {
    let url = `${ env._API_URL }/${ path }`;
    if (params) {
      url = `${ url }?${ new URLSearchParams(params).toString() }`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: defaultHeaders(),
    });

    const result = await res.json();

    if (!res.ok) {
      throw result;
    } else {
      if (path === 'auth/me') {
        return result
      }

      // Write data to minimongo
      db.addCollection(path);
      result.forEach(async (element: any) => {
        await db.collections[path].upsert(element);
      });
      console.log(await db.collections[path].find({}).fetch(), path, 'minimongo');
    }

    return result;
  },
  post: async (path: string, params?: any) => {
    const url = `${ env._API_URL }/${ path }`;

    // If offline, write appends requests to minimongo
    if (!isOnline()) {
      return storeAppendRequest(path, params, 'post');
    }

    const res = await fetch(url, {
      method: "POST",
      headers: defaultHeaders(),
      body: JSON.stringify(params),
    });

    const result = await res.json();

    if (!res.ok) {
      throw result;
    }

    return result;
  },
  patch: async (path: string, id: string, params?: any) => {
    const url = `${ env._API_URL }/${ path }/${ id }`;

    // If offline, write appends requests to minimongo
    if (!isOnline()) {
      return storeAppendRequest(path, params, 'patch');
    }

    const res = await fetch(url, {
      method: "PATCH",
      headers: defaultHeaders(false),
      body: JSON.stringify(params),
    });

    const result = await res.json();

    if (!res.ok) {
      throw result;
    }

    return result;
  },
  put: async (path: string, id: string, params?: any) => {
    const url = `${ env._API_URL }/${ path }/${ id }`;

    // If offline, write appends requests to minimongo
    if (!isOnline()) {
      return storeAppendRequest(path, params, 'put');
    }

    const res = await fetch(url, {
      method: "PUT",
      headers: defaultHeaders(),
      body: JSON.stringify(params),
    });

    const result = await res.json();

    if (!res.ok) {
      throw result;
    }

    return result;
  },
  delete: async (path: string, id: string, params?: any) => {
    const url = `${ env._API_URL }/${ path }/${ id }`;

    // If offline, write appends requests to minimongo
    if (!isOnline()) {
      return storeAppendRequest(path, params, 'post');
    }

    const res = await fetch(url, {
      method: "DELETE",
      headers: defaultHeaders(false),
      body: JSON.stringify(params),
    });

    const result = await res.json();

    if (!res.ok) {
      throw result;
    }

    return result;
  },
}
