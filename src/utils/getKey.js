const getKey = event => {
  const keyCode = event.keyCode || event.which;
  return keyCode;
};

export default getKey;
