import { clsx } from "@resolid/react-ui";
import { __DEV__ } from "@resolid/utils";
import { type HTMLProps, useEffect, useRef } from "react";

export type BlurhashCanvasProps = {
  hash: string;
  width: number;
  height: number;
  punch?: number;
  aspect?: number;
};

export const BlurhashCanvas = (props: HTMLProps<HTMLCanvasElement> & BlurhashCanvasProps) => {
  const { hash, width, height, punch, aspect = 1, className, ...rest } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const pixels = decodeBlurHash(hash, width, height, punch);
      const ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        ctx.putImageData(new ImageData(pixels, width, height), 0, 0);
      }
    }
  }, [hash, height, punch, width]);

  return (
    <div style={{ paddingBottom: `${aspect * 100}%` }} className={"relative h-0"}>
      <canvas
        width={width}
        height={height}
        className={clsx("absolute inset-0 h-full w-full", className)}
        ref={canvasRef}
        {...rest}
      />
    </div>
  );
};

if (__DEV__) {
  BlurhashCanvas.displayName = "BlurhashCanvas";
}

// From https://github.com/mad-gooze/fast-blurhash/blob/main/index.js

const digit = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~";
const decode83 = (str: string, start: number, end: number) => {
  let value = 0;
  while (start < end) {
    value *= 83;
    // biome-ignore lint/style/noParameterAssign: <explanation>
    value += digit.indexOf(str[start++]);
  }
  return value;
};

const pow = Math.pow;
const PI = Math.PI;
const PI2 = PI * 2;

const d = 3294.6;
const e = 269.025;
const sRGBToLinear = (value: number) => (value > 10.31475 ? pow(value / e + 0.052132, 2.4) : value / d);

const linearTosRGB = (v: number) => ~~(v > 0.00001227 ? e * pow(v, 0.416666) - 13.025 : v * d + 1);

const signSqr = (x: number) => (x < 0 ? -1 : 1) * x * x;

const fastCos = (x: number) => {
  // biome-ignore lint/style/noParameterAssign: <explanation>
  x += PI / 2;
  while (x > PI) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    x -= PI2;
  }
  const cos = 1.27323954 * x - 0.405284735 * signSqr(x);
  return 0.225 * (signSqr(cos) - cos) + cos;
};

const getBlurHashAverageColor = (blurHash: string) => {
  const val = decode83(blurHash, 2, 6);
  return [val >> 16, (val >> 8) & 255, val & 255];
};

const decodeBlurHash = (blurHash: string, width: number, height: number, punch?: number) => {
  const sizeFlag = decode83(blurHash, 0, 1);
  const numX = (sizeFlag % 9) + 1;
  const numY = ~~(sizeFlag / 9) + 1;
  const size = numX * numY;

  let i: number;
  let j = 0;
  let x = 0;
  let y: number;
  let r = 0;
  let g = 0;
  let b = 0;
  let basis = 0;
  let basisY = 0;
  let colorIndex = 0;
  let pixelIndex = 0;
  let yh = 0;
  let xw = 0;
  let value = 0;

  const maximumValue = ((decode83(blurHash, 1, 2) + 1) / 13446) * (punch || 1);

  const colors = new Float64Array(size * 3);

  const averageColor = getBlurHashAverageColor(blurHash);
  for (i = 0; i < 3; i++) {
    colors[i] = sRGBToLinear(averageColor[i]);
  }

  for (i = 1; i < size; i++) {
    value = decode83(blurHash, 4 + i * 2, 6 + i * 2);
    colors[i * 3] = signSqr(~~(value / (19 * 19)) - 9) * maximumValue;
    colors[i * 3 + 1] = signSqr((~~(value / 19) % 19) - 9) * maximumValue;
    colors[i * 3 + 2] = signSqr((value % 19) - 9) * maximumValue;
  }

  const bytesPerRow = width * 4;
  const pixels = new Uint8ClampedArray(bytesPerRow * height);

  for (y = 0; y < height; y++) {
    yh = (PI * y) / height;
    for (x = 0; x < width; x++) {
      r = 0;
      g = 0;
      b = 0;
      xw = (PI * x) / width;

      for (j = 0; j < numY; j++) {
        basisY = fastCos(yh * j);
        for (i = 0; i < numX; i++) {
          basis = fastCos(xw * i) * basisY;
          colorIndex = (i + j * numX) * 3;
          r += colors[colorIndex] * basis;
          g += colors[colorIndex + 1] * basis;
          b += colors[colorIndex + 2] * basis;
        }
      }

      pixelIndex = 4 * x + y * bytesPerRow;
      pixels[pixelIndex] = linearTosRGB(r);
      pixels[pixelIndex + 1] = linearTosRGB(g);
      pixels[pixelIndex + 2] = linearTosRGB(b);
      pixels[pixelIndex + 3] = 255; // alpha
    }
  }
  return pixels;
};
