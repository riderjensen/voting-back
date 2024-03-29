exports.isValidEmail = (email) => {
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== '' && email.length <= 320 && email.match(emailFormat)) { return true; }

  return false;
};
