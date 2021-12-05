/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import EventHandler from '../dom/event-handler'
import { execute, executeAfterTransition, getElement, reflow } from './index'
import Config from './config'

/**
 * Constants
 */

const NAME = 'backdrop'
const CLASS_NAME_FADE = 'fade'
const CLASS_NAME_SHOW = 'show'
const EVENT_MOUSEDOWN = `mousedown.bs.${NAME}`

const Default = {
  className: 'modal-backdrop',
  isVisible: true, // if false, we use the backdrop helper without adding any element to the dom
  isAnimated: false,
  rootElement: 'body', // give the choice to place backdrop under different elements
  clickCallback: null
}

const DefaultType = {
  className: 'string',
  isVisible: 'boolean',
  isAnimated: 'boolean',
  rootElement: '(element|string)',
  clickCallback: '(function|null)'
}

/**
 * Class definition
 */

class Backdrop extends Config {
  static _NAME = NAME
  static _configDefaultType = DefaultType

  constructor(config) {
    super()
    this._config = this._getConfig(config)
    this._isAppended = false
    this._element = null
  }

  static get Default() {
    return Default
  }

  // Public
  show(callback) {
    if (!this._config.isVisible) {
      execute(callback)
      return
    }

    this._append()

    if (this._config.isAnimated) {
      reflow(this._getElement())
    }

    this._getElement().classList.add(CLASS_NAME_SHOW)

    this._emulateAnimation(() => {
      execute(callback)
    })
  }

  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback)
      return
    }

    this._getElement().classList.remove(CLASS_NAME_SHOW)

    this._emulateAnimation(() => {
      this.dispose()
      execute(callback)
    })
  }

  dispose() {
    if (!this._isAppended) {
      return
    }

    EventHandler.off(this._element, EVENT_MOUSEDOWN)

    this._element.remove()
    this._isAppended = false
  }

  // Private
  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement('div')
      backdrop.className = this._config.className
      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE)
      }

      this._element = backdrop
    }

    return this._element
  }

  _configAfterMerge(config) {
    // use getElement() with the default "body" to get a fresh Element on each instantiation
    config.rootElement = getElement(config.rootElement)
    return config
  }

  _append() {
    if (this._isAppended) {
      return
    }

    this._config.rootElement.append(this._getElement())

    EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback)
    })

    this._isAppended = true
  }

  _emulateAnimation(callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated)
  }
}

export default Backdrop
