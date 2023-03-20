import formidable from 'formidable';
import express from 'express';
import User from '../models/User.js';
import fs from 'fs';
const router = express.Router();

const saveImageUrl = async (fileNames, database) => {
  switch (database) {
    case 'user': {
      const updatedUser = {
        avatar: fileNames,
      };
      try {
        await User.findOneAndUpdate({ _id: req.user._id }, updatedUser, {
          returnOriginal: false,
        });
        res.status(200).json({ message: 'Upload avatar thành công' });
      } catch (error) {
        res.json(500).json({ message: 'Đã xảy ra lỗi' });
      }
    }
  }
};

router.post('/uploads', (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir: './uploads',
    keepExtensions: true,
    maxFieldsSize: 10 * 1024 * 1024,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({
        data: {},
        message: 'Can not upload images. Error: ' + err,
      });
    }

    if (files.images.length) {
      const fileNames = files.images.map((file) => file.newFilename);
      saveImageUrl(fileNames, 'user');
      res.status(200).json({
        data: fileNames,
        numberOfImages: fileNames.length,
        message: 'Upload images successfully',
      });
    } else if (!!files.images) {
      saveImageUrl(fileNames, 'user');
      const fileNames = [files.images.newFilename];
      res.status(200).json({
        data: fileNames,
        numberOfImages: 1,
        message: 'Upload images successfully',
      });
    } else {
      res.json({
        data: {},
        message: 'No images were uploaded',
      });
    }
  });
});

router.get('/:imageName', (req, res) => {
  const imageName = './uploads/' + req.params.imageName;
  fs.readFile(imageName, (err, data) => {
    if (err) {
      return res.json({ message: 'Cannot read images. ' + err });
    }
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(data);
  });
});

export default router;
