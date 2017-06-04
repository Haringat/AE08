export default class Matrix33 {

    public rows: Array<Array<number>>;

    constructor(rows: Array<Array<number>>) {
        if (rows.length != 3) {
            throw new Error(`Matrix33: need exactly 3 rows. ${rows.length} rows given.`);
        }
        if (!rows.every(row => row.length === 3)) {
            throw new Error(`Matrix33: each row needs to have exactly 3 entries.`);
        }
        this.rows = rows;
    }
}