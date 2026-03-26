const Factory = require("../models/factory");

// التحقق من القفل 
const checkConfigured = (factory, user) => {
  if (factory.isConfigured && user.role !== "ADMIN") {
    const err = new Error("Factory configuration is locked");
    err.status = 403;
    throw err;
  }
};

// إنشاء مصنع جديد
const createFactory = async (req, res) => {
  try {
    const { name, zones } = req.body;

    if (!name) return res.status(400).json({ error: "Factory name is required" });

    const existing = await Factory.findOne({ name });
    if (existing) return res.status(400).json({ error: "Factory already exists" });

    const factory = new Factory({
      name,
      zones: zones || []
    });

    await factory.save();

    res.status(201).json({
      message: "Factory created successfully",
      factory
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// عرض كل المصانع (للاستخدام الداخلي فقط )
const getAllFactories = async (req, res) => {
  try {
    const factories = await Factory.find();
    res.status(200).json(factories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// إضافة منطقة جديدة للمصنع
const addZone = async (req, res) => {
  try {
    const { factoryId } = req.params;
    const { zoneName, type, center, radius, threshold } = req.body;

    const factory = await Factory.findById(factoryId);
    if (!factory) return res.status(404).json({ error: "Factory not found" });

    // التحقق من القفل قبل أي تعديل
    checkConfigured(factory, req.user);

    // التحقق من صحة القيم 
    factory.zones.push({ zoneName, type, center, radius, threshold });
    await factory.save();

    res.status(201).json({ message: "Zone added", zones: factory.zones });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تعديل منطقة
const updateZone = async (req, res) => {
  try {
    const { factoryId, zoneId } = req.params;
    const { zoneName, type, center, radius, threshold } = req.body;

    const factory = await Factory.findById(factoryId);
    if (!factory) return res.status(404).json({ error: "Factory not found" });

    // التحقق من القفل قبل أي تعديل
    checkConfigured(factory, req.user);

    const zone = factory.zones.id(zoneId);
    if (!zone) return res.status(404).json({ error: "Zone not found" });

    // تحقق من صحة القيم قبل التعديل
    if (type && !["gas", "temperature", "flame"].includes(type)) {
      return res.status(400).json({ error: "Invalid zone type" });
    }
    if (radius !== undefined && radius <= 0) {
      return res.status(400).json({ error: "Invalid radius" });
    }
    if (threshold !== undefined && threshold < 0) {
      return res.status(400).json({ error: "Invalid threshold" });
    }

    zone.zoneName = zoneName || zone.zoneName;
    zone.type = type || zone.type;
    zone.center = center || zone.center;
    zone.radius = radius || zone.radius;
    zone.threshold = threshold || zone.threshold;

    await factory.save();

    res.status(200).json({ message: "Zone updated", zone });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف منطقة
const deleteZone = async (req, res) => {
  try {
    const { factoryId, zoneId } = req.params;

    const factory = await Factory.findById(factoryId);
    if (!factory) return res.status(404).json({ error: "Factory not found" });

    // التحقق من القفل قبل الحذف
    checkConfigured(factory, req.user);

    const zone = factory.zones.id(zoneId);
    if (!zone) return res.status(404).json({ error: "Zone not found" });

    zone.remove();
    await factory.save();

    res.status(200).json({ message: "Zone deleted", zones: factory.zones });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFactory,
  getAllFactories,
  addZone,
  updateZone,
  deleteZone
};