import {
	brotliCompress,
	brotliDecompress,
	constants as zlibConstants
} from "node:zlib";

export class Brotli {
	/**
	 * Compresses data with NodeJS's native zlib brotli integration.
	 * @param rawData the data that is to be compressed.
	 * @param level Brotli compression level, from 1-11. The higher the quality level, the higher the compression ratio. The higher the quality, the lower the speed.
	 */
	public static async compress(rawData: any, level?: number): Promise<any|null> {
		const rawDataBytes = Buffer.byteLength(rawData, 'utf8');
		return new Promise(async (resolve, reject) => {
			await brotliCompress(rawData, {
				chunkSize: 32 * 1024, // Compressed data is split into smaller units called "chunks" to allow for efficiency.
				params: {
					[zlibConstants.BROTLI_PARAM_MODE]: zlibConstants.BROTLI_MODE_TEXT,
					[zlibConstants.BROTLI_PARAM_QUALITY]: level || 11,
					[zlibConstants.BROTLI_PARAM_SIZE_HINT]: rawDataBytes // data size in bytes
				}
			}, async (err: Error|null, compressedData: Buffer) => {
				if (err) {
					console.log(err);
					reject(err)
				} else {
					resolve(compressedData);
				}
			});
		});
	}

	/**
	 * Decompresses data compressed by brotli with NodeJS's native zlib brotli integration.
	 * @param compressedData a string of compressed data.
	 */
	public static async decompress(compressedData: string): Promise<any|null> {
		brotliDecompress(compressedData, async (err: Error|null, data: Buffer) => {
			if (err) {
				console.log(err);
				throw err;
			} else {
				return data;
			}
		});
	}
}