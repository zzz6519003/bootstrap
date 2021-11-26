/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/form-validation.js
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

    this._addEventListeners()
    this._formFields = null // Our fields
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
    this.toggleValidateClass(false)
    for (const field of this.getFields()) {
      field.clearAppended()
    }
  }

  toggleValidateClass(add) {
    if (add) {
      this._element.classList.add(CLASS_VALIDATED)
      return
    }

    this._element.classList.remove(CLASS_VALIDATED)
  }

  autoValidate() {
    this.clear()
    if (this._element.checkValidity()) {
      return
    }

    for (const field of this.getFields()) {
      const element = field.getElement()
      if (element.checkValidity()) {
        field.successMessages().getFirst()?.append()
        return
      }

      if (field.errorMessages().has('default')) {
        field.errorMessages().get('default').append()
        return
      }

      for (const property in element.validity) {
        if (element.validity[property]) {
          field.errorMessages().set(property, element.validationMessage)
          field.errorMessages().get(property).append()
        }
      }
    }

    this.toggleValidateClass(true)
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

  _addEventListeners() {
    EventHandler.on(this._element, EVENT_RESET, () => {
      this.clear()
    })
  }

  _initializeFields() {
    const arrayFields = new Map()
    const formElements = Array.from(this._element.elements) // the DOM elements
    for (const element of formElements) {
      const name = element.name || element.id

      const field = Field.getOrCreateInstance(element, {
        name,
        type: this._config.type
      })
      arrayFields.set(name, field)
    }

    return arrayFields
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

