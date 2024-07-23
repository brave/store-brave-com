import { HttpResponse, graphql, http } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

const variants = [
  {
    "id": "clwsmtxpp0000zo6dwkmvu76n",
    "permalink": "/p/brave-or-bat-desk-mat/3826891072/",
    "printfulVariantId": "3826891072",
    "details": {
      "sku": "6423546D0953F",
      "name": "Brave | BAT Desk Mat",
      "size": "36″×18″",
      "color": "White",
      "files": [
        {
          "id": 520874690,
          "dpi": 150,
          "url": null,
          "hash": "d49babebf2b1a8bb31a4a1a910a9061c",
          "size": 1760231,
          "type": "default",
          "width": 5475,
          "height": 2775,
          "status": "ok",
          "created": 1674687476,
          "message": "",
          "visible": false,
          "filename": "c85c0c9a37771391872b93be020f9090.png",
          "mime_type": "image/png",
          "preview_url": "https://files.cdn.printful.com/printfile-preview/520874690/c85c0c9a37771391872b93be020f9090_preview.png",
          "is_temporary": false,
          "thumbnail_url": "https://files.cdn.printful.com/printfile-preview/520874690/c85c0c9a37771391872b93be020f9090_thumb.png",
          "stitch_count_tier": null
        },
        {
          "id": 543640632,
          "dpi": null,
          "url": null,
          "hash": "9676a415de7f4d99b3da15c7e793dfb3",
          "size": 1278851,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1680036973,
          "message": "",
          "visible": false,
          "filename": "gaming-mouse-pad-white-36x18-front-6423545198904.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/6944e95453a447ed8bd4ba69524eb76bb0b6b924db88ab0726b169affe0ac743.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/b2847030ab3d174e3788ebf17ebc9e90ef26db4bbba6730b91039912666d078a.png",
          "stitch_count_tier": null
        }
      ],
      "price": "35.00",
      "currency": "USD",
      "baseVariantId": 14942
    }
  },
  {
    "id": "clwsmtxrf0001zo6d16zslllr",
    "permalink": "/p/brave-lion-fleece-zip-up-hoodie/3576357948/",
    "printfulVariantId": "3576357948",
    "details": {
      "sku": "6362B530884B2_M",
      "name": "Brave Lion Fleece Zip Up Hoodie / M",
      "size": "M",
      "color": "Black",
      "files": [
        {
          "id": 485409414,
          "dpi": 150,
          "url": null,
          "hash": "404145946b98d56ca5bf3535ed81075e",
          "size": 55977,
          "type": "default",
          "width": 1950,
          "height": 1950,
          "status": "ok",
          "created": 1667413287,
          "message": "",
          "visible": false,
          "filename": "1d41ab4cafd830775870703e4edd5467.png",
          "mime_type": "image/png",
          "preview_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_preview.png",
          "is_temporary": false,
          "thumbnail_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_thumb.png",
          "stitch_count_tier": null
        },
        {
          "id": 485409466,
          "dpi": null,
          "url": null,
          "hash": "0a329697e2e9154d5ea1554c22ff0d25",
          "size": 317624,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1667413296,
          "message": "",
          "visible": false,
          "filename": "unisex-fleece-zip-up-hoodie-black-front-6362b5278e431.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/a313f33c9885df83495dd9abe266e254f9ef62cbafba4801f4d2fec0c12e8874.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/a996ac2653c1f945483cb2bdabb72e232de591b913148aa708107d4ac9d44053.png",
          "stitch_count_tier": null
        }
      ],
      "price": "45.95",
      "currency": "USD",
      "baseVariantId": 15039
    }
  },
  {
    "id": "clwsmtxri0002zo6d7yk4lc2t",
    "permalink": "/p/brave-lion-fleece-zip-up-hoodie/3576357949/",
    "printfulVariantId": "3576357949",
    "details": {
      "sku": "6362B530884B2_L",
      "name": "Brave Lion Fleece Zip Up Hoodie / L",
      "size": "L",
      "color": "Black",
      "files": [
        {
          "id": 485409414,
          "dpi": 150,
          "url": null,
          "hash": "404145946b98d56ca5bf3535ed81075e",
          "size": 55977,
          "type": "default",
          "width": 1950,
          "height": 1950,
          "status": "ok",
          "created": 1667413287,
          "message": "",
          "visible": false,
          "filename": "1d41ab4cafd830775870703e4edd5467.png",
          "mime_type": "image/png",
          "preview_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_preview.png",
          "is_temporary": false,
          "thumbnail_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_thumb.png",
          "stitch_count_tier": null
        },
        {
          "id": 485409466,
          "dpi": null,
          "url": null,
          "hash": "0a329697e2e9154d5ea1554c22ff0d25",
          "size": 317624,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1667413296,
          "message": "",
          "visible": false,
          "filename": "unisex-fleece-zip-up-hoodie-black-front-6362b5278e431.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/a313f33c9885df83495dd9abe266e254f9ef62cbafba4801f4d2fec0c12e8874.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/a996ac2653c1f945483cb2bdabb72e232de591b913148aa708107d4ac9d44053.png",
          "stitch_count_tier": null
        }
      ],
      "price": "45.95",
      "currency": "USD",
      "baseVariantId": 15040
    }
  },
  {
    "id": "clwsmtxri0003zo6dm22uev2m",
    "permalink": "/p/brave-lion-fleece-zip-up-hoodie/3576357947/",
    "printfulVariantId": "3576357947",
    "details": {
      "sku": "6362B530884B2_S",
      "name": "Brave Lion Fleece Zip Up Hoodie / S",
      "size": "S",
      "color": "Black",
      "files": [
        {
          "id": 485409414,
          "dpi": 150,
          "url": null,
          "hash": "404145946b98d56ca5bf3535ed81075e",
          "size": 55977,
          "type": "default",
          "width": 1950,
          "height": 1950,
          "status": "ok",
          "created": 1667413287,
          "message": "",
          "visible": false,
          "filename": "1d41ab4cafd830775870703e4edd5467.png",
          "mime_type": "image/png",
          "preview_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_preview.png",
          "is_temporary": false,
          "thumbnail_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_thumb.png",
          "stitch_count_tier": null
        },
        {
          "id": 485409466,
          "dpi": null,
          "url": null,
          "hash": "0a329697e2e9154d5ea1554c22ff0d25",
          "size": 317624,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1667413296,
          "message": "",
          "visible": false,
          "filename": "unisex-fleece-zip-up-hoodie-black-front-6362b5278e431.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/a313f33c9885df83495dd9abe266e254f9ef62cbafba4801f4d2fec0c12e8874.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/a996ac2653c1f945483cb2bdabb72e232de591b913148aa708107d4ac9d44053.png",
          "stitch_count_tier": null
        }
      ],
      "price": "45.95",
      "currency": "USD",
      "baseVariantId": 15038
    }
  },
  {
    "id": "clwsmtxrj0004zo6dsqvo4b7t",
    "permalink": "/p/brave-lion-fleece-zip-up-hoodie/3576357951/",
    "printfulVariantId": "3576357951",
    "details": {
      "sku": "6362B530884B2_2XL",
      "name": "Brave Lion Fleece Zip Up Hoodie / 2XL",
      "size": "2XL",
      "color": "Black",
      "files": [
        {
          "id": 485409414,
          "dpi": 150,
          "url": null,
          "hash": "404145946b98d56ca5bf3535ed81075e",
          "size": 55977,
          "type": "default",
          "width": 1950,
          "height": 1950,
          "status": "ok",
          "created": 1667413287,
          "message": "",
          "visible": false,
          "filename": "1d41ab4cafd830775870703e4edd5467.png",
          "mime_type": "image/png",
          "preview_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_preview.png",
          "is_temporary": false,
          "thumbnail_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_thumb.png",
          "stitch_count_tier": null
        },
        {
          "id": 485409466,
          "dpi": null,
          "url": null,
          "hash": "0a329697e2e9154d5ea1554c22ff0d25",
          "size": 317624,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1667413296,
          "message": "",
          "visible": false,
          "filename": "unisex-fleece-zip-up-hoodie-black-front-6362b5278e431.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/a313f33c9885df83495dd9abe266e254f9ef62cbafba4801f4d2fec0c12e8874.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/a996ac2653c1f945483cb2bdabb72e232de591b913148aa708107d4ac9d44053.png",
          "stitch_count_tier": null
        }
      ],
      "price": "45.95",
      "currency": "USD",
      "baseVariantId": 15042
    }
  },
  {
    "id": "clwsmtxrn0005zo6dag5h6o3o",
    "permalink": "/p/brave-lion-fleece-zip-up-hoodie/3576357950/",
    "printfulVariantId": "3576357950",
    "details": {
      "sku": "6362B530884B2_XL",
      "name": "Brave Lion Fleece Zip Up Hoodie / XL",
      "size": "XL",
      "color": "Black",
      "files": [
        {
          "id": 485409414,
          "dpi": 150,
          "url": null,
          "hash": "404145946b98d56ca5bf3535ed81075e",
          "size": 55977,
          "type": "default",
          "width": 1950,
          "height": 1950,
          "status": "ok",
          "created": 1667413287,
          "message": "",
          "visible": false,
          "filename": "1d41ab4cafd830775870703e4edd5467.png",
          "mime_type": "image/png",
          "preview_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_preview.png",
          "is_temporary": false,
          "thumbnail_url": "https://files.cdn.printful.com/printfile-preview/485409414/1d41ab4cafd830775870703e4edd5467_thumb.png",
          "stitch_count_tier": null
        },
        {
          "id": 485409466,
          "dpi": null,
          "url": null,
          "hash": "0a329697e2e9154d5ea1554c22ff0d25",
          "size": 317624,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1667413296,
          "message": "",
          "visible": false,
          "filename": "unisex-fleece-zip-up-hoodie-black-front-6362b5278e431.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/a313f33c9885df83495dd9abe266e254f9ef62cbafba4801f4d2fec0c12e8874.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/a996ac2653c1f945483cb2bdabb72e232de591b913148aa708107d4ac9d44053.png",
          "stitch_count_tier": null
        }
      ],
      "price": "45.95",
      "currency": "USD",
      "baseVariantId": 15041
    }
  },
  {
    "id": "clwsmtxsm0006zo6dzi11izxo",
    "permalink": "/p/brave-or-bat-laptop-sleeve/3576355154/",
    "printfulVariantId": "3576355154",
    "details": {
      "sku": "6362B48CDEE26_13″",
      "name": "Brave | BAT Laptop Sleeve / 13″",
      "size": "13″",
      "color": null,
      "files": [
        {
          "id": 485408186,
          "dpi": 150,
          "url": null,
          "hash": "90015b8850a2822e2d17ab83e348f5df",
          "size": 709454,
          "type": "default",
          "width": 2250,
          "height": 1725,
          "status": "ok",
          "created": 1667413125,
          "message": "",
          "visible": false,
          "filename": "31fcef52f43d2a52569b7077b96803a3.png",
          "mime_type": "image/png",
          "preview_url": "https://files.cdn.printful.com/printfile-preview/485408186/31fcef52f43d2a52569b7077b96803a3_preview.png",
          "is_temporary": false,
          "thumbnail_url": "https://files.cdn.printful.com/printfile-preview/485408186/31fcef52f43d2a52569b7077b96803a3_thumb.png",
          "stitch_count_tier": null
        },
        {
          "id": 485408247,
          "dpi": null,
          "url": null,
          "hash": "e0f380e7d2dd92469f179087cc57d721",
          "size": 1395095,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1667413132,
          "message": "",
          "visible": false,
          "filename": "laptop-sleeve-13-front-6362b487b01b6.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/3027cce403d25418e6509687008855d34e526cc4696368c6866780db629d0cfe.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/3c4ab079f7b02a02d2bf525f2f8e465c76d2fd96e35b8f31ba04170d7074d58b.png",
          "stitch_count_tier": null
        }
      ],
      "price": "29.95",
      "currency": "USD",
      "baseVariantId": 10984
    }
  },
  {
    "id": "clwsmtxt10007zo6d1jwylqkl",
    "permalink": "/p/brave-or-bat-laptop-sleeve/3576355155/",
    "printfulVariantId": "3576355155",
    "details": {
      "sku": "6362B48CDEE26_15″",
      "name": "Brave | BAT Laptop Sleeve / 15″",
      "size": "15″",
      "color": null,
      "files": [
        {
          "id": 485408197,
          "dpi": 150,
          "url": null,
          "hash": "721146323b4392e23bdedb048c869089",
          "size": 748594,
          "type": "default",
          "width": 2325,
          "height": 1800,
          "status": "ok",
          "created": 1667413127,
          "message": "",
          "visible": false,
          "filename": "8725dde8635ca0fd1fad06773273b77b.png",
          "mime_type": "image/png",
          "preview_url": "https://files.cdn.printful.com/printfile-preview/485408197/8725dde8635ca0fd1fad06773273b77b_preview.png",
          "is_temporary": false,
          "thumbnail_url": "https://files.cdn.printful.com/printfile-preview/485408197/8725dde8635ca0fd1fad06773273b77b_thumb.png",
          "stitch_count_tier": null
        },
        {
          "id": 485408248,
          "dpi": null,
          "url": null,
          "hash": "988721b17079314e6f60883cf7afe711",
          "size": 1383513,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1667413132,
          "message": "",
          "visible": false,
          "filename": "laptop-sleeve-15-front-6362b487b834a.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/23a3705b33cc5a799b33033ea29211e36897633786dbadc3664f18ef5c402981.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/1dcad8507294951cc7cdada8c7d553bae80d3b6dc8670347e25547a341bfb75c.png",
          "stitch_count_tier": null
        }
      ],
      "price": "29.95",
      "currency": "USD",
      "baseVariantId": 10985
    }
  },
  {
    "id": "clwsmtye0000azo6dim8qunp8",
    "permalink": "/p/bravey-baby-onesie/3855635400/",
    "printfulVariantId": "3855635400",
    "details": {
      "sku": "64408D189F2CA_Black-18-24m",
      "name": "Bravey Baby Onesie / Black / 18-24m",
      "size": "18-24m",
      "color": "Black",
      "files": [
        {
          "id": 551970163,
          "dpi": 600,
          "url": null,
          "hash": "8c0d15c5d44acd4a2c65e0c6a2a46abc",
          "size": 292154,
          "type": "default",
          "width": 3776,
          "height": 3102,
          "status": "ok",
          "created": 1681952300,
          "message": "",
          "visible": true,
          "filename": "Asset-2.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/645d0d874d922034ab34d5e0848388354cc1191afae72b124188d3504bf460bf.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/193b16eaa996d2b5c341d209c16a30635a7a65eabcdcd254b6de61ebea45febc.png",
          "stitch_count_tier": null
        },
        {
          "id": 551970568,
          "dpi": null,
          "url": null,
          "hash": "21fc8f7e4d6b32e8f63311edd982c57e",
          "size": 325747,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1681952406,
          "message": "",
          "visible": false,
          "filename": "baby-short-sleeve-one-piece-black-front-64408e94edd92.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/b07f9868b39d55b274fedd0f8a9c2fde2a6fa47f555990a67203ae86da03685f.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/e7db0118df20c58f4cc4b0655cba4094b11d1499479f9729d366235da2fb347d.png",
          "stitch_count_tier": null
        }
      ],
      "price": "24.75",
      "currency": "USD",
      "baseVariantId": 9449
    }
  },
  {
    "id": "clwsmtye1000bzo6d71yle6h0",
    "permalink": "/p/bravey-baby-onesie/3855635402/",
    "printfulVariantId": "3855635402",
    "details": {
      "sku": "64408D189F2CA_White-6-12m",
      "name": "Bravey Baby Onesie / White / 6-12m",
      "size": "6-12m",
      "color": "White",
      "files": [
        {
          "id": 551967209,
          "dpi": 600,
          "url": null,
          "hash": "089fd147b58923c2c5e45ce027878849",
          "size": 190693,
          "type": "default",
          "width": 3776,
          "height": 3102,
          "status": "ok",
          "created": 1681951733,
          "message": "",
          "visible": true,
          "filename": "Asset-1.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/27596063111ab4bc364012761d2610b1b3458dd0e595273d1525cf035d761c8e.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/1660922568c7431139fed85c77700d06e8a7723d7437068544a2b124778e9390.png",
          "stitch_count_tier": null
        },
        {
          "id": 551970741,
          "dpi": null,
          "url": null,
          "hash": "0f4c267cc6c6519fb941dfdaf1b7f9a3",
          "size": 259175,
          "type": "preview",
          "width": 1000,
          "height": 1000,
          "status": "ok",
          "created": 1681952447,
          "message": "",
          "visible": false,
          "filename": "baby-short-sleeve-one-piece-white-front-64408ebec54d0.png",
          "mime_type": "image/png",
          "preview_url": "https://cdn.store.bravesoftware.com/a2664c45c135c77fa89b8c2ca990f96b1c71faed6917ee85f75fc10e5ab808e3.png",
          "is_temporary": false,
          "thumbnail_url": "https://cdn.store.bravesoftware.com/1fcdb4bb29b0cfa22357a19715eca7122e6fffd735c905b560fd6501192a97b9.png",
          "stitch_count_tier": null
        }
      ],
      "price": "24.75",
      "currency": "USD",
      "baseVariantId": 9439
    }
  }
];

const restHandlers = [
  http.post('https://api.printful.com/shipping/rates', () => {
    return HttpResponse.json({
      result: [
        {
          id: 'STANDARD',
          name: 'Flat Rate (Estimated delivery: Jul 24–29) ',
          rate: '3.99',
          currency: 'USD',
          minDeliveryDays: 4,
          maxDeliveryDays: 7,
          minDeliveryDate: '2024-07-24',
          maxDeliveryDate: '2024-07-29'
        }
      ]
    });
  })
];

const graphqlHandlers = [
  graphql.mutation('AddShippingDataKey', () => {
    return HttpResponse.json({
      data: {
        createShippingDataKey: {
          id: 'clyq7rf3w0002kflo457thc12'
        }
      }
    });
  }),
  graphql.query('Variants', () => {
    return HttpResponse.json({
      data: {
        variants
      }
    });
  })
];

const server = setupServer(...restHandlers, ...graphqlHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
