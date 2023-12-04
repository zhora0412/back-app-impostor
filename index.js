import express from 'express';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Health check')
})

app.use(cors());

app.post('/sizes', express.urlencoded({ extended: true }), async (req, res) => {
  const { customer_id, metric_system } = req.body;

  const sizes = {};

  for (const key in req.body) {
    if (key !== 'customer_id' && key !== 'metric_system') {
      sizes[key] = req.body[key];
    }
  }

  const newMetafield = await fetch(`https://${process.env.SHOP_DOMAIN}/admin/api/2023-07/customers/${customer_id}/metafields.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
    },
    body: JSON.stringify({
      metafield: {
        "namespace": 'sizes',
        "key": 'sizes',
        "value": JSON.stringify({ ...sizes, metric_system }),
        "type": 'json',
      },
    }),
  })

  res.send(await newMetafield.json());
})


app.listen(process.env.PORT, () => console.log('Server started'));