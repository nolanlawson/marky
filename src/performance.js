/* global performance */

// TODO: Node's built-in performance API has poor performance for getEntriesByName()
// so currently we avoid it: https://github.com/nolanlawson/marky/issues/29
export default process.browser && typeof performance !== 'undefined' && performance
