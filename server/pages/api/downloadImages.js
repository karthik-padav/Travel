import clientPromise from "lib/mongodb";
import { getUUID } from "lib/common";
import { v4 as uuidv4 } from "uuid";

import path from "path";
import { promises as fs } from "fs";
import { client } from "https";
import { request } from "request";
import { XMLHttpRequest } from "xmlhttprequest";

// const fs = require("fs");

const collection_name = "things_to_do";
const url =
  "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTkNx5lHrGzEZjMgBK4R6VmM_npiO7HNN9hboQb9stCsi963rRtGiIfHcBpEyqoCi14CXTYg2M96lJwr54OUDlfxg";
// const filepath = "filepath.png";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("_travel");
  let list = await db.collection(collection_name).find({}).toArray();

  // const url = "https://sabe.io/images/saturn.png";

  // try {
  //   const response = await fetch(url);

  //   const filename = url.split('')
  //   console.log(filename);
  //   const blob = await response.blob();
  //   const arrayBuffer = await blob.arrayBuffer();
  //   const buffer = Buffer.from(arrayBuffer);
  //   await fs.writeFile("./public/images/saturn.png", buffer);
  // } catch (e) {
  //   console.log(e, "response123");
  // }

  function getFileName(url) {
    let a = url.split("=");
    a = a[a.length - 1];
    a = a.replace(/:/g);
    return `${a}.png`;
  }

  function fileExist(fileName) {
    const imagePath = `./public/images/${fileName}`;
    return fs
      .access(imagePath, fs.constants.F_OK, (err) => {})
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  async function downloadImage(url, filename) {
    await new Promise((res) => {
      setTimeout(res, 2000);
    });
    console.log("need to download", filename);
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(`./public/images/${filename}`, buffer);
  }

  let arr = [];
  for (const l of list) {
    if (l.image) {
      const fileName = getFileName(l.image);
      const _fileExist = await fileExist(fileName);
      if (!_fileExist) {
        arr.push({ fileName, url: l.image });
        await downloadImage(l.image, fileName);
      }
    }
    for (const i of l.images) {
      if (i) {
        const fileName = getFileName(i);
        const _fileExist = await fileExist(fileName);
        if (!_fileExist) {
          arr.push({ fileName, url: i });
          await downloadImage(i, fileName);
        }
      }
    }
  }
  res.status(200).json(arr);
}
