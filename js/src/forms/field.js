/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/field.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import { typeCheckConfig } from '../util/index'
import Messages from './messages'
import Manipulator from '../dom/manipulator'

const NAME = 'field'
const CLASS_PREFIX_ERROR = 'invalid'
const CLASS_PREFIX_INFO = 'info'
const CLASS_PREFIX_SUCCESS = 'valid'
const ARIA_DESCRIBED_BY = 'aria-describedby'
const Default = {
  name: null,
  type: 'feedback', // or tooltip
  valid: '', // valid message to add
  invalid: '' // invalid message to add
}

const DefaultType = {
  name: 'string',
  type: 'string',
  valid: 'string',
  invalid: 'string'
}

class Field {
  constructor(element, config) {
    this._element = element
    if (!this._element) {
      throw new TypeError(`field with id:${this._config.name} not found`)
    }

    this._config = this._getConfig(config)

    this._errorMessages = this._getNewMessagesCollection(CLASS_PREFIX_ERROR)
    this._helpMessages = this._getNewMessagesCollection(CLASS_PREFIX_INFO)
    this._successMessages = this._getNewMessagesCollection(CLASS_PREFIX_SUCCESS)

    this._initializeMessageCollections()
    this._initialDescriptedBy = this._element.getAttribute(ARIA_DESCRIBED_BY)
    this._appendedFeedback = null
  }

  getElement() {
    return this._element
  }

  clearAppended() {
    if (!this._appendedFeedback) {
      return
    }

    this._appendedFeedback.remove()
    this._appendedFeedback = null
    if (this._initialDescriptedBy) {
      this._element.setAttribute(ARIA_DESCRIBED_BY, this._initialDescriptedBy)
    } else {
      this._element.removeAttribute(ARIA_DESCRIBED_BY)
    }
  }

  dispose() {
    Object.getOwnPropertyNames(this).forEach(propertyName => {
      this[propertyName] = null
    })
  }

  errorMessages() {
    return this._errorMessages
  }

  helpMessages() {
    return this._helpMessages
  }

  successMessages() {
    return this._successMessages
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' ? config : {})
    }

    typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _appendFeedback(htmlElement) {
    this.clearAppended()
    if (!htmlElement) {
      return
    }

    const feedbackElement = htmlElement

    this._appendedFeedback = feedbackElement

    this._element.parentNode.insertBefore(feedbackElement, this._element.nextSibling)
    feedbackElement.id = this._getId()
    const describedBy = this._initialDescriptedBy ? `${this._initialDescriptedBy} ` : ''
    this._element.setAttribute(ARIA_DESCRIBED_BY, `${describedBy}${feedbackElement.id}`)
  }

  _getId() {
    return `${this._config.name}-formTip`
  }

  _getNewMessagesCollection(classPrefix) {
    const config = {
      appendFunction: html => this._appendFeedback(html),
      type: this._config.type,
      classPrefix
    }
    return new Messages(config)
  }

  _initializeMessageCollections() {
    if (this._config.invalid) {
      this.errorMessages().add(this._config.invalid)
    }

    if (this._config.valid) {
      this.successMessages().add(this._config.valid)
    }
  }
}

export default Field
