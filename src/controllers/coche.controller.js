import { getConnection } from "./../database/database"
const fs = require('node:fs');
const multer = require('multer');

const upload = multer({ dest: './static/img' });

const getCoches = async (req, res) => {
    try{
        const connection = await getConnection();
        const result = await connection.query("SELECT coche.id, marca.nombre AS 'Marca', coche.modelo, coche.descripcion, coche.precio, coche.fecha_creacion,coche.fecha_modificacion,coche.imagen_blob FROM coche,marca WHERE coche.marca_id = marca.id ORDER BY coche.id")
        console.log(result)
        res.json(result)
    } catch(error){
        res.status(500)
        res.send(error.message)
    }
}

const getCoche = async (req, res) => {
    try{
        const { id } = req.params
        const conecction = await getConnection();
        const result = await conecction.query("SELECT coche.id, marca.nombre AS 'Marca', coche.modelo, coche.descripcion, coche.precio FROM coche , marca WHERE coche.marca_id  = marca.id and coche.id = ?", id)
        console.log(result)
        res.json(result)
    } catch(error){
        res.status(500)
        res.send(error.message)
    }
}

const addCoche = async (req, res) => {
    try {
        console.log("entro al post");
        const { modelo, descripcion, precio, marcaId} = req.body;
        const imagenBlob = req.file ? fs.readFileSync(req.file.path) : null;

        if (modelo === undefined || descripcion === undefined || precio === undefined || marcaId === undefined) {
            return res.status(400).json({ message: "Respuesta incorrecta, completa los campos necesarios" });
        }

        const coche = { modelo, descripcion, precio, marca_id: marcaId, imagen_blob: imagenBlob };
        const connection = await getConnection();

        // Ajusta la consulta SQL para tu tabla
        const result = await connection.query(
            "INSERT INTO coche (modelo, descripcion, precio, marca_id, imagen_blob) VALUES (?, ?, ?, ?, ?)",
            [coche.modelo, coche.descripcion, coche.precio, coche.marca_id, coche.imagen_blob]
        );
        

        // Obtiene el ID del último coche insertado
        const lastInsertId = result.insertId;

        res.json({ message: "Coche agregado con éxito", lastInsertId });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};





const deleteCoche= async (req, res) => {
    try{
        const { id } = req.params
        const conecction = await getConnection();
        const result = await conecction.query("DELETE FROM coche WHERE ID = ?", id)
        console.log(result)
        res.json(result)
    } catch(error){
        res.status(500)
        res.send(error.message)
    }
}

const updateCoche = async (req, res) => {
    try {
        const { modelo, descripcion, precio, marcaId } = req.body;
        const { id } = req.params;

        // Verifica que al menos uno de los campos a actualizar esté presente
        if (modelo === undefined && descripcion === undefined && precio === undefined && marcaId === undefined && !req.file) {
            return res.status(400).json({ message: "Ningún campo para actualizar proporcionado" });
        }

        // Construye el objeto con los campos a actualizar
        const coche = {};
        if (modelo !== undefined) coche.modelo = modelo;
        if (descripcion !== undefined) coche.descripcion = descripcion;
        if (precio !== undefined) coche.precio = precio;
        if (marcaId !== undefined) coche.marca_id = marcaId;

        // Actualiza la imagen solo si se proporciona una nueva
        if (req.file) {
            coche.imagen_blob = fs.readFileSync(req.file.path); // Lee el nuevo blob de imagen
        }

        const connection = await getConnection();

        const result = await connection.query("UPDATE coche SET ? WHERE id = ?", [coche, id]);
        console.log("Coche actualizado correctamente");
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};






const getCochesSorted = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(
            "SELECT coche.id, marca.nombre AS 'Marca', coche.modelo, coche.descripcion, coche.precio, coche.imagen " +
            "FROM coche " +
            "JOIN marca ON coche.marca_id = marca.id " +
            "ORDER BY coche.precio DESC"
        );

        console.log(result);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


function saveImage(file){
    const newPath = `./static/img/${file.originalname}`
    fs.renameSync(file.path, newPath)
    return newPath
      
}

// Ruta para manejar la subida de archivos
 const uploadCocheImage = async (req, res, next) => {
    try {
        upload.single('ImagenBlob')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: "Error al subir la imagen" });
            } else if (err) {
                return res.status(500).json({ message: "Error al procesar la solicitud" });
            }
            next();
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

export const methods = {
    getCoches,
    getCoche,
    addCoche,
    deleteCoche,
    updateCoche,
    getCochesSorted,
    uploadCocheImage
}
