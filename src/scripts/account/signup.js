const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

async function signup(email, password) {
    var emailNotExistsValidated = await valdateEmailDoesntExist(email);

    if (!emailNotExistsValidated) {
        return "E014";
    }

    var emailValidated = await validateEmail(email);

    if (!emailValidated) {
        return "E015";
    }

    var passwordValidated = await validatePassword(password);

    if (!passwordValidated) {
        return "E016";
    }

    var passwordHashValidated = await hashPassword(password);

    if (!passwordHashValidated) {
        return "E017";
    }

    var accountAddedToDatabaseValidated = addAccountToDatabase(
        email,
        passwordHashValidated,
    );

    if (!accountAddedToDatabaseValidated) {
        return "E017";
    } else {
        return "I007";
    }
}

async function valdateEmailDoesntExist(email) {
    var validated = await new Promise((resolve, reject) => {
        var db = new sqlite3.Database(
            path.resolve("src/databases/notely.sqlite"),
        );

        db.all(
            "SELECT * FROM accounts WHERE A_EMAIL = ?",
            [email],
            (err, rows) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                }

                if (rows.length >= 1) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            },
        );
    });

    if (!validated) {
        return false;
    } else {
        return true;
    }
}

async function validateEmail(email) {
    var validated = await new Promise((resolve, reject) => {
        if (email.length > 320) {
            resolve(false);
        }

        if (email.length < 5) {
            resolve(false);
        }

        if (!email.includes("@")) {
            resolve(false);
        }

        if (!email.includes(".")) {
            resolve(false);
        }

        if (email.includes(" ")) {
            resolve(false);
        }

        resolve(true);
    });

    if (!validated) {
        return false;
    } else {
        return true;
    }
}

async function validatePassword(password) {
    var validated = await new Promise((resolve, reject) => {
        if (password.length < 8) {
            resolve(false);
        }

        if (!passwordRegex.test(password)) {
            resolve(false);
        }

        if (password.includes(" ")) {
            resolve(false);
        }

        resolve(true);
    });

    if (!validated) {
        return false;
    } else {
        return true;
    }
}

async function hashPassword(password) {
    var validated = await new Promise((resolve, reject) => {
        bcrypt
            .genSalt(saltRounds)
            .then((salt) => {
                return bcrypt.hash(password, salt);
            })
            .then((hash) => {
                resolve(hash);
            })
            .catch((err) => {
                console.error(err.message);
                resolve(false);
            });
    });

    if (!validated) {
        return false;
    } else {
        return validated;
    }
}

async function addAccountToDatabase(email, password) {
    var validated = await new Promise((resolve, reject) => {
        var db = new sqlite3.Database(
            path.resolve("src/databases/notely.sqlite"),
        );

        db.run(
            "INSERT INTO `accounts` (`A_EMAIL`, `A_PASSWORD`) VALUES (?, ?)",
            [email, password],
            (err) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                }

                resolve(true);
            },
        );
    });

    if (!validated) {
        return false;
    } else {
        return true;
    }
}

module.exports = { signup };
