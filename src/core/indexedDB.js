const store = {};

(function() {

const dbVersion = 1;
const dbName = 'houseMaze';
// const tableVillage = 'village';
const tables = [{
    name: 'village',
    keyPath: 'name',
    addedInVersion: 1,
    indexes: [{
        name: 'name',
        keyPath: 'name',
        addedInVersion: 1,
        unique: true,
        multiEntry: false,
    }],
}, {
    name: 'house',
    keyPath: 'name',
    addedInVersion: 1,
    indexes: [{
        name: 'name',
        keyPath: 'name',
        addedInVersion: 1,
        unique: true,
        multiEntry: false,
    }],
}];

let DB = null;
const DBReady = (() => {
	var cb = {};
	var p = new Promise((success, error) => {
		cb.success = success;
		cb.error = error;
	});

	return Object.assign(p, cb);
})();
store.$DBReady = DBReady;

/*
	To remove Db from browser:
	indexedDB.deleteDatabase(dbName)
*/
    // indexedDB.deleteDatabase(dbName)

function setDB(db) {
    DB = db;
    store.$DB = db;
}

function upgradeDB(event) {
    setDB(event.target.result);
    
    const oldVersion = event.oldVersion;

    for (const table of tables) {
        let objectStore;
        if (table.addedInVersion > oldVersion) {
            objectStore = DB.createObjectStore(table.name, {
                keyPath: table.keyPath,
            });
        }

        for (const index of table.indexes) {
            if (index.addedInVersion > oldVersion) {
                if (!objectStore) {
                    const transaction = DB.transaction([table.name], 'readonly');
                    objectStore = transaction.objectStore(table.name);
                }
                objectStore.createIndex('index_' + index.name, index.keyPath, {
                    unique: !!index.unique,
                    multiEntry: !!index.multiEntry,
                })
            }
        }
    }

	// switch(event.oldVersion) {
	// 	case 0:
	// 		let objectStore = DB.createObjectStore(tableVillage, {keyPath: 'code'});
	// 		objectStore.createIndex('index_code', 'code', {unique: true});
	// 		objectStore.createIndex('index_nbw', 'nbw', {unique: false});
	// 		objectStore.createIndex('index_nbf', 'nbf', {unique: false});
	// 		objectStore.createIndex('index_create', 'create', {unique: false});
	// 		objectStore.createIndex('index_update', 'update', {unique: false});
	// 		objectStore.createIndex('index_name', 'name', {unique: true});
	// }
}

function onVersionChange(event) {
	console.warn('indexedDB version has change in a newer tab. This page should be reloaded.');
	//DB.close();
	DBReady.error(event);
}

function connectionSuccess(event) {
	if (!DB) {
        setDB(event.target.result);
	}
	DBReady.success(DB);

	DB.onversionchange = onVersionChange;
}

function openDB() {
	let request = self.indexedDB.open(dbName, dbVersion);

	request.onerror = (event) => {
	    // mostly happen when user forbid indexedDB
	    console.error(event);
	    DBReady.error(event);
	};
	request.onupgradeneeded = upgradeDB;
	request.onsuccess  = connectionSuccess;
	request.onblocked  = (event) => {
		console.log('is running in another tab. Its version is deprecated and must be refresh');
		DBReady.error(DB);
	};
}

openDB();

const manageError = (error) => (event) => error(event.target.error);

// fill store object with tables and give them methods
for (const table of tables) {
    const {name: tableName, keyPath: primaryKey} = table;
    const data = {
        getAll: function(index, ascOrder = true) {
            if (index === undefined || index === null) {
                index = primaryKey;
            }

            return new Promise(async (success, error) => {
                const DB = await DBReady;
                const request = DB
                    .transaction([tableName], 'readonly')
                    .objectStore(tableName) //TODO: see how to sort
                    .index('index_' + index)
                    .getAll();
                request.onsuccess = function (event) {
                    success(ascOrder ? event.target.result : event.target.result.reverse());
                };
                request.onerror = manageError(error);
            });
        },

        get: function(id) {
            return new Promise(async (success, error) => {
                const DB = await DBReady;
                const request = DB
                    .transaction([tableName], 'readonly')
                    .objectStore(tableName)
                    .get(id);
                request.onsuccess = function (event) {
                    success(event.target.result);
                };
                request.onerror = manageError(error);
            });
        },

        has: function (id) {
            return new Promise(async (success, error) => {
                const DB = await DBReady;
                const request = DB
                    .transaction([tableName], 'readonly')
                    .objectStore(tableName)
                    .get(id);
                request.onsuccess = function (event) {
                    success(typeof event.target.result !== 'undefined');
                };
                request.onerror = manageError(error);
            });
        },

        delete: function (id) {
            return new Promise(async (success, error) => {
                const DB = await DBReady;
                const request = DB
                    .transaction([tableName], 'readwrite')
                    .objectStore(tableName)
                    .delete(id);
                request.onsuccess = function (event) {
                    success(event.target.result);
                };
                request.onerror = manageError(error);
            });
        },

        set: function (id, item) {
            if (item === undefined) {
                item = id;
                id = item[primaryKey];
            }

            return new Promise(async (success, error) => {
                if (id === undefined || id === null) {
                    console.warn(id, item);
                    error('id "' + id + '" is incorrect');
                }
                const oldItem = await this.has(id);

                if (!oldItem) {
                    item.createDate = Date.now();
                }
                item.updateDate = Date.now();

                const DB = await DBReady;
                const request = DB
                    .transaction([tableName], 'readwrite')
                    .objectStore(tableName)
                    .put(item);
                request.onsuccess = function (event) {
                    success(event.target.result);
                };
                request.onerror = manageError(error);
            });
        }
    };

    store[table.name] = data;
}

// self.store = {
// 	gobleans: {
// 		getAll: function(index = 'code', ascOrder = true) {
// 			return new Promise(async (success, error) => {
// 				const DB = await DBReady;
// 				const request = DB
// 					.transaction([tableVillage], 'readonly')
// 					.objectStore(tableVillage) //how to sort
// 					.index('index_' + index)
// 					.getAll();
// 				request.onsuccess = function(event) {
// 					success(ascOrder ? event.target.result : event.target.result.reverse());
// 				};
// 				request.onerror = manageError(error);
// 			});
// 		},
// 		get: function(code) {
// 			return new Promise(async (success, error) => {
// 				const DB = await DBReady;
// 				const request = DB
// 					.transaction([tableVillage], 'readonly')
// 					.objectStore(tableVillage)
// 					.get(code);
// 				request.onsuccess = function(event) {
// 					success(event.target.result);
// 				};
// 				request.onerror = manageError(error);
// 			});
// 		},
// 		has: function(code) {
// 			return new Promise(async (success, error) => {
// 				const DB = await DBReady;
// 				const request = DB
// 					.transaction([tableVillage], 'readonly')
// 					.objectStore(tableVillage)
// 					.get(code);
// 				request.onsuccess = function(event) {
// 					success(typeof event.target.result !== 'undefined');
// 				};
// 				request.onerror = manageError(error);
// 			});
// 		},
// 		delete: function(code) {
// 			return new Promise(async (success, error) => {
// 				const DB = await DBReady;
// 				const request = DB
// 					.transaction([tableVillage], 'readwrite')
// 					.objectStore(tableVillage)
// 					.delete(code);
// 				request.onsuccess = function(event) {
// 					success(event.target.result);
// 				};
// 				request.onerror = manageError(error);
// 			});
// 		},
// 		set: function(item) {
// 			return new Promise(async (success, error) => {
// 				if (!item.code) {
// 					console.log(item)
// 					error('no code for this goblean');
// 				}
// 				const oldItem = await this.has(item.code);

// 				if (!oldItem) {
// 					item.create = Date.now();
// 				}
// 				item.update = Date.now();

// 				const DB = await DBReady;
// 				const request = DB
// 					.transaction([tableVillage], 'readwrite')
// 					.objectStore(tableVillage)
// 					.put(item);
// 				request.onsuccess = function(event) {
// 					success(event.target.result);
// 				};
// 				request.onerror = manageError(error);
// 			});
// 		}
// 	}
// };

})();

export default store;
