/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.3.0): util/form-validation.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from '../base-component'
import EventHandler from '../dom/event-handler'
import { typeCheckConfig } from '../util/index'
import Field from './field'
import Manipulator from '../dom/manipulator'
import SelectorEngine from '../dom/selector-engine'

const NAME = 'formValidation'
const DATA_KEY = 'bs.formValidation'
const EVENT_KEY = `.${DATA_KEY}`
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}`
const EVENT_SUBMIT = `submit${EVENT_KEY}`
const EVENT_RESET = `reset${EVENT_KEY}`

const CLASS_VALIDATED = 'was-validated'
const SELECTOR_DATA_TOGGLE = 'form[data-bs-toggle="form-validation"]'

const Default = {
  type: 'feedback' // or 'tooltip'
}

const DefaultType = {
  type: 'string'
}

class FormValidation extends BaseComponent {
  constructor(element, config) {
    super(element)
    if (this._element.tagName !== 'FORM') {
      throw new TypeError(`Need to be initialized in form elements. "${this._element.tagName}" given`)
    }

    this._config = this._getConfig(config)
    this._formFields = null // Our fields

    EventHandler.on(this._element, EVENT_RESET, () => {
      this.clear()
    })
  }

  static get NAME() {
    return NAME
  }

  getFields() {
    if (!this._formFields) {
      this._formFields = this._initializeFields()
    }

    return this._formFields
  }

  getField(name) {
    return this.getFields().get(name)
  }

  clear() {
    this._element.classList.remove(CLASS_VALIDATED)
    // eslint-disable-next-line no-unused-vars
    for (const [name, field] of this.getFields()) {
      field.clearAppended()
    }
  }

  autoValidate() {
    this.clear()
    if (this._element.checkValidity()) {
      return
    }

    // eslint-disable-next-line no-unused-vars
    for (const [name, field] of this.getFields()) {
      const message = this._getFieldMessage(field)
      field.appendFeedback(message)
    }

    this._element.classList.add(CLASS_VALIDATED)
  }

  _getFieldMessage(field) {
    const element = field.getElement()

    if (element.checkValidity()) {
      return field.successMessages().getFirst()
    }

    if (field.errorMessages().has('default')) {
      return field.errorMessages().get('default')
    }

    // eslint-disable-next-line no-console
    console.log(element.validity)
    for (const property in element.validity) {
      if (element.validity[property]) {
        field.errorMessages().set(property, element.validationMessage)
        return field.errorMessages().get(property)
      }
    }

    return ''
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

  _initializeFields() {
    const fields = new Map()
    const formElements = Array.from(this._element.elements) // the DOM elements
    for (const element of formElements) {
      const name = element.name || element.id

      const field = Field.getOrCreateInstance(element, {
        name,
        type: this._config.type
      })
      fields.set(name, field)
    }

    return fields
  }
}

// On submit we want to auto-validate form
EventHandler.on(document, EVENT_SUBMIT, SELECTOR_DATA_TOGGLE, event => {
  const { target } = event
  const data = FormValidation.getOrCreateInstance(target)
  if (!target.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }

  data.autoValidate()
})

// On load, add `novalidate` attribute to avoid browser validation
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const el of SelectorEngine.find(SELECTOR_DATA_TOGGLE)) {
    el.setAttribute('novalidate', true)
  }
})
export default FormValidation

