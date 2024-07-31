import fs from 'fs';
import path from 'path';

/**
 * This file replaces the OS-exclusive post-install instructions. E.g:
 * cp ./node_modules/axios/dist/axios.min.js ./static/static-assets/vendors/ &&
 * cp ./node_modules/axios/dist/axios.min.map ./static/static-assets/vendors/
 */

const files = [['./node_modules/@brave/leo/icons/', './static/nala-icons']];

for (let [source, destination] of files) {
  /**
   * If we don't explicitly include the destination filename, Windows
   * may not complete this step. A trailing / will be taken as a signal
   * that the source filename is to be preserved. When encountered, we
   * will extract the source filename, and add it to the destination.
   */
  if (destination.endsWith('/')) {
    const { base: filename } = path.parse(source);
    destination = path.join(destination, filename);
  }

  fs.cpSync(source, destination, { recursive: true });
  console.log(`Copied ${source} to ${destination}`);
}
