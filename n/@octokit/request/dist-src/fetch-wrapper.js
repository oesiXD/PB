import isPlainObject from "is-plain-object";
import nodeFetch from "node-fetch";
import { RequestError } from "@octokit/request-error";
import getBuffer from "./get-buffer-response";
export default function fetchWrapper(requestOptions) {
    if (isPlainObject(requestOptions.body) ||
        Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    const fetch = (requestOptions.request && requestOptions.request.fetch) || nodeFetch;
    return fetch(requestOptions.url, Object.assign({
        method: requestOptions.method,
        body: requestOptions.body,
        headers: requestOptions.headers,
        redirect: requestOptions.redirect
    }, requestOptions.request))
        .then(response => {
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers) {
            headers[keyAndValue[0]] = keyAndValue[1];
        }
        if (status === 204 || status === 205) {
            return;
        }
        // GitHub API returns 200 for HEAD requsets
        if (requestOptions.method === "HEAD") {
            if (status < 400) {
                return;
            }
            throw new RequestError(response.statusText, status, {
                headers,
                request: requestOptions
            });
        }
        if (status === 304) {
            throw new RequestError("Not modified", status, {
                headers,
                request: requestOptions
            });
        }
        if (status >= 400) {
            return response
                .text()
                .then(message => {
                const error = new RequestError(message, status, {
                    headers,
                    request: requestOptions
                });
                try {
                    Object.assign(error, JSON.parse(error.message));
                }
                catch (e) {
                    // ignore, see octokit/rest.js#684
                }
                throw error;
            });
        }
        const contentType = response.headers.get("content-type");
        if (/application\/json/.test(contentType)) {
            return response.json();
        }
        if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
            return response.text();
        }
        return getBuffer(response);
    })
        .then(data => {
        return {
            status,
            url,
            headers,
            data
        };
    })
        .catch(error => {
        if (error instanceof RequestError) {
            throw error;
        }
        throw new RequestError(error.message, 500, {
            headers,
            request: requestOptions
        });
    });
}
