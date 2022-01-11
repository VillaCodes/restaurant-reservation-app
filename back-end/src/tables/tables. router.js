/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

 const router = require("express").Router();
 const methodNotAllowed = require("../errors/methodNotAllowed");
 const controller = require("./reservations.controller");
 
 router.route("/").get(controller.list).all(methodNotAllowed);
 router.route("/:reservationId").read(controller.read).update(controller.update).delete(controller.delete).all(methodNotAllowed);
 
 module.exports = router;