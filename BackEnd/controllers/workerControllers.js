const mongoose = require("mongoose");
const Worker = require("../models/worker");
const paginate = require("../utils/paginate");

// إضافة عامل جديد
const addWorker = async (req, res) => {
    try {
        const { workerID, firstName, lastName, age, latitude, longitude, zone } = req.body;

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: "Invalid coordinates" });
        }

        if (!workerID || !firstName || !lastName || !age || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: "Missing worker info" });
        }

        const existingWorker = await Worker.findOne({ workerID });
        if (existingWorker) {
            return res.status(400).json({ error: "Worker already exists" });
        }

        const factoryId = req.body.factory || req.factory?._id;

        if (!factoryId) {
            return res.status(400).json({
                error: "Factory is required. Send factory ID or assign a factory to your user account."
            });
        }

        const newWorker = new Worker({
            workerID: workerID.trim(),
            firstName,
            lastName,
            age,
            location: {
                type: "Point",
                coordinates: [lng, lat]
            },
            lastLocation: {
                lat,
                lng
            },
            factory: new mongoose.Types.ObjectId(factoryId),
            zone: zone ? new mongoose.Types.ObjectId(zone) : null
        });

        await newWorker.save();

        res.status(201).json({ message: "Worker added", worker: newWorker });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// تحديث موقع العامل
const updateWorkerLocation = async (req, res) => {
    try {
        const { workerID } = req.params;
        const { latitude, longitude } = req.body;

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: "Invalid coordinates" });
        }

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const worker = await Worker.findOne({
            workerID,
            factory: req.user.factory
        });

        if (!worker) {
            return res.status(404).json({ error: "Worker not found" });
        }

        worker.location = {
            type: "Point",
            coordinates: [lng, lat]
        };

        worker.lastLocation = {
            lat,
            lng
        };

        await worker.save();

        res.json({ message: "Location updated", worker });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// البحث عن عامل حسب ID
const findWorkerByID = async (workerID) => {
    return await Worker.findOne({ workerID });
};


// عرض كل العمال
const getAllWorkers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const isAdminWithoutFactory =
            req.user.role === "ADMIN" &&
            (!req.user.factory || req.user.factory === "");

        const filter = isAdminWithoutFactory
            ? {}
            : { factory: req.user.factory };

        const workers = await Worker.find(filter)
            .skip(skip)
            .limit(limit);

        const total = await Worker.countDocuments(filter);

        res.json({
            workers,
            page,
            totalPages: Math.ceil(total / limit),
            totalWorkers: total,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// عرض عامل معين
const getWorkerByID = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { workerID } = req.params;

        if (req.user.role === "Worker" && req.user.workerID !== workerID) {
            return res.status(403).json({ error: "Access denied" });
        }

        const isAdminWithoutFactory =
            req.user.role === "ADMIN" &&
            (!req.user.factory || req.user.factory === "");

        const query = isAdminWithoutFactory
            ? { workerID }
            : { workerID, factory: req.user.factory };

        const worker = await Worker.findOne(query);

        if (!worker) {
            return res.status(404).json({ error: "Worker not found" });
        }

        res.json(worker);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// حذف عامل حسب ID
const deleteWorkerByID = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { workerID } = req.params;

        const isAdminWithoutFactory =
            req.user.role === "ADMIN" &&
            (!req.user.factory || req.user.factory === "");

        const deleteQuery = isAdminWithoutFactory
            ? { workerID }
            : { workerID, factory: req.user.factory };

        const deletedWorker = await Worker.findOneAndDelete(deleteQuery);

        if (!deletedWorker) {
            return res.status(404).json({ error: "Worker not found" });
        }

        res.json({ message: "Worker deleted", worker: deletedWorker });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// حذف جميع العمال
const deleteAllWorkers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const result = await Worker.deleteMany({ factory: req.user.factory });

        res.json({ message: `Deleted ${result.deletedCount} workers` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    addWorker,
    getAllWorkers,
    getWorkerByID,
    findWorkerByID,
    deleteWorkerByID,
    deleteAllWorkers,
    updateWorkerLocation
};