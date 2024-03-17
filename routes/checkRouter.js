// const express = require("express");
import { Router } from "express";
const CheckRouter = Router();

CheckRouter.get("/check", (req, res) => {
  res.send("Checked Working");
});
export default CheckRouter;
// module.exports = router;
