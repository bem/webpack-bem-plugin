'use strict';

const { parse: bemParse } = require('@bem/sdk.import-notation');

const namingConvention = require('./helpers/namingConvention');
const entityFromPath = require('./helpers/entityFromPath');

function completeRequest(request, ctx) {
    // TODO: use @bem/sdk.import-notation solution in issues/9
    if (/^b:/.test(request)) {
        return request;
    }

    if (/^e:/.test(request)) {
        return `b:${ctx.block} ${request}`;
    }

    if (/^[mt]:/.test(request)) {
        return `b:${ctx.block} ` + (ctx.elem ? `e:${ctx.elem} ` : '') + request;
    }
}

/**
 * BemRequest builds BEM-entities list and request identifier
 */
class BemRequest {
    constructor(request, filePath, levels, setIndex) {
        // TODO: improve in issues/10
        const requestNaming = namingConvention.getFromLevelsByPath(levels, filePath);

        const ctx = entityFromPath(filePath, requestNaming);

        this.entities = bemParse(request, ctx);

        this.ident = `bem-${completeRequest(request, ctx)}-${setIndex}`;
    }
}

module.exports = BemRequest;
