// Generates brand assets (logo PNGs, favicons, Open Graph image) from the
// logo master. The master JPEG has a fake "transparency" checkerboard baked
// in, so we key it out: the checkerboard is neutral gray, while the logo is
// either saturated (the WSS mark) or near-white (wordmark and divider).
//
// Usage: npm run assets:generate
import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const SOURCE = 'old-logo-remastered.jpg'
const OUT = 'public/brand'
const BG = '#080B12'

await mkdir(OUT, { recursive: true })

/** Removes the baked-in checkerboard and returns a straight-alpha RGBA buffer. */
async function extractLogo(source) {
  const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const pixels = width * height

  // 1. Classify obvious background pixels (neutral mid-gray) and estimate the
  //    local checkerboard tone with a normalized box blur, so anti-aliased
  //    edges can be un-mixed against the right gray.
  const bgSum = new Float64Array(pixels)
  const bgCount = new Float64Array(pixels)
  for (let i = 0; i < pixels; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]
    const sat = Math.max(r, g, b) - Math.min(r, g, b)
    const lum = (r + g + b) / 3
    if (sat < 14 && lum > 70 && lum < 145) {
      bgSum[i] = lum
      bgCount[i] = 1
    }
  }
  const radius = 8
  const blur = (src) => {
    const tmp = new Float64Array(pixels)
    const dst = new Float64Array(pixels)
    for (let y = 0; y < height; y++) {
      let acc = 0
      for (let x = -radius; x < width + radius; x++) {
        if (x + radius < width) acc += src[y * width + x + radius] ?? 0
        if (x - radius - 1 >= 0) acc -= src[y * width + x - radius - 1]
        if (x >= 0 && x < width) tmp[y * width + x] = acc
      }
    }
    for (let x = 0; x < width; x++) {
      let acc = 0
      for (let y = -radius; y < height + radius; y++) {
        if (y + radius < height) acc += tmp[(y + radius) * width + x]
        if (y - radius - 1 >= 0) acc -= tmp[(y - radius - 1) * width + x]
        if (y >= 0 && y < height) dst[y * width + x] = acc
      }
    }
    return dst
  }
  const sumBlur = blur(bgSum)
  const countBlur = blur(bgCount)

  // 2. Compute alpha per pixel and un-mix the color from the local gray.
  const out = Buffer.alloc(pixels * 4)
  for (let i = 0; i < pixels; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]
    const bg = countBlur[i] > 0 ? sumBlur[i] / countBlur[i] : 110
    const sat = Math.max(r, g, b) - Math.min(r, g, b)
    const lum = (r + g + b) / 3

    const clamp01 = v => Math.min(1, Math.max(0, v))
    const whiteAlpha = clamp01((lum - Math.max(bg + 20, 150)) / 90)
    const colorAlpha = clamp01((sat - 22) / 60)
    const alpha = Math.max(whiteAlpha, colorAlpha)

    let fr = 255, fg = 255, fb = 255
    if (colorAlpha > whiteAlpha && alpha > 0) {
      const unmix = c => Math.round(Math.min(255, Math.max(0, (c - (1 - alpha) * bg) / alpha)))
      fr = unmix(r)
      fg = unmix(g)
      fb = unmix(b)
    }
    out[i * 4] = fr
    out[i * 4 + 1] = fg
    out[i * 4 + 2] = fb
    out[i * 4 + 3] = alpha < 0.04 ? 0 : Math.round(alpha * 255)
  }

  // 3. Drop leftover JPEG noise along the checkerboard seams: keep only the
  //    bounding box of clearly opaque pixels.
  let minX = width, minY = height, maxX = 0, maxY = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (out[(y * width + x) * 4 + 3] > 200) {
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
  }
  const margin = 3
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < minX - margin || x > maxX + margin || y < minY - margin || y > maxY + margin) out[(y * width + x) * 4 + 3] = 0
    }
  }

  return { data: out, width, height }
}

const raw = await extractLogo(SOURCE)
const rawImage = () => sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 4 } })

// Full lockup, trimmed to its content with a small transparent margin.
const lockup = await sharp(await rawImage().png().toBuffer())
  .trim({ threshold: 1 })
  .extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toBuffer()
const lockupMeta = await sharp(lockup).metadata()
await writeFile(`${OUT}/wss-it-logo.png`, lockup)

// Web-sized lockup used by AppLogo.vue (sharp up to ~2x the 4.25rem footer height).
const webLogo = await sharp(lockup).resize({ height: 160 }).png({ compressionLevel: 9, palette: false }).toBuffer()
const webLogoMeta = await sharp(webLogo).metadata()
await writeFile(`${OUT}/wss-it-logo-web.png`, webLogo)

// The wordmark is white, so the default lockup is for dark backgrounds.
// Variant for light backgrounds: recolor near-white pixels to the dark navy.
{
  const { data, info } = await sharp(lockup).raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const sat = Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2])
    if (sat < 40 && data[i] > 200) {
      data[i] = 0x0F
      data[i + 1] = 0x17
      data[i + 2] = 0x2A
    }
  }
  await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(`${OUT}/wss-it-logo-on-light.png`)
  await sharp(data, { raw: info }).resize({ height: 160 }).png({ compressionLevel: 9 }).toFile(`${OUT}/wss-it-logo-on-light-web.png`)
}

// The "WSS" mark alone (left of the divider), used for favicons.
const markBuffer = await sharp(lockup)
  .extract({ left: 0, top: 0, width: Math.round(lockupMeta.width * 0.42), height: lockupMeta.height })
  .png()
  .toBuffer()
const mark = await sharp(markBuffer).trim({ threshold: 1 }).png().toBuffer()
await sharp(mark).png({ compressionLevel: 9 }).toFile(`${OUT}/wss-it-mark.png`)

/** Square icon: the mark centered on a dark rounded tile. */
async function squareIcon(size, { rounded = true, padding = 0.14 } = {}) {
  const inner = Math.round(size * (1 - padding * 2))
  const markResized = await sharp(mark)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  const radius = rounded ? Math.round(size * 0.22) : 0
  const tile = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${BG}"/></svg>`,
  )
  return sharp(tile).composite([{ input: markResized, gravity: 'center' }]).png({ compressionLevel: 9 }).toBuffer()
}

// apple-touch-icon: iOS applies its own mask, so no rounding.
await writeFile('public/apple-touch-icon.png', await squareIcon(180, { rounded: false, padding: 0.12 }))

// favicon.svg wraps a 64px PNG of the icon so the favicon matches the logo exactly.
const favicon64 = await squareIcon(64, { padding: 0.1 })
await writeFile(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64"><image width="64" height="64" xlink:href="data:image/png;base64,${favicon64.toString('base64')}"/></svg>\n`,
)

// favicon.ico with PNG-encoded 16/32/48 entries (supported by every current browser).
{
  const sizes = [16, 32, 48]
  const images = await Promise.all(sizes.map(size => squareIcon(size, { padding: 0.06 })))
  const header = Buffer.alloc(6 + sizes.length * 16)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(sizes.length, 4)
  let offset = header.length
  sizes.forEach((size, i) => {
    const entry = 6 + i * 16
    header.writeUInt8(size, entry)
    header.writeUInt8(size, entry + 1)
    header.writeUInt8(0, entry + 2)
    header.writeUInt8(0, entry + 3)
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(images[i].length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += images[i].length
  })
  await writeFile('public/favicon.ico', Buffer.concat([header, ...images]))
}

// Open Graph image: dark background with brand glows and the lockup centered.
{
  const width = 1200
  const height = 630
  const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <radialGradient id="c" cx="1" cy="0" r="0.9"><stop stop-color="#00D1FF" stop-opacity=".16"/><stop offset="1" stop-color="#00D1FF" stop-opacity="0"/></radialGradient>
    <radialGradient id="v" cx="0" cy="1" r="0.8"><stop stop-color="#7C3AED" stop-opacity=".16"/><stop offset="1" stop-color="#7C3AED" stop-opacity="0"/></radialGradient>
    <linearGradient id="g" x1="0" x2="1"><stop stop-color="#00D1FF"/><stop offset=".5" stop-color="#2563EB"/><stop offset="1" stop-color="#7C3AED"/></linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="${BG}"/>
  <rect width="${width}" height="${height}" fill="url(#c)"/>
  <rect width="${width}" height="${height}" fill="url(#v)"/>
  <rect x="${width / 2 - 80}" y="${height - 120}" width="160" height="5" rx="2.5" fill="url(#g)"/>
</svg>`)
  const logo = await sharp(lockup).resize({ width: 940 }).png().toBuffer()
  await sharp(background)
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile('public/og-image.png')
}

console.log(`Logo: ${lockupMeta.width}x${lockupMeta.height} → ${OUT}/wss-it-logo.png`)
console.log(`Web logo: ${webLogoMeta.width}x${webLogoMeta.height} → ${OUT}/wss-it-logo-web.png`)
