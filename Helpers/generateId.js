



const generateId =()=> {
    if (!generateId.counter) {
      generateId.counter = 1;
    } else {
      generateId.counter++;
    }
    return generateId.counter;
  }

module.exports = generateId;