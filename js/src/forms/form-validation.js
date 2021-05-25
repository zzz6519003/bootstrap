/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.0.1): util/form-validation.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import BaseComponent from '../base-component'
import EventHandler from '../dom/event-handler'
import { getUID, typeCheckConfig } from '../util/index'
import Field from './field'
import Manipulator from '../dom/manipulator'
import SelectorEngine from '../dom/selector-engine'

const NAME = 'formValidation'
const DATA_KEY = 'bs.formValidation'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'
const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`
const EVENT_SUBMIT = `submit${EVENT_KEY}${DATA_API_KEY}`
const EVENT_RESET = `reset${EVENT_KEY}`

const CLASS_VALIDATED = 'was-validated'
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="form-validation"]'

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
    this._formElements = [...this._element.elements] // the DOM elements
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
    return this.getFields().get(name) || null
  }

  appendErrors() {
    this.getFields().forEach(field => {
      field.appendFirstErrorMsg()
    })
  }

  clear() {
    this._element.classList.remove(CLASS_VALIDATED)
    this.getFields().forEach(field => {
      field.clearAppended()
    })
  }

  autoValidate() {
    if (this._element.checkValidity()) {
      this.clear()
      return
    }

    this.getFields().forEach(field => {
      const element = field.getElement()
      if (element.checkValidity()) {
        field.appendFirstSuccessMsg()
        return
      }

      if (!field.errorMessages().has()) { // if hasn't custom message, try to put the default
        field.errorMessages().add(element.validationMessage)
      }

      field.appendFirstErrorMsg()
    })

    this._element.classList.add(CLASS_VALIDATED)
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
    this._formElements.forEach(element => {
      let { id } = element
      if (!id) {
        id = getUID(NAME)
        element.id = id
      }

      const field = new Field(element, {
        name: id,
        type: this._config.type
      })
      arrayFields.set(id, field)
    })
    return arrayFields
  }
}

EventHandler.on(document, EVENT_SUBMIT, SELECTOR_DATA_TOGGLE, event => {
  const { target } = event
  const data = FormValidation.getInstance(target) || new FormValidation(target)
  if (!target.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }

  data.autoValidate()
})

EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  SelectorEngine.find(SELECTOR_DATA_TOGGLE).forEach(el => {
    el.setAttribute('novalidate', true)
  })
})
export default FormValidation

