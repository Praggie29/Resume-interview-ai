const userModel = require("../models/users.model");

// 1. Vector of 50,000 slots (all initialized to 0)
const hashVector = new Uint8Array(50000);

// 2. Three clean hash functions
function hash1(email) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 31 + email.charCodeAt(i)) % hashVector.length;
  }
  return hash;
}

function hash2(email) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 37 + email.charCodeAt(i)) % hashVector.length;
  }
  return hash;
}

function hash3(email) {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash * 43 + email.charCodeAt(i)) % hashVector.length;
  }
  return hash;
}

// 3. Add email
function addEmail(email) {
  if (!email) return;

  const cleanEmail = email.trim().toLowerCase();

  const slot1 = hash1(cleanEmail);
  const slot2 = hash2(cleanEmail);
  const slot3 = hash3(cleanEmail);

  hashVector[slot1] = 1;
  hashVector[slot2] = 1;
  hashVector[slot3] = 1;
}

function add(email) {
  addEmail(email);
}

async function initFromDB() {
  const users = await userModel.find({}, "email").lean();

  for (const user of users) {
    if (user && user.email) {
      addEmail(user.email);
    }
  }
}

// 4. Check email
function checkEmail(email) {
  if (!email) return false;

  const cleanEmail = email.trim().toLowerCase();

  const slot1 = hash1(cleanEmail);
  const slot2 = hash2(cleanEmail);
  const slot3 = hash3(cleanEmail);

  if (hashVector[slot1] === 0 || hashVector[slot2] === 0 || hashVector[slot3] === 0) {
    return false; // Definitely available
  }

  return true; // Might exist
}

// Fixed export
module.exports = { addEmail, add, initFromDB, checkEmail };