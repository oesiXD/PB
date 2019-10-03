/// <reference types="node" />
import Settings from '../settings';
import { Entry } from '../types/index';
export declare type AsyncCallback = (err: NodeJS.ErrnoException, entries: Entry[]) => void;
export declare function read(dir: string, settings: Settings, callback: AsyncCallback): void;
export declare function readdirWithFileTypes(dir: string, settings: Settings, callback: AsyncCallback): void;
export declare function readdir(dir: string, settings: Settings, callback: AsyncCallback): void;
//# sourceMappingURL=async.d.ts.map