import { Injectable } from '@angular/core';

import IMask from 'imask';

@Injectable({
  providedIn: 'root',
})
export class MaskService {
  constructor() {}

  maskForDate(yearMinMax?) {
    return {
      mask: Date,
      pattern: 'm/`d/`Y',
      blocks: {
        m: {
          mask: '00',
          from: 1,
          to: 12,
          maxLength: 2,
          placeholderChar: 'M',
          autofix: true,
        },
        d: {
          mask: '00',
          from: 1,
          to: 31,
          maxLength: 2,
          placeholderChar: 'D',
          autofix: true,
        },
        Y: {
          mask: IMask.MaskedRange,
          from: yearMinMax.from ? yearMinMax.from.getFullYear() : 1900,
          to: yearMinMax.to ? yearMinMax.to.getFullYear() : 9999,
          maxLength: 4,
          placeholderChar: 'Y',
          autofix: true,
        },
      },
      format: function (date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;

        return [month, day, year].join('/');
      },
      parse: function (str) {
        var yearMonthDay = str.split('/');
        return new Date(yearMonthDay[2], yearMonthDay[0] - 1, yearMonthDay[1]);
      },

      min: yearMinMax.from || new Date(1900, 0, 1),
      max: yearMinMax.to || new Date(9999, 0, 1),

      autofix: true,
      lazy: false,
      overwrite: true,
    };
  }

  maskForTime() {
    const timeMode = ['a', 'p'];
    return {
      overwrite: true,
      autofix: true,
      mask: 'HH:MM AM',
      lazy: false,
      blocks: {
        HH: {
          mask: '00',
          placeholderChar: 'H',
          from: 0,
          to: 12,
          maxLength: 2,
          autofix: true,
        },
        MM: {
          mask: '00',
          placeholderChar: 'M',
          from: 0,
          to: 59,
          maxLength: 2,
          autofix: true,
        },
        AM: {
          mask: 'a{M}',
          placeholderChar: 'A',
          prepare: function (str) {
            const returnStr = timeMode.includes(str.toLowerCase()) ? str : '';
            return returnStr.toUpperCase();
          },
        },
      },
    };
  }

  maskForEveryTwoDigits(placeholder) {
    return {
      overwrite: true,
      mask: `00 ${placeholder}`,
      lazy: false,
      min: 1,
      max: 99,
      maxLength: 2,
      placeholderChar: ' ',
    };
  }

  maskForEveryThreeDigits(placeholder) {
    return {
      overwrite: true,
      mask: `000 ${placeholder}`,
      lazy: false,
      min: 1,
      max: 999,
      maxLength: 3,
      placeholderChar: ' ',
    };
  }

  maskForCurrency(min = 0, max = 1000000000000) {
    return {
      mask: Number,
      scale: 2,
      signed: false,
      thousandsSeparator: ',',
      padFractionalZeros: true,
      normalizeZeros: true,
      radix: '.',
      mapToRadix: ['.'],
      min,
      max,
    };
  }

  maskForNumber(min = 0, max = 1000000000000, thousandsSeparator = ',') {
    return {
      mask: Number,
      scale: 0,
      signed: false,
      padFractionalZeros: false,
      normalizeZeros: false,
      thousandsSeparator,
      min,
      max,
    };
  }

  maskForPercentage(min = 0, max = 1000) {
    return {
      overwrite: true,
      autofix: true,
      mask: '0%',
      lazy: false,
      blocks: {
        0: {
          mask: '0[00][000]',
          placeholderChar: '',
          from: min,
          to: max,
          maxLength: max.toString().length,
        },
      },
    };
  }

  maskForPercentage100(min = 0, max = 100) {
    return {
      overwrite: true,
      autofix: true,
      mask: '0%',
      lazy: false,
      blocks: {
        0: {
          mask: Number,
          scale: 0,
          placeholderChar: '',
          min,
          max,
        },
      },
    };
  }

  maskForFractionNumber(min = 0, max = 1000000000000) {
    return {
      mask: Number,
      scale: 2,
      signed: true,
      padFractionalZeros: true,
      normalizeZeros: true,
      radix: '.',
      mapToRadix: ['.'],
      min,
      max,
      thousandsSeparator: ',',
    };
  }

  maskForCurrencyWithSign(min = 0, max = 1000000000000) {
    return {
      mask: '$num',
      blocks: {
        num: {
          mask: Number,
          scale: 2,
          signed: false,
          thousandsSeparator: ',',
          padFractionalZeros: true,
          normalizeZeros: true,
          radix: '.',
          mapToRadix: ['.'],
          min,
          max,
        },
      },
    };
  }
}
