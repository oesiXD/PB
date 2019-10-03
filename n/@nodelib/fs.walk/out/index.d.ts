/// <reference types="node" />
import { Readable } from 'stream';
import { Dirent, FileSystemAdapter } from '@nodelib/fs.scandir';
import { AsyncCallback } from './providers/async';
import Settings, { DeepFilterFunction, EntryFilterFunction, ErrorFilterFunction, Options } from './settings';
import { Entry } from './types/index';
declare function walk(dir: string, callback: AsyncCallback): void;
declare function walk(dir: string, optionsOrSettings: Options | Settings, callback: AsyncCallback): void;
declare namespace walk {
    function __promisify__(dir: string, optionsOrSettings?: Options | Settings): Promise<Entry[]>;
}
declare function walkSync(dir: string, optionsOrSettings?: Options | Settings): Entry[];
declare function walkStream(dir: string, optionsOrSettings?: Options | Settings): Readable;
export { walk, walkSync, walkStream, Settings, AsyncCallback, Dirent, Entry, FileSystemAdapter, Options, DeepFilterFunction, EntryFilterFunction, ErrorFilterFunction };
//# sourceMappingURL=index.d.ts.map