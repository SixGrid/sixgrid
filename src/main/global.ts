import * as fs from 'fs'
declare global {
    namespace NodeJS {
        interface Global {
            document: Document;
            window: Window;
            navigator: Navigator;
            logfile_FileStream: fs.WriteStream;
            OldConsole: {[key: string]: any};
        }
    }
}