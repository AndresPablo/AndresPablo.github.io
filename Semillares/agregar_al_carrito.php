<?php
    // Iniciar sesión
    session_start();

    // Verificar si se pasa el parámetro 'id' en la URL
    if (isset($_GET['id'])) {
        // Obtener el ID del producto
        $id_producto = $_GET['id'];
        
        // Realizar una consulta para obtener los detalles del producto desde la base de datos
        // Supongamos que obtienes los detalles del producto y los almacenas en un array $producto
        
        // Agregar el producto al carrito
        if (!isset($_SESSION['carrito'])) {
            $_SESSION['carrito'] = array();
        }
        
        // Comprobar si el producto ya está en el carrito
        $producto_existente = false;
        foreach ($_SESSION['carrito'] as &$item) {
            if ($item['id'] == $id_producto) {
                $item['cantidad']++;
                $item['subtotal'] = $item['cantidad'] * $item['precio'];
                $producto_existente = true;
                break;
            }
        }
        
        if (!$producto_existente) {
            $producto['cantidad'] = 1;
            $producto['subtotal'] = $producto['precio'];
            $_SESSION['carrito'][] = $producto;
        }
        
        // Redirigir de vuelta a la página de la tienda
        header('Location: tienda.php');
    } else {
        // Si no se proporciona un ID válido, redirigir a la página principal
        header('Location: index.html');
    }
?>
