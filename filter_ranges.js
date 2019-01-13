// <div
//   class="filter-ranges js-filter-ranges"
//   data-filter-ranges-property-id="price"
//   data-filter-ranges-prefix="от "
//   data-filter-ranges-postfix="до "
//   data-filter-ranges-unit=" шт."
//   data-filter-ranges-min="{{ coll_min }}"
//   data-filter-ranges-max="{{ coll_max }}"
//   data-filter-ranges-from="{{ price_min }}"
//   data-filter-ranges-to="{{ price_max }}"
//   data-filter-ranges-str="3"
//   ></div>
// <div
//   class="filter-ranges js-filter-ranges"
// data-filter-ranges-property-id="{{ property.id }}"
// data-filter-ranges-min="{{ min_val }}"
// data-filter-ranges-max="{{ max_val }}"
// data-filter-ranges-from="{{ start }}"
// data-filter-ranges-to="{{ end }}"
//   data-filter-ranges-str="3"
//   ></div>

$(document).ready(function() {
  filter_range('.js-filter-ranges');
});
function filter_range(selector) {
  var $filters = $(selector);

  $.each($filters, function(index, el) {
    var $filter = $(el);
    // числа
    var min = $filter.data('filter-ranges-min');
    var max = $filter.data('filter-ranges-max');
    var from = $filter.data('filter-ranges-from');
    var to = $filter.data('filter-ranges-to');
    var str = $filter.data('filter-ranges-str') || 3;
    var delimiter = $filter.data('filter-ranges-delimiter') || '-';
    var range = (max - min) / str;
    var isFloatNum = isFloat(min) || isFloat(max);
    var ranges = [];
    var prevRange = min;

    // property
    var property = $filter.data('filter-ranges-property-id');
    var prefix = $filter.data('filter-ranges-prefix');
    var postfix = $filter.data('filter-ranges-postfix');
    var unit = $filter.data('filter-ranges-unit');

    $.each(Array(str), function(index, el) {
      var minRange = prevRange;
      var maxRange =  min + range * (index+1);
      prevRange = maxRange;

      if (isFloatNum) {
        minRange = patchNumber(minRange);
        maxRange = patchNumber(maxRange);
      }else{
        minRange = Math.round(minRange, 0);
        maxRange = Math.round(maxRange, 0);
      }

      if ((index+1) == str) {
        maxRange = max;
      }

      ranges.push({
        min: minRange,
        max: maxRange,
        active: (from === minRange) && (to === maxRange)
      })
    });

    var $ul = $('<ul>', {class: 'filter-items-list is-characteristics is-checkbox'});

    $.each(ranges, function(i, rang) {
      $ul.append(getFilterString(rang, property, delimiter, prefix, postfix, unit))
    });

    $filter.append($ul)
  });

  function getFilterString(range, property, delimiter, prefix, postfix, unit) {
    var $chkbx = $('<li>', {class: 'filter-item'})
              .on('click', function () {
                event.preventDefault();
                event.stopPropagation();

                triggerChange(this)
              })
             .append();
    var $label = $('<label>', {class: 'chkbx-label'});

    $label.append(
      $('<input>', {class: 'chkbx', type: 'checkbox', checked: range.active})
      .on('click checked', function () {
        event.preventDefault();
        event.stopPropagation();
        triggerChange(this)
      })

    );
    $label.append($('<span>', {class: 'chkbx-control'}));
    var minText = '';
    var maxText = '';
    if (prefix) {
      minText += prefix;
    }
    if (postfix) {
      maxText += postfix;
    }

    minText += range.min;
    maxText += range.max;

    if (unit) {
      minText += unit;
      maxText += unit;
    }
    $label.append($('<span>', {
      text: minText + ' '+delimiter+' ' + maxText
    }));

    function triggerChange(element) {
      var minItem = 'properties_gt['+property+']';
      var maxItem = 'properties_lt['+property+']';
      if (property == 'price') {
        minItem = 'price_min';
        maxItem = 'price_max';
      }
      if ($(element).parents('form').find('[name="'+minItem+'"]').length == 0) {
        $(element).parents('form')
          .append($('<input>', {
            name: minItem,
            type: 'hidden'
          }));
      }
      if ($(element).parents('form').find('[name="'+maxItem+'"]').length == 0) {
        $(element).parents('form')
          .append($('<input>', {
            name: maxItem,
            type: 'hidden'
          }));
      }
      if (range.active) {
        $('[name="'+minItem+'"]').val('').attr('disabled', false).prop('disabled', false);
      }else {
        $('[name="'+minItem+'"]').val(range.min).attr('disabled', false).prop('disabled', false);
      }

      if (range.active) {
        $('[name="'+maxItem+'"]').val('').attr('disabled', false).prop('disabled', false);
      }else {
        $('[name="'+maxItem+'"]').val(range.max).attr('disabled', false).prop('disabled', false);
      }

      $('[name="'+minItem+'"]').trigger('change');
      $('[name="'+maxItem+'"]').trigger('change');
    }

    return $chkbx.append($label);
  }

  function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }

  function patchNumber (num) {
    var isString = typeof num == 'string';
    var isNumber = typeof num == 'number';

    if (!isNumber && !isString) {
      return 0;
    }

    if(isString){
      num = num.replace(/\s/g, '');
      num = num.replace(/,/g, '.');
      num = num.replace(/px/g, '');
      num = (isNaN(+num)) ? 1 : +num;
    }

    return Number( (isFloat(num)) ? num.toFixed(2) : num );
  }
}
