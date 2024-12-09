/*!
 * ADL - Storage 1.0.0
 * https://www.adldigitallab.com
 * 
 * @license Copyright 2023, ADL Digital Lab S.A.S. All rights reserved.
 * @author: Andrés Valencia Oliveros
 *
 * @class Storage
 * @description A simple storage class that can store data in cookies or localStorage.
 * @param {string} key The key of the data to store.
 * @param {any} value The value of the data to store.
 * @param {number} expiryDays (optional) The number of days after which the data will expire. Defaults to 30 days.
 */
window.ADLStorage = class {
  constructor(key, value, expiryDays = 30) { 
    if (typeof key !== 'string') {
      throw new Error('ADL Storage: Key must be a string.');
    }

    this.key = key;
    this.expiryDays = expiryDays;
    this.expires = new Date();
    this.expires.setTime(this.expires.getTime() + (this.expiryDays * 24 * 60 * 60 * 1000));
    this.data = {
      data: value,
      expiry: this.expires.getTime()
    };
  }

  cookie() {
    const that = this;
    return {
      get: function() {
        const keyValue = document.cookie.match('(^|;)\\s*'+that.key+'\\s*=\\s*([^;]+)');
        return keyValue ? JSON.parse(decodeURIComponent(keyValue.pop())) : null;
      },
      set: function() {
        const cookieString = that.key+'='+encodeURIComponent(JSON.stringify(that.data))+';path=/;expires='+that.expires.toUTCString();
        document.cookie = cookieString;
      }
    };
  }

  local() {
    const that = this;
    return {
      get: function() {
        const itemStr = localStorage.getItem(that.key);

        if (!itemStr) {
          return null;
        }
        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
          localStorage.removeItem(that.key);
          return null;
        }
        return item;
      },
      set: function() {
        localStorage.setItem(that.key, JSON.stringify(that.data));
      }
    };
  }
};