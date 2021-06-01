import { DefaultAllowlist, sanitizeHtml } from '../util/sanitizer'
import { typeCheckConfig } from '../util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/messages.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const TYPE_PLACEHOLDER = '{type}'

const Default = {
  message: '',
  template: `<div class="field-${TYPE_PLACEHOLDER}"></div>`,
  appendFunction: null,
  clearFunction: null
}

const DefaultType = {
  message: 'string',
  appendFunction: 'function',
  clearFunction: 'function',
  template: 'string'
}

class Message {
  constructor(config) {
    this._config = this._getConfig(config)
  }

  getText() {
    return this._config.message
  }

  append() {
    this._config.appendFunction()
  }

  clear() {
    this._config.clearFunction()
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...(typeof config === 'object' ? config : {})
    }
    typeCheckConfig(Message, config, DefaultType)
    config.message = sanitizeHtml(config.message, DefaultAllowlist, null)
    return config
  }
}

export default Message
