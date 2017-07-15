// NOTE: this adds a filename and line number to winston's output
// Example output: 'info (routes/index.js:34) GET 200 /index'

import winston = require('winston');
import path = require('path');
const PROJECT_ROOT = path.join(__dirname, '..');

const winstonLogger = winston;//new winston.Logger();

winstonLogger.cli();
winstonLogger.level = 'silly';

export namespace logger {

// A custom winstonLogger interface that wraps winston, making it easy to instrument
// code and still possible to replace winston in the future.

    export const debug = function (...args: any[]) {
        winstonLogger.debug.apply(winstonLogger, formatLogArguments(arguments))
    };

    export const info = function (...args: any[]) {
        winstonLogger.info.apply(winstonLogger, formatLogArguments(arguments))
    };

    // noinspection JSUnusedGlobalSymbols
    export const warn = function (...args: any[]) {
        winstonLogger.warn.apply(winstonLogger, formatLogArguments(arguments))
    };

    export const error = function (...args: any[]) {
        winstonLogger.error.apply(winstonLogger, formatLogArguments(arguments))
    };

    // noinspection JSUnusedGlobalSymbols
    export const stream = winstonLogger.stream;
}

/**
 * Attempts to add file and line number info to the given log arguments.
 */
function formatLogArguments (args: any) {
    args = Array.prototype.slice.call(args);

    const stackInfo = getStackInfo(1);

    if (stackInfo) {
        // get file path relative to project root
        const calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')';

        if (typeof (args[0]) === 'string') {
            args[0] = calleeStr + ' ' + args[0]
        } else {
            args.unshift(calleeStr)
        }
    }

    return args
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo (stackIndex: any) {
    // get call stack, and analyze it
    // get all file, method, and line numbers
    const stack = (new Error()).stack;
    if (!stack) {
        return;
    }
    const stacklist = stack.split('\n').slice(3);

    // stack trace format:
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    const stackReg2 = /at\s+(.*):(\d*):(\d*)/gi;

    const s = stacklist[stackIndex] || stacklist[0];
    const sp = stackReg.exec(s) || stackReg2.exec(s);

    if (sp && sp.length === 5) {
        return {
            method: sp[1],
            relativePath: path.relative(PROJECT_ROOT, sp[2]),
            line: sp[3],
            pos: sp[4],
            file: path.basename(sp[2]),
            stack: stacklist.join('\n')
        }
    }
}
