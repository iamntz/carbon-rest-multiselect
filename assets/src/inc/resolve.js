const resolve = (path, obj) => path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);

export default resolve;
