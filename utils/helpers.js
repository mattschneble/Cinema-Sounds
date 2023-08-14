function replaceSpacesWithPlus(value) {
    return replace(value, /\s+/g, '+');
  }

  module.exports = {
    replaceSpacesWithPlus
  }