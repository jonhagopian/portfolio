var tcmAP = (function () {
  var D = document;
  var MS = {};
  var injector = '';
  var applicationState = '';
  var paymentController = '';
  var magCode = window.BU;

  function _createSiteObject() {
    return {
      view: {
        payment: {
          WRAPPER: document.getElementById('paymentbuttonBox'),
          CREDITCARD: document.getElementById('creditcardButton'),
          BILLME: {
                    // No BM for mvp 1a
            isBillMe: false,
            BM: ''
          },

          PAYPALEXPRESSWRAPPER: document.getElementById('paypalbuttonBox'),
          PAYPALEXPRESS: document.getElementById('PayPalExpressShortcut')
        },
        form: {
          WRAPPER: document.getElementById('formInfoContainer')
        },
        submitButton: {
          WRAPPER: document.getElementById('submitbuttonBox'),
          STANDARDSUBMITBUTTON: document.getElementById('standardSubmitButton')
        },
        premiums: {
                // No Premium for mvp 1a
          isPremium: true,
          WRAPPER: document.getElementById('premiumSection'),
          YESPREMIUM: document.getElementById('iDoWant'),
          NOPREMIUM: document.getElementById('iNoWant')
        }
      },
      business: {
        fulfillmentAddress: {
          isBillingAddress: false,
          isShippingAddress: true
        }
      }
    };
  }


    // CUSTOM LOGGING FUNCTION
  function _logMe(message) {
    var error = new ReferenceError(message);
    throw error;
  } // EOF


  function _changeARlang(forApplePay) {
    if (D.querySelectorAll('[data-form-renewal-details] .autorenew')[0]) {
      var arCopy = D.querySelectorAll('[data-form-renewal-details] .autorenew')[0].innerHTML.toString().trim();
      if ((/We will bill you or/).test(arCopy) || (/When you tap Pay we will bill you or/).test(arCopy) ||
          (/We will charge your credit/).test(arCopy) || (/When you tap Pay we will charge your credit/).test(arCopy)) {
        D.querySelectorAll('[data-form-renewal-details] .autorenew')[0].innerHTML = forApplePay !== 0 ?
                      arCopy.replace(/We will bill you or/g, 'When you tap Pay we will bill you or')
                        .replace(/We will charge your credit/g, 'When you tap Pay we will charge your credit')
                      :
                      arCopy.replace(/When you tap Pay we will bill you or/g, 'We will bill you or')
                        .replace(/When you tap Pay we will charge your credit/g, 'We will charge your credit');
      }
    }
  }

    // Sets 1 sec delay
  function _arLangTimer(e) {
    if (e === 0 || e === 1) {
      _changeARlang(e);
    } else {
      var timer = setTimeout(function () {
        _changeARlang(e);
        clearTimeout(timer);
      }, 500);
    }
  }

    // Changes AR lang from CC-> AP and vice versa


    // STATE FUNCTION THAT REVERT BACKS APPLEPAY UI CHANGES
  function _onbeforeApplePay(e) {
    var paymentType = e.id || (e.target.id === '' || undefined ?
            e.target.parentNode.id :
            e.target.id);
    paymentType = paymentType.toUpperCase();
    MS.view.submitButton.STANDARDSUBMITBUTTON.className = MS.view.submitButton.STANDARDSUBMITBUTTON.className.replace(/\bhide\b/, '');
    MS.view.form.WRAPPER.className = MS.view.form.WRAPPER.className.replace(/\bhide\b/, '');
    D.getElementById('applepaybuttonBox').className = 'hide';
    D.getElementById('appleypaychoice').className = D.getElementById('appleypaychoice').className.replace(/\bactive\b/, '');
    _arLangTimer(0);


    applicationState.setState({
      payment: {
        paymentType: 'CREDITCARD'
      }
    });

    D.getElementById('paymentFormBean.paymentType').value = 'CREDITCARD';
  } // EOF

    // STATE FUNCTION THAT COMMITS APPLEPAY UI CHANGES
  function _onAfterApplePay() {
    MS.view.submitButton.STANDARDSUBMITBUTTON.className = 'hide';
    MS.view.form.WRAPPER.className = 'hide';
    D.getElementById('applepaybuttonBox').className = '';
    MS.view.payment.CREDITCARD.className = MS.view.payment.CREDITCARD.className.replace(/\bactive\b/, '');

    applicationState.setState({
      payment: {
        paymentType: 'APPLEPAY'
      }
    });
    if (window.segmentPageObject && window.analytics) {
      segmentPageObject.userAction = 'chose applepay payment method';
      analytics.track('Subscription Flow Interaction', segmentPageObject);
    }
    D.getElementById('paymentFormBean.paymentType').value = 'APPLEPAY';

    _arLangTimer(1);
  } // EOF

    // RETURN ENVIRONMENT OBJECT WITH BOOLEAN VALUES
  function _getEnvironment() {
    var environment = {
      isCMBUILD: false,
      isQA: false,
      isPRODUCTION: false
    };

    if (/cmbuild-subscription/.test(window.location.href)) {
      environment.isCMBUILD = true;
    } else if (/qa-/.test(window.location.href)) {
      environment.isQA = true;
    } else {
      environment.isPRODUCTION = true;
    }

    return environment;
  } // EOF

    // ADDS APPLEPAY SPECIFIC CSS
  function _addAPCSS() {
    var stylesheet = D.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('type', 'text/css');
    stylesheet.setAttribute('href', '//subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/css/shared/applepay.css');

        // Insert stylesheet first into head, so that style modifications can be made
    var docHead = D.getElementsByTagName('head')[0];
    docHead.insertBefore(stylesheet, docHead.firstChild);
  } // EOF

    // TRACKS APPLEPAY IMPRESSIONS ON LOAD
  function _trackOnLoadImpressions() {
    window.utag.link({
      tcm_magcode: magCode,
      click_id: 'tcm-impression',
      event_name: 'tcm-impression-ap'
    });
  } // EOF

    // TRACKS APPLEPAY PAYMENT BUTTON CLICK
  function _trackOnClickImpressions() {
    window.utag.link({
      tcm_magcode: magCode,
      click_id: 'tcm-step3',
      event_name: 'tcm-choose-payment-ap'
    });
  } // EOF

    // CREATES DYNAMIC ELEMETS {ELEMENT TO BE CREATED, ATTRIBUTES}
  function _createElement(element, attributes) {
    var newElement = D.createElement(element);

    for (var attribute in attributes) {
      if (attributes.hasOwnProperty(attribute)) {
        newElement.setAttribute(attribute, attributes[attribute]);
      }
    }


    return newElement;
  } // EOF

    // FIRED WHEN APPLEPAY PAYMENT BUTTON IS CLICKED
  function _onApplePayChoiceClick() {
    _trackOnClickImpressions();
    _onAfterApplePay();
  } // EOF

    // DEPENDANCY FUNCTION -- SHOULD BE DECLARED
  function _subTotal() {
    var subTotal = applicationState.getState().offer.offering.USD;
    return Number(subTotal);
  } // EOF

  function _upsellTotal() {
    var upsellTotal = 0;
    if (applicationState.getState().upsell && applicationState.getState().upsell.enabled) {
      upsellTotal += applicationState.getState().upsell.price || 0;
    }
    return Number(upsellTotal);
  } // EOF

  function _getMagName() {
    return paymentController.magName;
  }


  function _getSelectedTerm() {
    var termLength = applicationState.getState().offer.offering.term;
    var isGated = applicationState.getState().offer.isGated;

    if (isGated) {
      return 'Monthly rate\n';
    }
    return termLength;
  }

  function _getSelectedUpsellTerm() {
    var upsellCopy = '';
    if (applicationState.getState().upsell && applicationState.getState().upsell.enabled) {
      upsellCopy = applicationState.getState().upsell.term;
    }

    return upsellCopy;
  }

    // RETURN LINEITEM OBJECT
  function _setLineItems() {
    var subTotal = 0;
    var upsellTotal = 0;
    if (_subTotal && _getSelectedTerm) {
      subTotal = _subTotal();
      if (_upsellTotal && _getSelectedUpsellTerm) {
        upsellTotal = _upsellTotal();
      }
    } else {
      _logMe('Missing Subtotal/ Selected Term');
      return false;
    }

    var lineItem = [{
      label: _getSelectedTerm(),
      amount: subTotal
    }];

    if (upsellTotal != 0) {
      lineItem.push({
        label: _getSelectedUpsellTerm(),
        amount: upsellTotal
      });
    }

    lineItem.push({
      label: 'Plus Sales Tax',
      type: 'pending'
    });


    return lineItem;
  } // EOF

    // RETURNS TOTAL COST OF THE SUBSCRIPTION INCLUDING SALES TAX
  function _setTotal() {
    var salesTax = 0;
    var labeText = _getMagName() + ' (Total Pending)';
    var totalCost = parseFloat(_subTotal() + _upsellTotal() + salesTax);
    return {
      label: labeText,
      amount: totalCost
    };
  } // EOF

    // SETS BILLING ADDRESS BASED ON FLAG
  function _setBilling() {
    var billingObject = MS.business.fulfillmentAddress.isBillingAddress ? ['postalAddress'] : [];
    return billingObject;
  } // EOF

    // REQUEST APPLEPAY REQUEST OBJECT
  function _createRequestObject() {
    if (_setLineItems() && _setTotal()) {
      return {
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: [
          'visa', 'masterCard', 'amex', 'discover'
        ],
        merchantCapabilities: ['supports3DS'],
        requiredBillingContactFields: _setBilling(),
        requiredShippingContactFields: [
          'postalAddress', 'email'
        ],
        lineItems: _setLineItems(),
        total: _setTotal()
      };
    }
    _logMe('Mising request object info');
    return false;
  } // EOF

    // XHR FUNCTIONS THAT RETURNS MERCHANT SESSION
  function _getMerchantSession(validationURL, sessionAP) {
        // Work Around for invlaid validateURL from Apple for mobile devices
    if (validationURL === 'https://apple-pay-gateway.apple.com/paymentservices/startSession') {
      validationURL = 'https://apple-pay-gateway-cert.apple.com/paymentservices/startSession';
    }

    var xmlhttp = new XMLHttpRequest();
    var host = window.location.hostname;
    var urlJSON = 'https://' + host + '/storefront/validate-merchant.ep?url=' + validationURL;
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        sessionAP.completeMerchantValidation(JSON.parse(xmlhttp.responseText));
      } else if (xmlhttp.status >= 500) {
        _logMe('JSON request error: ' + xmlhttp.status);
        return false;
      }
      return true;
    };
    xmlhttp.open('POST', urlJSON, true);
    xmlhttp.send();
  } // EOF

    // PROMISE THAT SENDS PAYMNET TOKEN
  function _sendPaymentToken() {
    return new Promise(function (resolve) {
      resolve(true);
    });
  } // EOF


    // EXTRACTS BIILING INFO POST APPLEPAY SUCESS - STREET2 IS MANDATORY
  function _extractBillingInformation(responseBilling, responseShippping) {
    var response = MS.business.fulfillmentAddress.isShippingAddress ?
            responseShippping :
            responseBilling;
    var responseShipEmail = responseShippping.emailAddress;

        // If street2 not defined
    if (!(D.getElementById('billingAddress.street2'))) {
      var street2 = _createElement('input', {
        id: 'billingAddress.street2',
        name: 'billingAddress.street2',
        type: 'hidden'
      });

      D.getElementsByTagName('form')[0].appendChild(street2);
    }

    if (response && responseShipEmail) {
      D.getElementById('billingAddress.firstName').value = response.givenName;
      D.getElementById('billingAddress.lastName').value = response.familyName;
      D.getElementById('billingAddress.street1').value = response.addressLines[0];
      D.getElementById('billingAddress.street2').value = response.addressLines[1] || '';
      D.getElementById('billingAddress.city').value = response.locality;
      D.getElementById('billingAddress.subCountry').value = response.administrativeArea.trim().toUpperCase();
      D.getElementById('billingAddress.zipPostalCode').value = response.postalCode;
      D.getElementById('billingAddress.email').value = responseShipEmail;
    }
  }

  _fetchSubCounty = function () {
    var subCountries = [],
      subCountryNodes = D.getElementById('billingAddress.subCountry').childNodes,
      subCountryNodesLength = subCountryNodes.length,
      i;

    for (i = 0; i < subCountryNodesLength; i++) {
      if (D.getElementById('billingAddress.subCountry').childNodes[i].nodeName.toUpperCase() == 'OPTION' && D.getElementById('billingAddress.subCountry').childNodes[i].value.length == 2) {
        subCountries.push(D.getElementById('billingAddress.subCountry').childNodes[i].value);
      }
    }
    return subCountries;
  };

  _validateSubCountry = function (s) {
    var subCountries = _fetchSubCounty();
    return subCountries.filter(function (subCountry) {
      return subCountry == s;
    }).length == 1;
  };


  // Checks storefront fields null check
  _validateShippingAddress = function (shippingAddress) {
    return !!((shippingAddress && shippingAddress.givenName && shippingAddress.familyName &&
          shippingAddress.emailAddress && shippingAddress.addressLines && shippingAddress.addressLines[0] && shippingAddress.locality && _validateSubCountry(shippingAddress.administrativeArea)
          && shippingAddress.postalCode));
  };


    // APPLEPAY BUTTON CLICK
  function _onApplePayClick() {
    _trackOnClickImpressions();
    var request = _createRequestObject();
    if (!request) {
      return;
    }
    var session = new window.ApplePaySession(1, request);

    session.onvalidatemerchant = function (event) {
      _getMerchantSession(event.validationURL, session);
    };

    function _createDynamicApplePayInputFields() {
      var dynamicFields = [
        'paymentFormBean.applePayPaymentMethod', 'paymentFormBean.applePayTransactionIdentifier', 'paymentFormBean.applePayPaymentData'
      ];
      var i;

      if (D.getElementById('paymentFormBean.applePayPaymentMethod') && D.getElementById('paymentFormBean.applePayTransactionIdentifier') && D.getElementById('paymentFormBean.applePayPaymentData')) {
        return;
      }

      for (i = 0; i < dynamicFields.length; i++) {
        var hiddenInput = _createElement('input', {
          id: dynamicFields[i],
          type: 'hidden',
          name: dynamicFields[i]
        });
        D.getElementsByTagName('form')[0].appendChild(hiddenInput);
      }
    }

  // POST PAYMENT AUTHORIZED FROM APPLE
    session.onpaymentauthorized = function (event) {
      _createDynamicApplePayInputFields();
            // Populate hidden input fields
      D.getElementById('paymentFormBean.applePayPaymentMethod').value = JSON.stringify(event.payment.token.paymentMethod);
      D.getElementById('paymentFormBean.applePayTransactionIdentifier').value = event.payment.token.transactionIdentifier;
      D.getElementById('paymentFormBean.applePayPaymentData').value = JSON.stringify(event.payment.token.paymentData);

      _sendPaymentToken(event.payment.token).then(function (success) {
        var status = ApplePaySession.STATUS_SUCCESS;
        if (!success) {
          status = ApplePaySession.STATUS_FAILURE;
        } else if (success && !_validateShippingAddress(event.payment.shippingContact)) {
          status = ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS;
        }

        session.completePayment(status);
        if (status == ApplePaySession.STATUS_SUCCESS) {
          _extractBillingInformation(event.payment.billingContact, event.payment.shippingContact);
          window.submitForm();
        }
      });
    };
    session.begin();
  } // EOF


    // CLONES CC STYLES FOR AP BUTTONS IN PAYMENT SECTION
  function _cloneCCStyles() {
    var styles = {
      applepaychoiceBox: '',
      applePaymentButton: ''
    };
    if (MS.view.payment.CREDITCARD.parentNode.id === 'paymentbuttonBox') {
      styles.applepaychoiceBox = '';
    } else {
      styles.applepaychoiceBox = MS.view.payment.CREDITCARD.parentNode.className;
    }
    styles.applePaymentButton = MS.view.payment.CREDITCARD.style.backgroundColor;

    return styles;
  } // EOF


  // Bill me
  function _createBillMeSection() {
    MS.view.payment.BILLME.PayPalExpressShortcutBillingSection.style.display = 'none';

    var applePaymentButtonBilling = _createElement('button', {
      id: 'appleypaychoiceBillingSection',
      class: 'fa fa-apple',
      type: 'button'
    });

    var applePaymentButtonText = _createElement('span', {
      id: 'applePaymentButtonTextBilling',
      class: 'underline'
    });


    D.getElementById('PayPalExpressShortcutWrapper').appendChild(applePaymentButtonBilling);
    D.getElementById('appleypaychoiceBillingSection').appendChild(applePaymentButtonText);
    D.getElementById('applePaymentButtonTextBilling').innerHTML = 'Apple Pay';
    D.getElementById('appleypaychoiceBillingSection').addEventListener('click', function () {
      applicationState.setState({
        payment: {
          paymentType: 'APPLEPAY'
        }
      });
      _onApplePayClick();
    });
  }

  function _billMe(e) {
    _onbeforeApplePay(e);
    applicationState.setState({
      payment: {
        paymentType: 'BILLME'
      }
    });
  }
    // FUNCTION THAT CREATED ALL APPLEPAY UI ELEMENTS
  function _showApplePayButtons() {
    var styles = _cloneCCStyles(); // Reterives CC styles and DOM structure

    var applepaychoiceBox = _createElement('div', {
      id: 'applepaychoiceBox',
      class: styles.applepaychoiceBox
    });

    var applePaymentButton = _createElement('button', {
      id: 'appleypaychoice',
      class: 'buttons',
      type: 'button',
      style: 'background-color: ' + styles.applePaymentButton + ' ',
      'data-scroll-trigger': 'form'
    });

    var appleSubmitWrapper = _createElement('div', {
      id: 'applepaybuttonBox',
      class: 'hide'
    });

    var appleSubmitButton = _createElement('div', {
      id: 'applepaybutton',
      class: 'apple-pay-button apple-pay-button-black'
    });

    var otherpaymentschoiceBox = _createElement('div', {
      id: 'otherpaychoiceBox',
      class: 'col-xs-12 col-sm-12 col-md-6'
    });

    var otherPayemntLink = _createElement('a', {
      id: 'otherpaychoice',
      'data-scroll-trigger': 'payment'
    });

    applePaymentButton.addEventListener('click', _onApplePayChoiceClick);
    appleSubmitButton.addEventListener('click', _onApplePayClick);

    applepaychoiceBox.appendChild(applePaymentButton);
    MS.view.payment.WRAPPER.appendChild(applepaychoiceBox);
    appleSubmitWrapper.appendChild(appleSubmitButton);
    MS.view.submitButton.WRAPPER.appendChild(appleSubmitWrapper);

    otherPayemntLink.innerHTML = 'Other payment types';
    otherPayemntLink.addEventListener('click', _onbeforeApplePay);

    otherpaymentschoiceBox.appendChild(otherPayemntLink);
    appleSubmitWrapper.appendChild(otherpaymentschoiceBox);

    applePaymentButton.innerHTML = 'Apple Pay';
    appleSubmitButton.innerHTML = '&nbsp;';

    if (paymentController.paypalEnabled) {
      MS.view.payment.PAYPALEXPRESSWRAPPER.className += ' hide';
    }

    if (paymentController.isBillMe) {
      MS.view.payment.BILLME.isBillMe = true;
      MS.view.payment.BILLME.BM = document.getElementById('billMe');
      MS.view.payment.BILLME.PayPalExpressShortcutBillingSection = document.getElementById('PayPalExpressShortcutBillingSection');
      _createBillMeSection();

      MS.view.payment.BILLME.BM.addEventListener('click', function () {
        _billMe(this);
      }, false);
    }

    _onAfterApplePay();
  } // EOF

    // Manages AP AR
  function _applePayAR() {
    var offers = document.querySelectorAll('[data-offer-id]');

    for (var offer in offers) {
      if (offers.hasOwnProperty(offer)) {
        offers[offer].addEventListener('click', function () {
          if (applicationState.getState().payment.paymentType == 'CREDITCARD') {
            _arLangTimer(0);
          } else if (applicationState.getState().payment.paymentType == 'APPLEPAY') {
            _arLangTimer(1);
          }
        }, false);
      }
    }
  }


  function _changeOfferTargets() {
    var offerTriggerButtons = D.querySelectorAll('#offeringModule [data-scroll-trigger=payment]');
    for (i = 0; i < offerTriggerButtons.length; i++) {
      // only change trigger if there is no upsell
      if (offerTriggerButtons[i].className.indexOf('upsell') < 0) {
        offerTriggerButtons[i].setAttribute('data-scroll-trigger', 'form');
      }
    }
  }

    // INITILIZES AP ON WINDOW.ONLOAD
  function _init() {
    var merchantIdentifier = _getEnvironment().isQA ?
            'merchant.com.paymentech.timeinc.tcs.applepayweb.time.qa' :
            'merchant.com.paymentech.timeinc.tcs.applepayweb.time';

    var promise = window.ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
    promise.then(function (canMakePaymentsWithActiveCard) {
      if (canMakePaymentsWithActiveCard) {
        injector = angular.element(document.querySelector('[ng-app]')).injector();
        applicationState = injector.get('applicationStateService');
        paymentController = angular.element(document.getElementById('paymentModule')).controller();
        _changeOfferTargets();
        MS = _createSiteObject();
        _trackOnLoadImpressions();
        _addAPCSS();
        _showApplePayButtons();
        _applePayAR();

        MS.view.payment.CREDITCARD.addEventListener('click', function () {
          _onbeforeApplePay(this);
        }, false);
      }
    });
  } // EOF

  window.addEventListener('DOMContentLoaded', function () {
    if (window.ApplePaySession) {
      setTimeout(_init, 3000);
    }
  });
}());
