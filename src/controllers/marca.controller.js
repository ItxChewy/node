import { getConnection } from './../database/database';

const getCochesMarca = async (req, res) => {
    try {
        const { nombre } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT coche.id, marca.nombre AS 'Marca', coche.modelo, coche.descripcion, coche.precio FROM coche, marca WHERE coche.marca_id = marca.id AND marca.nombre = ?", nombre);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500)
        res.send(error.message);
    }
}

export const methods = {
    getCochesMarca,
}
