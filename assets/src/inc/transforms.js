import resolve from "./resolve";

const labelTransforms = (label, data) => {
  let transforms = label.split('|');

  let resolved = resolve(transforms[0], data);

  if (transforms.length > 1) {
    transforms.slice(1).forEach((transform) => {
      transform = transform.split(':');
      let args = (transform[1] || '').split(',');

      let transformed;
      if (transform[0] === 'wrap') {
        transformed = transform[1].replace('%label%', resolved);
      } else {
        transformed = resolved[transform[0]].apply(resolved, args);
      }

      if (transformed.length < resolved.length) {
        transformed += '...';
      }

      resolved = transformed;
    });
  }

  return resolved;
};


export default labelTransforms;
