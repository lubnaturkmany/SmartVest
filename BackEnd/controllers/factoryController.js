const Factory = require("../models/factory");
const User = require("../models/user");
const Zone = require("../models/zone");
const paginate = require("../utils/paginate");

// التحقق من القفل
const checkConfigured = (factory, user) => {
  if (factory.isConfigured && user.role !== "ADMIN") {
    const err = new Error("Factory configuration is locked");
    err.status = 403;
    throw err;
  }
};

// عرض كل المصانع (Admin فقط)
const getAllFactories = async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req);

    const factories = await Factory.find()
      .skip(skip)
      .limit(limit);

    const total = await Factory.countDocuments();

    const factoriesWithZoneCount = await Promise.all(
      factories.map(async (f) => {
        const count = await Zone.countDocuments({ factory: f._id });
        return { ...f.toObject(), zoneCount: count };
      })
    );

    res.status(200).json({
      factories: factoriesWithZoneCount,
      page,
      totalPages: Math.ceil(total / limit),
      totalFactories: total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// إضافة منطقة جديدة
const addZone = async (req, res) => {
  try {
    let { factoryId } = req.params;
    const { zoneName, types, center, radius, threshold } = req.body;

    // التحقق من أنواع صحيحة
    if (types && (!Array.isArray(types) || types.some(t => !["gas","temperature","flame","all"].includes(t)))) {
      return res.status(400).json({ error: "Invalid types array" });
    }

    // إذا المستخدم مش Admin، نستخدم مصنعه فقط
    if (req.user.role !== "ADMIN") {
      factoryId = req.user.factory;
    }

    const factory = await Factory.findById(factoryId);
    if (!factory) return res.status(404).json({ error: "Factory not found" });

    checkConfigured(factory, req.user);

    let finalTypes = types;
    if (types && types.includes("all")) {
      finalTypes = ["gas", "temperature", "flame"];
    }

    const newZone = new Zone({
      zoneName,
      types: finalTypes,
      center,
      radius,
      threshold,
      factory: factoryId
    });

    await newZone.save();

    res.status(201).json({
      message: "Zone added",
      zone: newZone
    });

  } catch (error) {
    console.log("ZONE ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// جلب الزونات
const getZones = async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req);

    let query = {};

    if (req.user.role !== "ADMIN") {
      query.factory = req.user.factory;
    }

    const zones = await Zone.find(query)
      .populate("factory", "name")
      .skip(skip)
      .limit(limit);

    const total = await Zone.countDocuments(query);

    res.status(200).json({
      zones,
      page,
      totalPages: Math.ceil(total / limit),
      totalZones: total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تعديل منطقة
const updateZone = async (req, res) => {
  try {
    let { factoryId, zoneId } = req.params;
    const { zoneName, types, center, radius, threshold } = req.body;

    // إذا المستخدم مش Admin، نستخدم مصنعه فقط
    if (req.user.role !== "ADMIN") {
      factoryId = req.user.factory;
    }

    const factory = await Factory.findById(factoryId);
    if (!factory) return res.status(404).json({ error: "Factory not found" });

    checkConfigured(factory, req.user);

    const zone = await Zone.findOne({ _id: zoneId, factory: factoryId });
    if (!zone) return res.status(404).json({ error: "Zone not found" });

    // تعديل القيم
    if (zoneName) zone.zoneName = zoneName;
    if (types) {
      let finalTypes = types.includes("all") ? ["gas","temperature","flame"] : types;
      zone.types = finalTypes;
    }
    if (center) zone.center = center;
    if (radius !== undefined) zone.radius = radius;
    if (threshold !== undefined) zone.threshold = threshold;

    await zone.save();
    res.status(200).json({ message: "Zone updated", zone });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف منطقة
const deleteZone = async (req, res) => {
  try {
    let { factoryId, zoneId } = req.params;

    if (req.user.role !== "ADMIN") {
      factoryId = req.user.factory;
    }

    const factory = await Factory.findById(factoryId);
    if (!factory) return res.status(404).json({ error: "Factory not found" });

    checkConfigured(factory, req.user);

    const zone = await Zone.findOneAndDelete({ _id: zoneId, factory: factoryId });
    if (!zone) return res.status(404).json({ error: "Zone not found" });

    const zones = await Zone.find({ factory: factoryId }).populate("factory", "name");

    res.status(200).json({ message: "Zone deleted", zones });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAllFactories,
  addZone,
  updateZone,
  deleteZone,
  getZones
};