## Modelo de Datos

### Producto

| Campo        | Tipo    | Descripción                                         |
|--------------|---------|-----------------------------------------------------|
| `id`         | string  | Identificador único del producto (clave primaria)   |
| `nombre`     | string  | Nombre del producto                                  |
| `descripcion`| string  | Descripción del producto                             |
| `precio`     | number  | Precio unitario                                     |
| `stock`      | number  | Cantidad disponible en inventario                   |
| `imagenUrl`  | string  | URL de la imagen del producto (opcional)            |

---

### Compra

| Campo              | Tipo    | Descripción                                                |
|--------------------|---------|------------------------------------------------------------|
| `id`               | string  | Identificador único de la compra (clave primaria)          |
| `productoId`       | string  | ID del producto comprado (clave foránea)                   |
| `cantidad`         | number  | Cantidad del producto comprado                              |
| `nombreCliente`    | string  | Nombre del cliente                                          |
| `direccion`        | string  | Dirección de entrega                                        |
| `estado`           | string  | Estado de la compra (`PENDIENTE`, `EXITOSA`, `FALLIDA`)    |
| `total`            | number  | Total a pagar (producto + tarifas)                          |
| `fechaCreacion`    | string  | Fecha y hora de creación                                    |
| `fechaActualizacion`| string | Fecha y hora de la última actualización                     |
