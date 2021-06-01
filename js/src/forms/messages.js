/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/messages.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Message from './message'

class Messages {
  constructor(messageConfig) {
    this._messageConfig = messageConfig
    this._messages = new Set()
  }

  add(message) {
    const config = { ...this._messageConfig, ...{ text: message } }
    this._messages.add(new Message(config))
  }

  has() {
    return this._messages.size > 0
  }

  clear() {
    this._messages.clear()
  }

  getAll() {
    return this._getAllMessagesAsArray().map(message => message.getText())
  }

  getFirst() {
    return this._getAllMessagesAsArray()[0] || null
  }

  appendFirst() {
    const message = this.getFirst()
    if (message) {
      message.append()
    }
  }

  _getAllMessagesAsArray() {
    return [...this._messages]
  }
}

export default Messages
