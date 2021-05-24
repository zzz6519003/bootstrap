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

const NAME = 'formValidation'
const DATA_KEY = 'bs.formValidation'
const EVENT_KEY = `.${DATA_KEY}`
const DATA_API_KEY = '.data-api'

const CLASS_VALIDATED = 'was-validated'
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="form-validation"]'

const Default = {
  type: 'feedback'
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
    this._elements = [...this._element.elements]

    this._formFields = this._initializeFields()
  }

  static get NAME() {
    return NAME
  }

  getFields() {
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
    this._elements.forEach(element => {
      const field = this._formFields.get(element.id)
      if (element.checkValidity()) {
        field.appendFirstSuccessMsg()
      } else {
        field.appendFirstErrorMsg()
      }
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

  _initializeFields() {
    const arrayFields = new Map()
    this._elements.forEach(element => {
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

EventHandler.on(document, `submit${EVENT_KEY}${DATA_API_KEY}`, SELECTOR_DATA_TOGGLE, event => {
  const { target } = event
  target.setAttribute('novalidate', true)
  const data = FormValidation.getInstance(target) || new FormValidation(target)
  if (target.checkValidity()) {
    data.clear()
    return
  }

  event.preventDefault()
  event.stopPropagation()

  data.autoValidate()
})

export default FormValidation

