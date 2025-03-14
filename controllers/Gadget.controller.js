import db from "../models/index.js";
import {
  DeleteData,
  GetData,
  SetData,
} from "../Redis_Cache_Handlers/Redis_handlers.js";
const { Gadget } = db;

export const addGadget = async (req, res) => {
  await DeleteData(process.env.GADGET_REDIS_CACHE_PREFIX);
  try {
    const { name } = req.body;
    const gadget = await Gadget.create({ name });
    return res.status(201).json(gadget);
  } catch (error) {
    console.error("Add Gadget Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getGadgets = async (req, res) => {
  try {
    const GADGETS_CACHE_KEY = process.env.GADGET_REDIS_CACHE_PREFIX;
    let gadgets = await GetData(GADGETS_CACHE_KEY);

    if (gadgets) {
      console.log("Serving from Redis Cache");
      gadgets = JSON.parse(gadgets);
    } else {
      console.log("Fetching from Database");
      gadgets = await Gadget.findAll();
      SetData(GADGETS_CACHE_KEY, process.env.REDIS_CACHE_EXPIRY, gadgets);
    }
    const gadgetsWithProbability = gadgets.map((gadget) => ({
        successProbability: `${Math.floor(Math.random() * 100) + 1}%`,
        id: gadget.id,
        name: gadget.name,
        status: gadget.status,
        decommissioned_at: gadget.decommissioned_at,
        createdAt: gadget.createdAt,
        updatedAt: gadget.updatedAt,
    }));

    res.json(gadgetsWithProbability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGadgetByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const GADGETS_CACHE_KEY = `${process.env.GADGET_REDIS_CACHE_PREFIX}:${status}`;
    const cached_gadgets = await GetData(GADGETS_CACHE_KEY);
    if (cached_gadgets) {
      console.log("Serving from Redis Cache");
      return res.json(JSON.parse(cached_gadgets));
    }
    const gadgets = await Gadget.findAll({ where: { status } });
    await SetData(GADGETS_CACHE_KEY, process.env.REDIS_CACHE_EXPIRY, gadgets);
    res.json(gadgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateGadget = async (req, res) => {
  await DeleteData(process.env.GADGET_REDIS_CACHE_PREFIX);
  try {
    console.log("req.params", req.params);
    const { id } = req.params;
    const updateGadget = await Gadget.update(req.body, { where: { id } });
    console.log("updateGadget", updateGadget);
    if (updateGadget == 0) {
      return res.status(404).json({ error: "Gadget not found" });
    }
    const updatedGadget = await Gadget.findByPk(id);
    res.json({
      message: "Gadget updated successfully",
      updatedGadget: updatedGadget,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const decommissionGadget = async (req, res) => {
  await DeleteData(process.env.GADGET_REDIS_CACHE_PREFIX);
  try {
    const { id } = req.params;
    const updated = await Gadget.update(
      { status: "Decommissioned", decommissioned_at: new Date() },
      { where: { id } }
    );
    if (!updated[0]) return res.status(404).json({ error: "Gadget not found" });
    res.json({ message: "Gadget decommissioned" });
  } catch (error) {
    console.error("Decommission Gadget Error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const TriggerSelfDestruct = async (req, res) => {
  await DeleteData(process.env.GADGET_REDIS_CACHE_PREFIX);
  try {
    const { id } = req.params;
    const gadget = await Gadget.findByPk(id);
    if (!gadget) {
      return res.status(404).json({ error: "Gadget not found" });
    }
    const confirmationCode = Math.floor(100000 + Math.random() * 900000);
    await Gadget.update(
      { status: "Destroyed", decommissioned_at: new Date() },
      { where: { id } }
    );
    return res.json({
      message: `Self-destruct sequence initiated for gadget "${gadget.name}".`,
      confirmationCode,
      status: "Destroyed",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
