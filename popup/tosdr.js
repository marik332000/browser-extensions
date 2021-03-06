/*global $:false*/
"use strict";

window.Tosdr = (function () {
  var services = [];

  function loadService (serviceName, serviceIndexData) {
    return $.ajax('http://tos-dr.info/services/' + serviceName + '.json', {
      success: function (service) {
        service.urlRegExp = new RegExp('https?://[^:]*' + service.url + '.*');
        service.points = serviceIndexData.points;
        service.links = serviceIndexData.links;
        if (!service.tosdr) {
          service.tosdr = { rated: false };
        }
        services.push(service);
      },
      dataType: 'json'
    });
  }

  function init (callback) {
    $.ajax('http://tos-dr.info/index/services.json', {
      success: function (servicesIndex) {
        var deferreds = [];
        for (var serviceName in servicesIndex) {
          deferreds.push(loadService(serviceName, servicesIndex[serviceName]));
        }
        $.when.apply(null, deferreds).then(callback);
      },
      dataType: 'json'
    });
  }

  function getService (url) {
    var matchingServices = services.filter(function (service) {
      return service.urlRegExp.exec(url);
    });
    return matchingServices.length > 0 ? matchingServices[0] : null;
  }

  return {
    init: init,
    getServices: function () {
      return services;
    },
    getService: getService
  };
})();
