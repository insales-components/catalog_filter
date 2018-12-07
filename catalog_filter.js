$(document).ready(function() {
  initCollectionFilter();

  $(document).on('click', '[data-open-filter]', function(event) {
    event.preventDefault();
    alertify.panel({
      target: '.collection-filter',
      position: 'left',
      onOpen: function () {
        initCollectionFilter();
        $('body').addClass('open-collection-filter');
      },
      onclose: function () {
        $('body').removeClass('open-collection-filter');
      }
    });
  });
});

function initCollectionFilter() {
  $('.js-filter-section').dataTabs({
    state: 'accordion',
    useJqMethods: false
  });
  $('.js-filter-range-slider').rangeSlider({
    force_edges: true
  });
  $('.js-filter-range-slider-price').rangeSlider({
    force_edges: true
  });
}

$(function () {
  $('.js-filter-trigger').on('change', function (event) {
    $(this).parents('form:first')
    .submit();
  });
  $(document)
    .on('click', 'label', function (event) {
      var $form = $(this).parents('form:first');
      var $filterItem = $(this).parents('.filter-item');
      var $checkbox = $filterItem.find(':checkbox');

      if ($form.hasClass('collection-filter')) {
        event.preventDefault();
        $checkbox
          .prop('checked', !$checkbox.prop('checked'))
          .trigger('change');
      }
    })
    .on('change', 'input:not(.js-filter-range-placeholder), select', function (event) {
      var $form = $(this).parents('form:first');

      sendFilter($form, $(this));
    })
    .on('click', '[type="submit"]', function (event) {
      var $form = $(this).parents('form:first');

      if ($form.hasClass('collection-filter')) {
        event.preventDefault();
        sendFilter($form, $(event.target));
      }
    })
    .on('check', '.collection-filter', function (event) {

      sendFilter($(this), $(this));
    });

  function sendFilter ($form, $source) {
    if (!$form.hasClass('collection-filter')) {
      return false;
    }

    var isSubmitOnChange = $form.data('submit-onchange');
    var isButton = $source.is('button');

    if (isSubmitOnChange || isButton) {
      $form.submit();
    }
  };
});
