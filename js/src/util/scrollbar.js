/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.1.3): util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

import SelectorEngine from '../dom/selector-engine'
import Manipulator from '../dom/manipulator'
import { isElement } from './index'

/**
 * Constants
 */

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
const SELECTOR_STICKY_CONTENT = '.sticky-top'

/**
 * Class definition
 */

class ScrollBarHelper {
  constructor() {
    this._element = document.body
  }

  // Public
  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth
    return Math.abs(window.innerWidth - documentWidth)
  }

  hide() {
    const width = this.getWidth()
    this._disableOverFlow()
    // give padding to element to balance the hidden scrollbar width
    this._setElementAttributes(this._element, 'padding-right', calculatedValue => calculatedValue + width)
    // trick: We adjust positive padding-right and negative margin-right to sticky-top elements to keep showing fullwidth
    this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'padding-right', calculatedValue => calculatedValue + width)
    this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'margin-right', calculatedValue => calculatedValue - width)
  }

  reset() {
    this._resetElementAttributes(this._element, 'overflow')
    this._resetElementAttributes(this._element, 'padding-right')
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'padding-right')
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'margin-right')
  }

  isOverflowing() {
    return this.getWidth() > 0
  }

  // Private
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, 'overflow')
    this._element.style.overflow = 'hidden'
  }

  _setElementAttributes(selector, styleProp, callback) {
    const scrollbarWidth = this.getWidth()
    const manipulationCallBack = element => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return
      }

      this._saveInitialAttribute(element, styleProp)
      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProp)
      element.style.setProperty(styleProp, `${callback(Number.parseFloat(calculatedValue))}px`)
    }

    this._applyManipulationCallback(selector, manipulationCallBack)
  }

  _saveInitialAttribute(element, styleProp) {
    const actualValue = element.style.getPropertyValue(styleProp)
    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProp, actualValue)
    }
  }

  _resetElementAttributes(selector, styleProp) {
    const manipulationCallBack = element => {
      const value = Manipulator.getDataAttribute(element, styleProp)
      if (!value) {
        element.style.removeProperty(styleProp)
        return
      }

      Manipulator.removeDataAttribute(element, styleProp)
      element.style.setProperty(styleProp, value)
    }

    this._applyManipulationCallback(selector, manipulationCallBack)
  }

  _applyManipulationCallback(selector, callBack) {
    if (isElement(selector)) {
      callBack(selector)
      return
    }

    for (const sel of SelectorEngine.find(selector, this._element)) {
      callBack(sel)
    }
  }
}

export default ScrollBarHelper
