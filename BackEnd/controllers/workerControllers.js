const mongoose = require("mongoose");
const Worker = require("../models/worker");

// إضافة عامل جديد
const addWorker = async (req, res) => {
    try {
        const { workerID ,firstName ,lastName ,age  ,latitude ,longitude, zone } = req.body;

        // نحول الموقع لأرقام
        const lat = Number(latitude);
        const lng = Number(longitude);

        // تحقق إنهم أرقام صحيحة
        if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: "Invalid coordinates" });
    }
        // نتأكد كل المعلومات موجودة
        if (!workerID || !firstName || !lastName || !age || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ error: "Missing worker info" });
        }

        // التأكد أن العامل مش موجود مسبقًا
        const existingWorker = await Worker.findOne({ workerID });
        if (existingWorker) {
            return res.status(400).json({ error: "Worker already exists" });
        }

        const factoryId = req.body.factory || req.user.factory;
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
                lat: lat,
                lng: lng
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

const updateWorkerLocation = async (req, res) => {
  try {
    const { workerID } = req.params;
    const { latitude, longitude } = req.body;

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid coordinates" });
    }

    const worker = await Worker.findOne({
        workerID,
        factory: req.user.factory
    });
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // تحديث الموقع
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


//  ID البحث عن عامل حسب
const findWorkerByID = async (workerID) => {
    return await Worker.findOne({ workerID });
};

// عرض كل العمال
const getAllWorkers = async (req, res) => {
    try {
        const isAdminWithoutFactory =
        req.user.role === "ADMIN" && (req.user.factory == null || req.user.factory === "");

        const filter = isAdminWithoutFactory ? {} : { factory: req.user.factory };
        const workers = await Worker.find(filter);

        res.json({ count: workers.length, workers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// عرض عامل معين
const getWorkerByID = async (req, res) => {
    try {
        const { workerID } = req.params;

        // إذا المستخدم Worker نحصره بحاله فقط
        if (req.user.role === "Worker" && req.user.workerID !== workerID) {
            return res.status(403).json({ error: "Access denied" });
        }

        const isAdminWithoutFactory =
            req.user.role === "ADMIN" && (req.user.factory == null || req.user.factory === "");
        const query = isAdminWithoutFactory
            ? { workerID }
            : { workerID, factory: req.user.factory };

        const worker = await Worker.findOne(query)
        
        if (!worker) return res.status(404).json({ error: "Worker not found" });

        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//  workerID حذف العامل حسب الـ 
const deleteWorkerByID = async (req, res) => {
    try {
        const { workerID } = req.params;
        const isAdminWithoutFactory =
            req.user.role === "ADMIN" && (req.user.factory == null || req.user.factory === "");
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
