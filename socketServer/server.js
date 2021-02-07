/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

"use strict";

const express = require("express");

const app = express();
app.get("/", (req, res) => {
  res.send("hello hehehe!");
});

const PORT = 3000;
const HOST = "0.0.0.0";
app.listen(PORT, HOST);

console.log(`express running at http:${HOST}:${PORT}`);
