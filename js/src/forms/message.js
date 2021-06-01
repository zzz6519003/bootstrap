import { DefaultAllowlist, sanitizeHtml } from '../util/sanitizer'
import { typeCheckConfig } from '../util/index'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/message.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const TYPE_PLACEHOLDER = '{type}'

const Default = {
  appendFunction: null,
  classPrefix: null,
  template: `<div class="field-${TYPE_PLACEHOLDER}"></div>`,
  text: null,
  type: null
}

const DefaultType = {
  appendFunction: 'function',
  classPrefix: 'string',
  template: 'string',
  text: 'string',
  type: 'string'
}

class Message {
  constructor(config) {
    this._config = this._getConfig(config)
  }

  getText() {
    return this._config.message
  }

  getHtml() {
    const element = document.createElement('div')
    element.innerHTML = this._setProperClassType(this._config.template)
    const feedback = element.children[0]
    const className = `${this._config.classPrefix}-${TYPE_PLACEHOLDER}`
    feedback.classList.add(this._setProperClassType(className))
    feedback.innerHTML = this._config.text

    return feedback
  }

  append() {
    this._config.appendFunction(this.getHtml())
  }

  _setProperClassType(classPrefix) {
    return classPrefix.replaceAll(TYPE_PLACEHOLDER, this._config.type)
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...(typeof config === 'object' ? config : {})
    }
    config.text = sanitizeHtml(config.text, DefaultAllowlist, null)
    typeCheckConfig(Message, config, DefaultType)
    return config
  }
}

export default Message
