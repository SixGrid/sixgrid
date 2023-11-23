import * as path from 'path'

export function stringArrayCharacterLength (input: string[]) {
    let length = 0
    for (let thing of input) {
        length += thing.length
    }
    return length
}
export function paragraphSplit (input: string, maximumLineWidth: number) {
    let resultList = [] /* string[][] */
    let inputSplitted = input.split(' ')
    let buffer = [] /* input[] */
    for (let i = 0; i < inputSplitted.length; i++) {
        let bufferCharLen = stringArrayCharacterLength(buffer) + buffer.length
        if (bufferCharLen + inputSplitted[i].length + 1 > maximumLineWidth) {
            resultList.push(buffer)
            buffer = []
        }
        buffer.push(inputSplitted[i])
    }

    resultList.push(buffer)

    let resultArray = []
    for (let i = 0; i < resultList.length; i++) {
        let tmp = [] /* string[] */
        for (let x = 0; x < resultList[i].length; x++) {
            tmp.push(resultList[i][x])
        }
        let tmpString = tmp.join(' ')
        resultArray.push(tmpString)
    }
    return resultArray.join('\n')
}
export function steamCloudConfigDirectory() {
    let target = path.join(path.dirname(process.execPath), 'AppConfig')
    if (path.basename(process.execPath).startsWith('electron')) {
        target = path.join(process.cwd(), 'AppConfig')
    }
    return target
}
function isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
export function deepClone(target: any, source: any): any {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = deepClone(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}
export function clone(data: any): any {
    return JSON.parse(JSON.stringify(data))
}