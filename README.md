# Fresh Bloom

Tienda en Next.js para Fresh Bloom, una flower shop & studio con catálogo,
carrito, checkout, pagos con Mercado Pago, pedidos por WhatsApp y panel admin.

## Desarrollo

```bash
npm install
npm run dev
```

La tienda queda disponible en `http://localhost:3000`.

## Configuración

Copia `.env.example` a `.env.local` y completa las credenciales necesarias:

- `MERCADOPAGO_ACCESS_TOKEN`
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `BUSINESS_WHATSAPP_NUMBER`

Si no configuras WhatsApp Cloud API, los pedidos en efectivo abren una liga
`wa.me` con el resumen del pedido.

### Mercado Pago

El checkout usa Mercado Pago Bricks en `/checkout` y procesa pagos desde:

- `POST /api/mercadopago/payment`
- `POST /api/mercadopago/preference`
- `POST /api/mercadopago/webhook`

Configura en Mercado Pago el webhook público:

```txt
https://tu-dominio.com/api/mercadopago/webhook
```

Si activas firma de webhooks, guarda la clave en
`MERCADOPAGO_WEBHOOK_SECRET`.

### WhatsApp Cloud API

Para automatizar confirmaciones y promociones completa:

- `WHATSAPP_API_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_GRAPH_API_VERSION`
- `WHATSAPP_DEFAULT_COUNTRY_CODE`
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_CONFIRMATION_TEMPLATE_NAME`
- `WHATSAPP_PROMOTION_TEMPLATE_NAME`
- `WHATSAPP_PROMOTION_API_SECRET`

Configura en Meta el webhook:

```txt
https://tu-dominio.com/api/whatsapp/webhook
```

La confirmación de pago usa la plantilla
`WHATSAPP_CONFIRMATION_TEMPLATE_NAME` si existe; si no, intenta enviar texto
libre. La plantilla sugerida debe tener cuatro variables en el cuerpo:
`{{1}}` nombre, `{{2}}` pedido, `{{3}}` entrega y `{{4}}` total.

Las promociones se envían con:

```bash
curl -X POST https://tu-dominio.com/api/whatsapp/promotions \
  -H "Authorization: Bearer $WHATSAPP_PROMOTION_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"dryRun":true}'
```

Si no mandas `recipients`, toma contactos con consentimiento desde pedidos
guardados. Si mandas una lista manual, cada contacto debe incluir
`"marketingOptIn": true`.

## Rutas principales

- `/`: inicio Fresh Bloom
- `/productos`: catálogo de arreglos
- `/arma-tu-ramo`: ramo personalizado
- `/checkout`: cierre de pedido
- `/admin`: administración de pedidos
