export default function genHex(length: number) : string {
    length = length || 32;
    let id = "";
    for (let i = 0; i < Math.ceil(length / 8) ; i++) {
        let part = 0;
        do {
            part = Math.random() * 0xffffffff;
        } while (part === 0);
        let res = Math.floor(part).toString(16);
        while (res.length < 8) {
            res = "0" + res;
        }
        id += res;
    }
    return id.substr(0, length);
}
