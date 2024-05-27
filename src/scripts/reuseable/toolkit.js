const sqlite3 = require('sqlite3');
const path = require('path');

async function validateOwnershipViaUUID(account, UUID){
    var validated = await new Promise ((resolve, reject) => {
        var db = new sqlite3.Database(path.resolve('src/databases/notely.sqlite'));

        db.get('SELECT * FROM notes WHERE N_UUID = ?', [UUID], (err, row) => {
            if (err){
                console.log(err);
            }

            if (row.N_OWNER == account){
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });

    if (!validated){
        return false;
    } else {
        return true;
    }
}

module.exports = { validateOwnershipViaUUID }