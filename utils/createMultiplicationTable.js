/**
 * Shuffles array in random order
 *
 * @param {Array} array
 * @returns {Array} shuffled array
 */
export function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

/**
 * Creates multiplication table items and values
 *
 * @param {Number} num
 * @param {Array}
 * @example [[2,2,4], .]
 */
export function createMultiplyArr(num) {
  const arr = []
  let cnt = 0

  for (let i = 1; i < num; i++) {
    for (let j = 1; j < num; j++) {
      arr[cnt] = [i, j, i * j]
      cnt++
    }
  }

  return arr
}
