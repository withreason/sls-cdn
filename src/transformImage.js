import sharp from 'sharp'

/*
  CROP GRAVITY:
  sharp.strategy.entropy,
  'north',
  'northeast',
  'east',
  'southeast',
  'south',
  'southwest',
  'west',
  'northwest',
  'center'
*/

export const transformImage = (src, options) => {
  const sImg = sharp(src)
  // default height and width to null for auto scale

  sImg.resize(options.width || null, options.height || null)

  // rotate iamge
  if (options.rotate) {
    sImg.rotate(options.rotate)
  }

  // if a ratio has been defined
  if (options.ratio) {
    switch (options.ratio) {
      case 'min':
        sImg.min()
        break
      case 'ignore':
        sImg.ignoreAspectRatio()
        break
      default:
        sImg.max()
        break
    }
  } else {
    sImg.max()
  }
  // add background
  if (options.embed) {
    sImg.background(options.background ? options.background : '#fff')
    sImg.embed()
  }
  // crop image
  if (options.crop) {
    const cropOption = (options.crop === 'entropy') ? sharp.strategy.entropy : options.crop

    sImg.max()
    sImg.crop(cropOption)
  }
  // jpeg compression
  if (options.quality && (options.format === 'jpg' || options.format === 'jpeg')) {
    sImg.jpeg({ quality: options.quality })
  }

  // output
  return sImg.toBuffer()
}

// transformImage('sample.jpg', {
//   rotate: 90,
//   width: 200,
//   height: 200,
// }, 'sample_crop-r90-200-200-max.jpg')

// transformImage('sample.jpg', {
//   rotate: 90,
//   width: 200,
//   height: 200,
//   ratio: 'min',
// }, 'sample_crop-r90-200-200-min.jpg')

// transformImage('sample.jpg', {
//   rotate: 90,
//   width: 200,
//   height: 200,
//   ratio: 'ignore',
// }, 'sample_crop-r90-200-200-ignore.jpg')

// transformImage('sample.jpg', {
//   width: 200,
//   height: 200,
//   ratio: 'max',
// }, 'sample_crop-200-200-max.jpg')

// transformImage('sample.jpg', {
//   width: 200,
//   height: 200,
//   ratio: 'min',
// }, 'sample_crop-200-200-min.jpg')

// transformImage('sample.jpg', {
//   width: 200,
//   height: 200,
//   ratio: 'min',
//   embed: true,
// }, 'sample_crop-200-200-embed.jpg')

// transformImage('sample.jpg', {
//   width: 200,
//   height: 200,
//   ratio: 'min', // should get ignored
//   embed: '#f00',
// }, 'sample_crop-200-200-embed_f00.jpg')

// transformImage('sample.jpg', {
//   width: 200,
//   height: 200,
//   quality: 10, // all the jpeg
//   embed: '#f00',
// }, 'sample_crop-200-200-embed_f00-q10.jpg')

// transformImage('sample.jpg', {
//   width: 300,
// }, 'sample_crop-w300.jpg')

// transformImage('sample.jpg', {
//   width: 150,
//   height: 150,
//   crop: 'center',
// }, 'sample_crop-150-150-crop_center.jpg')

// transformImage('sample.jpg', {
//   width: 150,
//   height: 150,
//   crop: 'west',
// }, 'sample_crop-150-150-crop_west.jpg')
