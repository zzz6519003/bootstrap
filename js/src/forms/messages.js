import { sanitizeHtml, DefaultAllowlist } from '../util/sanitizer'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/messages.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

class Messages {
  constructor() {
    this._messages = new Set()
  }

  add(message) {
    this._messages.add(sanitizeHtml(message, DefaultAllowlist, null))
  }

  has() {
    return this._messages.size > 0
  }

  clear() {
    this._messages.clear()
  }

  getAll() {
    return [...this._messages]
  }

  getFirst() {
    return this.getAll()[0] || null
  }
}

export default Messages
