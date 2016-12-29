// simple binary sort insertion
function insertSorted (arr, item, comparator) {
  let low = 0
  let high = arr.length
  let mid
  while (low < high) {
    mid = (low + high) >>> 1
    if (comparator(arr[mid]) < comparator(item)) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  arr.splice(low, 0, item)
}

export default insertSorted
