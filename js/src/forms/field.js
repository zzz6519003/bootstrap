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
const CLASS_ERROR = 'invalid-feedback'
const CLASS_INFO = 'info-feedback'
const CLASS_SUCCESS = 'valid-feedback'
const ARIA_DESCRIBED_BY = 'aria-describedby'
const Default = {
  name: null,
  parentForm: null,
  template: '<div class="field-feedback"></div>',
  valid: '',
  invalid: ''
}

const DefaultType = {
  name: 'string',
  parentForm: 'element',
  template: 'string',
  valid: 'string',
  invalid: 'string'
}

class Field {
  constructor(element, config) {
    this._element = element
    if (!this._element) {
      throw new TypeError(`field with id:${this._config.name} not found`)
    }

    this._errorMessages = new Messages()
    this._helpMessages = new Messages()
    this._successMessages = new Messages()
    this._config = this._getConfig(config)
    this._appended = null
  }

  clearAppended() {
    if (!this._appended) {
      return
    }

    if (this._appended.parentNode) {
      this._appended.parentNode.removeChild(this._appended)
      this._appended = null
    }

    const field = this._element
    if (field) {
      field.removeAttribute(ARIA_DESCRIBED_BY)
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

  appendFirstErrorMsg() {
    return this._append(this.errorMessages().getFirst(), CLASS_ERROR)
  }

  appendFirstHelpMsg() {
    return this._append(this.helpMessages().getFirst(), CLASS_INFO)
  }

  appendFirstSuccessMsg() {
    return this._append(this.successMessages().getFirst(), CLASS_SUCCESS)
  }

  _getConfig(config) {
    config = {
      ...Default,
      ...Manipulator.getDataAttributes(this._element),
      ...(typeof config === 'object' ? config : {})
    }

    if (config.invalid) {
      this.errorMessages().add(config.invalid)
    }

    if (config.valid) {
      this.successMessages().add(config.valid)
    }

    typeCheckConfig(NAME, config, DefaultType)
    return config
  }

  _append(text, classAttr) {
    this.clearAppended()
    const field = this._element
    if (!field) {
      return
    }

    const feedbackElement = this._makeFeedbackElement(text, classAttr)

    this._appended = feedbackElement

    field.parentNode.insertBefore(feedbackElement, field.nextSibling)

    field.setAttribute(ARIA_DESCRIBED_BY, feedbackElement.id)
  }

  _makeFeedbackElement(text, classAttr) {
    const element = document.createElement('div')
    element.innerHTML = this._config.template
    const feedback = element.children[0]
    feedback.classList.add(classAttr)
    feedback.id = this._getId()
    feedback.innerHTML = text

    return feedback
  }

  _getId() {
    return `${this._config.name}-formTip`
  }
}

export default Field
