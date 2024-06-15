import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/';
        if (file.fieldname === 'profile') {
            folder += 'profiles/';
        } else if (file.fieldname === 'product') {
            folder += 'products/';
        } else if (file.fieldname === 'document') {
            folder += 'documents/';
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export default upload;
