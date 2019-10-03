/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { READ, ReferenceTracker } = require("eslint-utils")

module.exports = {
    meta: {
        docs: {
            description: "disallow the `Number.isNaN` method.",
            category: "ES2015",
            recommended: false,
            url:
                "http://mysticatea.github.io/eslint-plugin-es/rules/no-number-isnan.html",
        },
        fixable: null,
        schema: [],
        messages: {
            forbidden: "ES2015 '{{name}}' method is forbidden.",
        },
    },
    create(context) {
        return {
            "Program:exit"() {
                const tracker = new ReferenceTracker(context.getScope())
                for (const { node, path } of tracker.iterateGlobalReferences({
                    Number: {
                        isNaN: { [READ]: true },
                    },
                })) {
                    context.report({
                        node,
                        messageId: "forbidden",
                        data: { name: path.join(".") },
                    })
                }
            },
        }
    },
}
