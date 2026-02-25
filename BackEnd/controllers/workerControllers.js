const Worker = require("../models/worker");

// إضافة عامل جديد
const addWorker = async (req, res) => {
    try {
        const { workerID ,firstName ,lastName ,age , role ,latitude ,longitude } = req.body;

        // نحول الموقع لأرقام
        const lat = Number(latitude);
        const lng = Number(longitude);

        // تحقق إنهم أرقام صحيحة
        if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: "Invalid coordinates" });
    }
        // نتأكد كل المعلومات موجودة
        if (!workerID || !firstName || !lastName || !age || !role || latitude === undefined || !longitude) {
            return res.status(400).json({ error: "Missing worker info" });
        }

        // التأكد أن العامل مش موجود مسبقًا
        const existingWorker = await Worker.findOne({ workerID });
        if (existingWorker) {
            return res.status(400).json({ error: "Worker already exists" });
        }

        const newWorker = new Worker({ 
             workerID: workerID.trim(), 
            firstName, 
            lastName, 
            age, 
            role,
            location: {
                        type: "Point",
                        coordinates: [lng, lat]
                      } 
        });
        await newWorker.save();

        res.status(201).json({ message: "Worker added", worker: newWorker });
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
        const workers = await Worker.find();
        res.json({ count: workers.length, workers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// عرض عامل معين
const getWorkerByID = async (req, res) => {
    try {
        const { workerID } = req.params;
        const worker = await Worker.findOne({ workerID });
        if (!worker) return res.status(404).json({ error: "Worker not found" });
        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addWorker,
    getAllWorkers,
    getWorkerByID,
    findWorkerByID
};
