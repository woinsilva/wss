import sharp from 'sharp'

await Promise.all([
  sharp('public/og-image.svg').png().toFile('public/og-image.png'),
  sharp('public/favicon.svg').resize(180, 180).png().toFile('public/apple-touch-icon.png'),
])
