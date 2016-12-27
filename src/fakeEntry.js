let callback

function onNewFakeEntry (cb) {
  callback = cb
}

function newFakeEntry (name, duration) {
  if (callback) {
    callback([{
      name: name,
      duration: duration
    }])
  }
}

export { onNewFakeEntry, newFakeEntry }
