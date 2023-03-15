import https from 'https';
import crypto from 'crypto';
import { Upload } from '@aws-sdk/lib-storage';
import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';

import type { IncomingMessage } from 'http';
import type { KeystoneContext } from '@keystone-6/core/types';
import type {
  Context,
  ProductCreateInput,
  VariantCreateInput,
  ProductUpdateInput
} from '.keystone/types';

type Product = ProductCreateInput & { variants?: VariantCreateInput[] };

type Writable<T> = { -readonly [P in keyof T]: T[P] };

dotenv.config();

const { S3_IMAGES_BUCKET, PUBLIC_ASSETS_PATH, SENTRY_DSN } = process.env;

Sentry.init({
  dsn: SENTRY_DSN,
  maxBreadcrumbs: 5,
  beforeSend(event) {
    if (event.user) {
      delete event.user;
    }
    return event;
  }
});

const s3Client = new S3Client({});
const s3BaseParams = {
  Bucket: S3_IMAGES_BUCKET
};

const supportedTypeToExtensions: Record<string, string> = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/avif': 'avif',
  'image/webp': 'webp'
};

export async function findAndDownloadImages(resolvedData: Record<string, any>) {
  try {
    let stringifiedData = JSON.stringify(resolvedData);

    // Examples:
    //   https://files.cdn.printful.com/files/0b3/0b3a4a50151be1b727994fc630a4ab3b_thumb.png
    //   https://files.cdn.printful.com/files/0b3/0b3a4a50151be1b727994fc630a4ab3b_preview.png
    // https://files.cdn.printful.com/upload/product-measure/a6/a6bcb657bdf3349daad0b2691f797a45_t?v=1652962719
    const images = stringifiedData.matchAll(
      /https:\/\/files\.cdn\.printful\.com\/(?:files|upload)\/[-a-zA-Z0-9_./]+(?:\?[^\s"]*)?/g
    );

    for (let [imageUrl] of images) {
      try {
        const sanitizedUrl = new URL(imageUrl).href;
        const newImageUrl = await downloadImageIfNeeded(sanitizedUrl);
        if (newImageUrl) {
          stringifiedData = stringifiedData.replaceAll(imageUrl, newImageUrl);
        } else {
          // Remove references to images which couldn't be downloaded
          stringifiedData = stringifiedData.replaceAll(imageUrl, '');
          Sentry.captureMessage(`Could not download image: ${sanitizedUrl}`, 'error');
        }
      } catch (e) {
        console.log(e);
      }
    }

    return JSON.parse(stringifiedData);
  } catch (e: any) {
    console.log('Error', e.message);
  }
}

async function downloadImageIfNeeded(imageUrl: string) {
  try {
    const existingImage = await getImagePathIfExists(imageUrl);
    const imagePath = existingImage || (await downloadImage(imageUrl));

    if (!imagePath) return;

    return `${PUBLIC_ASSETS_PATH}/${imagePath}`;
  } catch (e: any) {
    console.log('Error', e.message);
  }
}

async function downloadImage(imageUrl: string) {
  try {
    console.log('Downloading image... \n' + imageUrl);
    const imageHash = getHash(imageUrl);
    const imageStream = await createRemoteStream(imageUrl);

    // Don't save images whose content-type is not included in supported list
    if (
      !imageStream.headers['content-type'] ||
      !Object.keys(supportedTypeToExtensions).includes(imageStream.headers['content-type'])
    ) {
      return;
    }

    const imagePath: string = `${imageHash}.${
      supportedTypeToExtensions[imageStream.headers['content-type']]
    }`;

    console.log('Saving image as... \n' + imagePath);

    const params = {
      ...s3BaseParams,
      Key: imagePath,
      Body: imageStream,
      ContentType: imageStream.headers['content-type']
    };

    const parallelUploads3 = new Upload({
      client: s3Client,
      params
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });

    await parallelUploads3.done();

    return imagePath;
  } catch (e: any) {
    console.log('Error', e.message);
  }
}

function createRemoteStream(url: string): Promise<IncomingMessage> {
  return new Promise(function (resolve, reject) {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          res.destroy(new Error(`Server responded with ${res.statusCode} status.`));
        }

        if (!res.destroyed) {
          resolve(res);
        }
      })
      .on('error', (e) => {
        const newError = {
          ...e,
          message: `Couldn't download image ${url}. Reason: ${e.message}`
        };
        reject(newError);
      });
  });
}

async function getImagePathIfExists(imageUrl: string): Promise<string | boolean | undefined> {
  try {
    const imageHash = getHash(imageUrl);
    const fileMatches = await s3Client.send(
      new ListObjectsCommand({
        ...s3BaseParams,
        Prefix: imageHash
      })
    );

    if (fileMatches.Contents && Array.isArray(fileMatches.Contents)) {
      return fileMatches.Contents[0].Key;
    } else {
      return false;
    }
  } catch (e: any) {
    console.log('Error', e.message);
    return false;
  }
}

function getHash(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

const { PRINTFUL_BASE_URL, PRINTFUL_STORE_ID, PRINTFUL_API_TOKEN } = process.env;
export async function printfulApi(resourcePath: string, options?: RequestInit) {
  const url = `${PRINTFUL_BASE_URL}${resourcePath}`;
  console.log(`Calling... ${url}`);

  let response = await fetch(url, {
    ...options,
    headers: {
      'X-PF-Store-Id': PRINTFUL_STORE_ID,
      Authorization: `Bearer ${PRINTFUL_API_TOKEN}`
    } as HeadersInit
  });

  const responseBody = await response.json();
  return responseBody.result;
}

export const sleep = (seconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

export function upsertProduct(
  newProductData: Product,
  existingProductData: Product,
  context: Context
): Promise<Record<string, any>> | Record<string, any> {
  if (!existingProductData) {
    let createProductData: ProductCreateInput = newProductData;
    if (newProductData.variants?.length) {
      createProductData = {
        ...createProductData,
        variants: {
          create: newProductData.variants
        }
      };
    }
    return context.db.Product.createOne({
      data: createProductData
    });
  } else {
    type WritableProductUpdateInput = Writable<ProductUpdateInput> & {
      variants?: {
        create: VariantCreateInput[];
      };
    };
    const updatedProductData: WritableProductUpdateInput = {};

    if (existingProductData.name !== newProductData.name) {
      updatedProductData.name = newProductData.name;
    }

    if (!existingProductData.description) {
      updatedProductData.description = newProductData.description;
    }

    if (!existingProductData.thumbnail) {
      updatedProductData.thumbnail = newProductData.thumbnail;
    }

    if (
      newProductData.filters &&
      JSON.stringify(existingProductData.filters) !== JSON.stringify(newProductData.filters)
    ) {
      updatedProductData.filters = newProductData.filters;
    }

    // Look for new variants
    newProductData?.variants?.forEach((variant) => {
      if (
        !existingProductData?.variants?.some(
          (v) => v.printfulVariantId === variant.printfulVariantId
        )
      ) {
        if (!updatedProductData.variants) updatedProductData.variants = { create: [] };
        updatedProductData.variants.create = [...updatedProductData.variants.create, variant];
      }
    });

    // Don't run an update if nothing has changed
    if (Object.keys(updatedProductData).length === 0) {
      return existingProductData;
    }

    return context.db.Product.updateOne({
      where: {
        printfulProductId: existingProductData.printfulProductId
      },
      data: updatedProductData
    });
  }
}

export const getDateFromXDaysAgo = (daysAgo: number): Date => {
  const currDate = new Date();
  const pastDate = new Date();
  pastDate.setDate(currDate.getDate() - daysAgo);
  return pastDate;
};

export const purgeOldShippingDataKeys = async (context: KeystoneContext) => {
  try {
    const date7DaysAgo = getDateFromXDaysAgo(7);

    await context.prisma.ShippingDataKey.deleteMany({
      where: { createdAt: { lte: date7DaysAgo } }
    });
  } catch (e) {
    console.log(e);
    Sentry.captureMessage(`Could not purge old shipping data keys.`, 'error');
  }
};
