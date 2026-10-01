const SIZE = 1000;

const bitArray = new Array(SIZE).fill(false);
const userModel = require("../models/users.model");

function fixedHash(str) {
    if (!str) return 0;

    let sum = 0;
    str = str.toLowerCase();

    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i) * (i + 1);
    }

    return sum % SIZE;
}

function add(str) {
    const index = fixedHash(str);
    bitArray[index] = true;
}

function mightContain(str) {
    const index = fixedHash(str);
    return bitArray[index];
}

async function initFromDB() {
    const users = await userModel.find({}, { name: 1, email: 1 }).lean();

    for (const user of users) {
        add(user.email);
        add(user.name);
    }
}

module.exports = {
    add,
    mightContain,
    has: mightContain,
    fixedHash,
    initFromDB
};