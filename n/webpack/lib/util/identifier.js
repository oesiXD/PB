"use strict";
const path = require("path");

/**
 * @typedef {Object} MakeRelativePathsCache
 * @property {Map<string, Map<string, string>>=} relativePaths
 */

/**
 *
 * @param {string} maybeAbsolutePath path to check
 * @returns {boolean} returns true if path is "Absolute Path"-like
 */
const looksLikeAbsolutePath = maybeAbsolutePath => {
	if (/^\/.*\/$/.test(maybeAbsolutePath)) {
		// this 'path' is actually a regexp generated by dynamic requires.
		// Don't treat it as an absolute path.
		return false;
	}
	return /^(?:[a-z]:\\|\/)/i.test(maybeAbsolutePath);
};

/**
 *
 * @param {string} p path to normalize
 * @returns {string} normalized version of path
 */
const normalizePathSeparator = p => p.replace(/\\/g, "/");

/**
 *
 * @param {string} context context for relative path
 * @param {string} identifier identifier for path
 * @returns {string} a converted relative path
 */
const _makePathsRelative = (context, identifier) => {
	return identifier
		.split(/([|! ])/)
		.map(str =>
			looksLikeAbsolutePath(str)
				? normalizePathSeparator(path.relative(context, str))
				: str
		)
		.join("");
};

/**
 *
 * @param {string} context context used to create relative path
 * @param {string} identifier identifier used to create relative path
 * @param {MakeRelativePathsCache=} cache the cache object being set
 * @returns {string} the returned relative path
 */
exports.makePathsRelative = (context, identifier, cache) => {
	if (!cache) return _makePathsRelative(context, identifier);

	const relativePaths =
		cache.relativePaths || (cache.relativePaths = new Map());

	let cachedResult;
	let contextCache = relativePaths.get(context);
	if (contextCache === undefined) {
		relativePaths.set(context, (contextCache = new Map()));
	} else {
		cachedResult = contextCache.get(identifier);
	}

	if (cachedResult !== undefined) {
		return cachedResult;
	} else {
		const relativePath = _makePathsRelative(context, identifier);
		contextCache.set(identifier, relativePath);
		return relativePath;
	}
};

/**
 * @param {string} context absolute context path
 * @param {string} request any request string may containing absolute paths, query string, etc.
 * @returns {string} a new request string avoiding absolute paths when possible
 */
exports.contextify = (context, request) => {
	return request
		.split("!")
		.map(r => {
			const splitPath = r.split("?", 2);
			if (/^[a-zA-Z]:\\/.test(splitPath[0])) {
				splitPath[0] = path.win32.relative(context, splitPath[0]);
				if (!/^[a-zA-Z]:\\/.test(splitPath[0])) {
					splitPath[0] = splitPath[0].replace(/\\/g, "/");
				}
			}
			if (/^\//.test(splitPath[0])) {
				splitPath[0] = path.posix.relative(context, splitPath[0]);
			}
			if (!/^(\.\.\/|\/|[a-zA-Z]:\\)/.test(splitPath[0])) {
				splitPath[0] = "./" + splitPath[0];
			}
			return splitPath.join("?");
		})
		.join("!");
};
