/**
 * --------------------------------------------------------------------------
 * Bootstrap (v5.2.0): util/config.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { isElement, toType } from './index'
import Manipulator from '../dom/manipulator'

class Config {
  static _configDefaultType = {}
  static _NAME = null

  static get NAME() {
    if (!this._NAME) {
      throw new Error('You have to implement the static method "NAME", for each component!')
    }

    return this._NAME
  }

  static get Default() {
    return {}
  }

  _getConfig(config) {
    config = this._mergeConfigObj(config)
    config = this._configAfterMerge(config)
    this._typeCheckConfig(config)
    return config
  }

  _configAfterMerge(config) {
    return config
  }

  _mergeConfigObj(config, element) {
    return {
      ...this.constructor.Default,
      ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
      ...(typeof config === 'object' ? config : {})
    }
  }

  _typeCheckConfig(config, configTypes = this.constructor._configDefaultType) {
    for (const property of Object.keys(configTypes)) {
      const expectedTypes = configTypes[property]
      const value = config[property]
      const valueType = isElement(value) ? 'element' : toType(value)

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(
          `${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`
        )
      }
    }
  }
}

export default Config
