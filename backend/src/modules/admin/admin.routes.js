const express = require("express");
const adminController = require("./admin.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const allowRoles = require("../../middlewares/role.middleware");

const router = express.Router();

router.use(authMiddleware, allowRoles("admin"));

router.get("/dashboard", adminController.getDashboardStats);

router.get("/landlords", adminController.getAllLandlords);
router.patch("/landlords/:id/ban", adminController.banLandlord);
router.patch("/landlords/:id/unban", adminController.unbanLandlord);
router.delete("/landlords/:id", adminController.deleteLandlord);

router.get("/listings", adminController.getAllListings);
router.patch("/listings/:id/hide", adminController.hideListing);
router.patch("/listings/:id/unhide", adminController.unhideListing);
router.delete("/listings/:id", adminController.deleteListing);


module.exports = router;