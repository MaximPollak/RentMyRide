const db = require('../services/database').config

const getAllCars = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM CCL2_cars'
        console.log(sql)
        db.query(sql, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

const getCarById = (id) => {
    const sql = 'SELECT * FROM CCL2_cars WHERE car_id = ?'

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, results) => {
            console.log('Looking for car ID:', id)
            if (err) return reject(err)
            if (results.length === 0) return resolve(null)
            resolve(results[0]) // only one car expected
        })
    })
}

const addCar = (carData) => {
    const sql = `
        INSERT INTO CCL2_cars (brand, model, category, info, price_per_day, image_url, available)
        VALUES (?, ?, ?, ?, ?, ?, ?)`

    const values = [
        carData.brand,
        carData.model,
        carData.category,
        carData.info,
        carData.price_per_day,
        carData.image_url, // ← was 'picture' before — this is the fix
        carData.available
    ]

    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) return reject(err)
            resolve({ id: result.insertId, ...carData })
        })
    })
}

const editCar = (id, carData) => {
    const sql = `
    UPDATE CCL2_cars SET brand = ?, model = ?, category = ?, info = ?, price_per_day = ?, image_url = ?, available = ?
    WHERE car_id = ?
  `
    const values = [
        carData.brand,
        carData.model,
        carData.category,
        carData.info,
        carData.price_per_day,
        carData.image_url,
        carData.available,
        id
    ]

    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) return reject(err)
            resolve({ message: 'Car updated', id })
        })
    })
}

const deleteCar = (id) => {
    const sql = 'DELETE FROM CCL2_cars WHERE car_id = ?'

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err)
            resolve({ message: 'Car deleted', id })
        })
    })
}

module.exports = {
    getAllCars,
    getCarById,
    addCar,
    editCar,
    deleteCar,
}
