

// Funciones relacionadas con Mercado Pago
function initializeMercadoPago(publicKey, preferenceId) {
    const mp = new MercadoPago(publicKey, {
        locale: 'es-AR'
    });

    mp.checkout({
        preference: {
            id: preferenceId
        },
        render: {
            container: '.cho-container',
            label: 'Pagar con MP',
        }
    });
}