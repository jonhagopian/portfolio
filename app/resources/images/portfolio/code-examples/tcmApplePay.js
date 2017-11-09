// PREREQUISITES
// JS FILE SHOULD BE ADDED BEFORE CLOSING BODY TAG

// DEPENDANCY OBJECTS
// siteObject - JSON OBJECT WITH ALL UI information
// REFER https://subscription.si.com/storefront/site/si-50for39respppe0516_apm.html FOR SETUP RELATED ISSUES.

// CONSTRUCT THIS SITE OBJECT BASED ON RESPECTIVE MICROSITES
// FEW DIVS AND SPANS NEEDS TO CREATED IN OFFER.VM REFER si-50for39respppe0516_apm
// DOM ID'S ARE NOT NECESSARILY TO BE SAME AS MENTIONED
// var siteObject = {
//     view : {
//       payment : {
//         "WRAPPER" : document.getElementById("paymentbuttonBox"),
//         "CREDITCARD" : document.getElementById("creditcardButton"),
//         "BILLME" : {
//           isBillMe : false,
//           "BM": ""
//         },
//         "PAYPALEXPRESSWRAPPER" : document.getElementById("paypalbuttonBox"),
//         "PAYPALEXPRESS" : document.getElementById("PayPalExpressShortcut")
//       },
//       form : {
//         "WRAPPER": document.getElementById("formInfoContainer")
//       },
//       submitButton : {
//         "WRAPPER" : document.getElementById("submitbuttonBox"),
//         "STANDARDSUBMITBUTTON" : document.getElementById("standardSubmitButton")
//       },
//       premiums : {
//         isPremium : true,
//         "WRAPPER" : document.getElementById("premiumSection"),
//         "YESPREMIUM" : document.getElementById("iDoWant"),
//         "NOPREMIUM" : document.getElementById("iNoWant")
//       }
//     },
//     business : {
//       fulfillmentAddress: {
//         isBillingAddress : false,
//         isShippingAddress : true
//       }
//     }
//   };

// MAG - MAGCODE AND MAGAZINE INFORMATION
// REPLACE MAGCODE AND TITLE ACCORDINGLY
// var mag ={
//     "MAGCODE":"SI",
//     "MAGAZINE":"SPORTS ILLUSTRATED"
// };

// DEPENDANCY FUNCTIONS
// ifApplePay() --CUSTOM FUNCTION IF ANY SPECIFIC CHANGES TO THE FORM BEFORE AP FIRES. RETURN NULL IF NO FUNCTIONALITY IS NEEDED.
// getSubtotal() - CUSTOM FUNCTION THAT RETURNS SUBTOTAL BASED ON SELECTED subscription -- RETURNS FLOAT
// getSelectedTerm() - CUSTOM FUNCTION THAT RETURNS SUBSCRIPTION INFO -- RETURNS STRING
// onApplePaySuccess() - POST APPLEPAY SUCESS LOGIC TO SUBMIT AND ALTER FORM FLOW

// NAMIMG NOMENCALTURE
// _functionName() -- FUNCTIONS SPECIFIC TO tcmApplePay Module
// functionName() -- DEPENDANCY FUNCTION

var tcmAP = (function (WIN, D, MS, MAG) {
    // CUSTOM LOGGING FUNCTION
  _logMe = function (message) {
    var error = new ReferenceError(message + arguments.callee.caller.name.toString());
    throw error;
  }; // EOF

    // VALIDATES ALL THE NECESSARY UI ELEMENTS NEEDED FOR APPLEPAY
  _validateSiteObject = function () {
    if (MAG && MS && MAG.MAGCODE && MAG.MAGAZINE && MS.view.payment && MS.view.form && MS.view.submitButton && MS.business.fulfillmentAddress) {
      if (MS.view.payment.WRAPPER && MS.view.payment.CREDITCARD && MS.view.payment.BILLME && MS.view.payment.PAYPALEXPRESSWRAPPER && MS.view.payment.PAYPALEXPRESS && MS.view.form.WRAPPER && MS.view.submitButton.WRAPPER && MS.view.submitButton.STANDARDSUBMITBUTTON) {
        if (MS.view.payment.BILLME.isBillMe) {
          if (MS.view.payment.BILLME.BM) {
            return true;
          }
          _logMe('Missing bill me information');
          return false;
        }
        return true;
      }
      _logMe('Missing payment UI information');
      return false;
    }
    _logMe('Missing required objects PAYMENT/FORM/SUBMIT BUTTON/PREMIUM');
    return false;
  }; // EOF

  _validateUserDefinedFunctions = function () {
    if (getSubtotal && getSelectedTerm && onApplePaySuccess && ifApplePay) {
      return true;
    }
    _logMe('Missing User defined functions');
    return false;
  }; // EOF

  if (!WIN.ApplePaySession || !_validateSiteObject() || !_validateUserDefinedFunctions()) {
    return;
  }

    // Sets 1 sec delay
  _arLangTimer = function (e) {
    if (e == 0 || e == 1) {
      _changeARlang(e);
    } else {
      var timer = setTimeout(function () {
        _changeARlang(e);
        clearTimeout(timer);
      }, 500);
    }
  };

  _spanishLang ={
    otherPayment : "Otras opciones de pago",
    ar:{
      lang:'Cuando toque pagar vamos a facturarle'
    }
  };

  _spanishArLang = function(arCopy,i,forApplePay){
            D.querySelectorAll('[data-form-renewal-details]')[i].innerHTML = forApplePay != 0 ? arCopy.replace(/Vamos a facturarle/, _spanishLang.ar.lang) : arCopy.replace(/Cuando toque pagar vamos a facturarle/, 'Vamos a facturarle'); 
           
  };

    // Changes AR lang from CC-> AP and vice versa
  _changeARlang = function (forApplePay) {
    for (var i = 0; i < D.querySelectorAll('[data-form-renewal-details]').length; i++) {
      if (D.querySelectorAll('[data-form-renewal-details]')[i]) {
        var arCopy = D.querySelectorAll('[data-form-renewal-details]')[i].innerHTML.toString().trim();

        if(MAG.MAGCODE == "PP"){
            _spanishArLang(arCopy,i,forApplePay);
            return;
        }

        if ((/We will bill you or/).test(arCopy) || (/We will bill you/).test(arCopy) ||
                            (/When you tap Pay we will bill you or/).test(arCopy)) {
          D.querySelectorAll('[data-form-renewal-details]')[i].innerHTML = forApplePay != 0
                                    ? arCopy.replace(/We will bill you or/, 'When you tap Pay we will bill you or')
                                    : arCopy.replace(/When you tap Pay we will bill you or/, 'We will bill you or');
        }
      }
	    }// end for
  };

    // STATE FUNCTION THAT REVERT BACKS APPLEPAY UI CHANGES
  _onbeforeApplePay = function (e) {
    var paymentType = e.id || (e.target.id == '' || undefined
            ? e.target.parentNode.id
            : e.target.id);
    paymentType = paymentType.toUpperCase();
    MS.view.submitButton.STANDARDSUBMITBUTTON.className = MS.view.submitButton.STANDARDSUBMITBUTTON.className.replace(/\bhide\b/, '');
    MS.view.form.WRAPPER.className = MS.view.form.WRAPPER.className.replace(/\bhide\b/, '');
    D.getElementById('applepaybuttonBox').className = 'hide';
    D.getElementById('appleypaychoice').className = D.getElementById('appleypaychoice').className.replace(/\bactive\b/, '');
    _arLangTimer(0);
    if (MS.view.payment.BILLME.isBillMe) {
      if (paymentType == 'otherpaychoice') {
        D.getElementById('paymentFormBean.paymentType').value = 'CREDITCARD';
      } else {
        D.getElementById('paymentFormBean.paymentType').value = (paymentType.indexOf('CC') > 0) || (paymentType.indexOf('CREDIT') > 0)
                    ? 'CREDITCARD'
                    : 'BILLME';
      }
    } else {
      D.getElementById('paymentFormBean.paymentType').value = 'CREDITCARD';
    }
  }; // EOF

    // STATE FUNCTION THAT COMMITS APPLEPAY UI CHANGES
  _onAfterApplePay = function () {
    MS.view.submitButton.STANDARDSUBMITBUTTON.className = 'hide';
    MS.view.form.WRAPPER.className = 'hide';
    D.getElementById('applepaybuttonBox').className = '';
    MS.view.payment.CREDITCARD.className = MS.view.payment.CREDITCARD.className.replace(/\bactive\b/, '');
    D.getElementById('paymentFormBean.paymentType').value = 'APPLEPAY';
    _arLangTimer(1);
  }; // EOF

    // RETURN ENVIRONMENT OBJECT WITH BOOLEAN VALUES
  _getEnvironment = function () {
    var environment = {
      isCMBUILD: false,
      isQA: false,
      isPRODUCTION: false
    };

    if (/cmbuild\-subscription/.test(WIN.location.href)) {
      environment.isCMBUILD = true;
    } else if (/qa\-/.test(WIN.location.href)) {
      environment.isQA = true;
    } else {
      environment.isPRODUCTION = true;
    }

    return environment;
  }; // EOF

    // ADDS APPLEPAY SPECIFIC CSS
  _addAPCSS = function () {
    var stylesheet = D.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('type', 'text/css');
    stylesheet.setAttribute('href', '//subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/css/shared/applepay.css');

        // Insert stylesheet first into head, so that style modifications can be made
    var docHead = D.getElementsByTagName('head')[0];
    docHead.insertBefore(stylesheet, docHead.firstChild);
  }; // EOF

    // TRACKS APPLEPAY IMPRESSIONS ON LOAD
  _trackOnLoadImpressions = function () {
    utag.link({ tcm_magcode: MAG.MAGCODE, click_id: 'tcm-impression', event_name: 'tcm-impression-ap' });
  }; // EOF

    // TRACKS APPLEPAY PAYMENT BUTTON CLICK
  _trackOnClickImpressions = function () {
    utag.link({ tcm_magcode: MAG.MAGCODE, click_id: 'tcm-step3', event_name: 'tcm-choose-payment-ap' });
  }; // EOF

    // CREATES DYNAMIC ELEMETS {ELEMENT TO BE CREATED, ATTRIBUTES}
  _createElement = function (element, attributes) {
    var newElement = D.createElement(element);

    for (var attribute in attributes) {
      if (attributes.hasOwnProperty(attribute)) {
        newElement.setAttribute(attribute, attributes[attribute]);
      }
    }

    return newElement;
  }; // EOF

    // FIRED WHEN APPLEPAY PAYMENT BUTTON IS CLICKED
  _onApplePayChoiceClick = function () {
    _trackOnClickImpressions();
    _onAfterApplePay();
  }; // EOF

    // DEPENDANCY FUNCTION -- SHOULD BE DECLARED
  _subTotal = function () {
    if (getSubtotal) {
      return parseFloat(getSubtotal());
    }
    return false;
  }; // EOF

    // RETURN LINEITEM OBJECT
  _setLineItems = function () {
        // CUSTOM FUNCTION SHOULD BE WRIITEN  WITH SAME NAME
    if (_subTotal() && getSelectedTerm) {
      var subTotal = _subTotal();
    } else {
      _logMe('Mssing Subtotal/ Selected Term');
      return false;
    }

    return lineItem = [
      {
        label: getSelectedTerm(),
        amount: subTotal
      }, {
        label: 'Plus Sales Tax where applicable',
        type: 'pending'
      }
    ];
  }; // EOF

    // RETURNS TOTAL COST OF THE SUBSCRIPTION INCLUDING SALES TAX
  _setTotal = function () {
    var salesTax = 0;
        // if(getSalesTax){
        //     salesTax = parseFloat(getSalesTax());
        // }
    var labeText = MAG.MAGAZINE + ' (Total Pending)',
      totalCost = parseFloat(_subTotal() + salesTax);
    return { label: labeText, amount: totalCost };
  }; // EOF

    // SETS BILLING ADDRESS BASED ON FLAG
  _setBilling = function () {
    var billingObject = MS.business.fulfillmentAddress.isBillingAddress
            ? ['postalAddress']
            : [];
    return billingObject;
  }; // EOF

    // REQUEST APPLEPAY REQUEST OBJECT
  _createRequestObject = function () {
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
  }; // EOF

    // XHR FUNCTIONS THAT RETURNS MERCHANT SESSION
  _getMerchantSession = function (validationURL, sessionAP) {
        // Work Around for invlaid validateURL from Apple for mobile devices
    if (validationURL == 'https://apple-pay-gateway.apple.com/paymentservices/startSession') {
      validationURL = 'https://apple-pay-gateway-cert.apple.com/paymentservices/startSession';
    }

    var xmlhttp = new XMLHttpRequest();
    var host = WIN.location.hostname;
    var urlJSON = 'https://' + host + '/storefront/validate-merchant.ep?url=' + validationURL;
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        sessionAP.completeMerchantValidation(JSON.parse(xmlhttp.responseText));
      } else if (xmlhttp.status >= 500) {
        _logMe('JSON request error: ' + xmlhttp.status);
        return false;
      }
    };
    xmlhttp.open('POST', urlJSON, true);
    xmlhttp.send();
  }; // EOF

    // PROMISE THAT SENDS PAYMNET TOKEN
  _sendPaymentToken = function (token) {
    return new Promise(function (resolve, reject) {
      resolve(true);
    });
  }; // EOF

    // Reterives short notation from state json
  _reteriveState = function (state) {
    if (stateObject) {
      return stateObject[state] || state;
    }
        // Returns the same state if match not found.
    return state;
  };

  _fetchSubCounty = function () {
    var subCountries = [],
      sunCountryNodes = D.getElementById('billingAddress.subCountry').childNodes,
      sunCountryNodesLength = sunCountryNodes.length,
      i;

    for (i = 0; i < sunCountryNodesLength; i++) {
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

    // EXTRACTS BIILING INFO POST APPLEPAY SUCESS - STREET2 IS MANDATORY
  _extractBillingInformation = function (responseBilling, responseShippping) {
    var response = MS.business.fulfillmentAddress.isShippingAddress
            ? responseShippping
            : responseBilling;
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
  };

    // APPLEPAY BUTTON CLICK
  _onApplePayClick = function () {
    _trackOnClickImpressions();
    var request = _createRequestObject();
    if (!request) {
      return;
    }
    var session = new ApplePaySession(1, request);

    session.onvalidatemerchant = function (event) {
      _getMerchantSession(event.validationURL, session);
    };

    _createDynamicApplePayInputFields = function () {
      var dynamicFields = [
          'paymentFormBean.applePayPaymentMethod', 'paymentFormBean.applePayTransactionIdentifier', 'paymentFormBean.applePayPaymentData'
        ],
        i;

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
    };

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
          onApplePaySuccess();
          info('Thank you!');
        }
      });
    };

    session.begin();
  }; // EOF

    // CHANGES DATA ATTRIBUTES BASED ON AP
  _premiumViews = function () {
    if (MS.view.premiums.isPremium) {
      MS.view.premiums.YESPREMIUM.addEventListener('click', function () {
        _arLangTimer(3);
      }, false);
      MS.view.premiums.NOPREMIUM.addEventListener('click', function () {
        _arLangTimer(3);
      }, false);
      MS.view.premiums.YESPREMIUM.setAttribute('data-scroll-trigger', 'form');
      MS.view.premiums.NOPREMIUM.setAttribute('data-scroll-trigger', 'form');
    }
  }; // EOF

    // CLONES CC STYLES FOR AP BUTTONS IN PAYMENT SECTION
  _cloneCCStyles = function () {
    var styles = {
      applepaychoiceBox: '',
      applePaymentButton: ''
    };
    if (MS.view.payment.CREDITCARD.parentNode.id == 'paymentbuttonBox') {
      styles.applepaychoiceBox = '';
    } else {
      styles.applepaychoiceBox = MS.view.payment.CREDITCARD.parentNode.className;
    }
    styles.applePaymentButton = MS.view.payment.CREDITCARD.className;

    return styles;
  }; // EOF

    // FUNCTION THAT CREATED ALL APPLEPAY UI ELEMENTS
  _showApplePayButtons = function () {
    var styles = _cloneCCStyles(); // Reterives CC styles and DOM structure

    var applepaychoiceBox = _createElement('div', {
      id: 'applepaychoiceBox',
      class: styles.applepaychoiceBox
    });

    var applePaymentButton = _createElement('button', {
      id: 'appleypaychoice',
      type: 'button',
      class: styles.applePaymentButton,
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

    otherPayemntLink.innerHTML = MAG.MAGCODE == "PP" ? _spanishLang.otherPayment :'Other payment types';
    otherPayemntLink.addEventListener('click', _onbeforeApplePay);

    otherpaymentschoiceBox.appendChild(otherPayemntLink);
    appleSubmitWrapper.appendChild(otherpaymentschoiceBox);

    applePaymentButton.innerHTML = 'Apple Pay';
    appleSubmitButton.innerHTML = '&nbsp;';
    MS.view.payment.PAYPALEXPRESSWRAPPER.className += ' hide';

    _onAfterApplePay();
    _premiumViews();
  }; // EOF

    // Manages AP AR
  _applePayAR = function () {
    var offers = document.querySelectorAll('[data-offer-id]');

    for (var offer in offers) {
      if (offers.hasOwnProperty(offer)) {
        offers[offer].addEventListener('click', function () {
          _arLangTimer(3);
        }, false);
      }
    }
  };

  _getStateJSON = function () {
    var script = D.createElement('script');
    script.src = '//subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/js/shared/tcmApplePayState.js';

    var docHead = D.getElementsByTagName('head')[0];
    docHead.insertBefore(script, docHead.firstChild);
  };

    // INITILIZES AP ON WINDOW.ONLOAD
  _init = function () {
    var merchantIdentifier = _getEnvironment().isQA
            ? 'merchant.com.paymentech.timeinc.tcs.applepayweb.time.qa'
            : 'merchant.com.paymentech.timeinc.tcs.applepayweb.time';

    var promise = ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);
    promise.then(function (canMakePayments) {
      if (canMakePayments) {
        ifApplePay(); // DEPENDANT FUNCTION
        _trackOnLoadImpressions();
        _addAPCSS();
        _showApplePayButtons();
        _applePayAR();
                // _getStateJSON();
        MS.view.payment.CREDITCARD.addEventListener('click', function () {
          _onbeforeApplePay(this);
        }, false);

        if (MS.view.payment.BILLME.isBillMe) {
          MS.view.payment.BILLME.BM.addEventListener('click', function () {
            _onbeforeApplePay(this);
          }, false);
        }
      }
    });
  }; // EOF

    // When page is loaded begin ApplePay available test
  if (WIN.attachEvent) {
    WIN.attachEvent('onload', _init);
  } else if (WIN.addEventListener) {
    WIN.addEventListener('load', _init, false);
  } else {
    D.addEventListener('load', _init, false);
  }
}(window, window.document, siteObject, mag));
