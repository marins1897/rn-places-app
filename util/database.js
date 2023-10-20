import * as SQLite from 'expo-sqlite';
import { Place } from '../models/place';

const database = SQLite.openDatabase('places.db'); // create (or open existing) database

// initial database structure
export function init() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => { // .transaction execute a query
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS places ( 
                    id INTEGER PRIMARY KEY,
                    title TEXT NOT NULL,
                    imageUri TEXT NOT NULL,
                    address TEXT NOT NULL,
                    lat REAL NOT NULL,
                    lng REAL NOT NULL
                )`,
                [],
                () => {
                    resolve();
                },
                (_, error) => { 
                    reject(error);
                }
            ); // unutar zagrada dodajemo konfiguraciju za našu novu bazu
        });
    });

    return promise;
}

export function insertPlace(place) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
            [place.title, place.imageUri, place.address, place.location.lat, place.location.lng],
            (_, result) => {
                console.log(result);
                resolve(result);
            },
            (_, error) => {
                console.log(error);
                reject(error);
            }
            )
        });
    });

    return promise;
}


export function fetchPlaces() {
    const promise = new Promise((resolve, reject) => { // SELECT * FROM => select everything from places
        database.transaction((tx) => {
            tx.executeSql(`SELECT * FROM places`, 
            [],
            (_ , result) => {
                // return array of places with our standardized format
                const places = [];

                for (const dp of result.rows._array) {
                    places.push(new Place(dp.title, dp.imageUri, { address : dp.address, lat : dp.lat, lng : dp.lng }, dp.id ))
                }

                console.log(places);
                resolve(places);
            },
            (_, error) => {
                console.log(error);
                reject(error);
            }
            ); 
        });
    });

    return promise;
}

// id ce zamijeniti ? (pa ce bit id = id) 
// ? je kao null template koji ce bit napunjen podatkom
export function fetchPlacesDetails(id) {
    console.log(id);
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(`SELECT * FROM places WHERE id = ?`, 
            [id],
            (_, result) => {
                const dbPlace = result.rows._array[0];

                const place = new Place(dbPlace.title, 
                                        dbPlace.imageUri, 
                                        {   
                                            lat : dbPlace.lat, 
                                            lng : dbPlace.lng, 
                                            address : dbPlace.address 
                                        }, 
                                        dbPlace.id );
                console.log(place)
                resolve(place);
            },
            (_, error) => {
                console.log(error);
                reject(error);
            }
            );
        })
    });

    return promise;
}