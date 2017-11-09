//Ver 1.8
var tcmAndroidPay = (function() {
  var D = document;
  var MS = {};
  var injector = '';
  var applicationState = '';
  var paymentController = '';
  var magCode = window.BU;

  _createSiteObject = function() {
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
  };

  _logMe = function(message) {
    var error = new ReferenceError(message);
    throw error;
  }; // EOF

  // Changes AR lang from CC-> AndroidPay and vice versa
  _changeARlang = function(forAndroidPay) {
    if (D.querySelectorAll('[data-form-renewal-details] .autorenew')[0]) {
      var arCopy = D.querySelectorAll('[data-form-renewal-details] .autorenew')[0].innerHTML.toString().trim();
      if ((/We will bill you or/).test(arCopy) || (/When you tap Pay we will bill you or/).test(arCopy) ||
          (/We will charge your credit/).test(arCopy) || (/When you tap Pay we will charge your credit/).test(arCopy)) {
        D.querySelectorAll('[data-form-renewal-details] .autorenew')[0].innerHTML = forAndroidPay !== 0 ?
                      arCopy.replace(/We will bill you or/g, 'When you tap Pay we will bill you or')
                        .replace(/We will charge your credit/g, 'When you tap Pay we will charge your credit')
                      :
                      arCopy.replace(/When you tap Pay we will bill you or/g, 'We will bill you or')
                        .replace(/When you tap Pay we will charge your credit/g, 'We will charge your credit');
      }
    }
  };

  // Sets 1 sec delay
  _arLangTimer = function(e) {
    if (e == 0 || e == 1) {
      _changeARlang(e);
    } else {
      var timer = setTimeout(function () {
        _changeARlang(e);
        clearTimeout(timer);
      }, 500);
    }
  };

  //STATE FUNCTION THAT REVERT BACKS ANDROIDPAY UI CHANGES
  _onbeforeandroidPay = function(e) {
    var paymentType = e.id || (e.target.id == "" || undefined ? e.target.parentNode.id : e.target.id);
    paymentType = paymentType.toUpperCase();
    MS.view.submitButton.STANDARDSUBMITBUTTON.className = MS.view.submitButton.STANDARDSUBMITBUTTON.className.replace(/\bhide\b/, '');
    MS.view.form.WRAPPER.className = MS.view.form.WRAPPER.className.replace(/\bhide\b/, '');
    D.getElementById("androidpaybuttonBox").className = "hide";
    D.getElementById("androidpaychoice").className = D.getElementById("androidpaychoice").className.replace(/\bactive\b/, "");
    _arLangTimer(0);

    applicationState.setState({
      payment: {
        paymentType: 'CREDITCARD'
      }
    });

    D.getElementById('paymentFormBean.paymentType').value = 'CREDITCARD';
  }; //EOF

  //STATE FUNCTION THAT COMMITS ANDROIDPAY UI CHANGES
  _onAfterAndroidPay = function() {
    MS.view.submitButton.STANDARDSUBMITBUTTON.className = "hide";
    MS.view.form.WRAPPER.className = "hide";
    D.getElementById("androidpaybuttonBox").className = "";
    MS.view.payment.CREDITCARD.className = MS.view.payment.CREDITCARD.className.replace(/\bactive\b/, '');

    applicationState.setState({
      payment: {
        paymentType: 'ANDROIDPAY'
      }
    });
    if (window.segmentPageObject && window.analytics) {
      segmentPageObject.userAction = 'chose android pay payment method';
      analytics.track('Subscription Flow Interaction', segmentPageObject);
    }
    D.getElementById('paymentFormBean.paymentType').value = 'ANDROIDPAY';

    _arLangTimer(1);
  }; //EOF

  // RETURN ENVIRONMENT OBJECT WITH BOOLEAN VALUES
  _getEnvironment = function() {
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

  // CREATES DYNAMIC ELEMETS {ELEMENT TO BE CREATED, ATTRIBUTES}
  _createElement = function(element, attributes) {
    var newElement = D.createElement(element);

    for (var attribute in attributes) {
      if (attributes.hasOwnProperty(attribute)) {
        newElement.setAttribute(attribute, attributes[attribute]);
      }
    }
    return newElement;
  } // EOF

  //ANDROID PAY CHOICE BUTTON TAP (NOT FINAL PAY BUTTON)
  _onAndroidPayChoiceClick = function() {
    _onAfterAndroidPay();
  }; //EOF

  // DEPENDANCY FUNCTION -- SHOULD BE DECLARED
  _subTotal = function() {
    var subTotal = applicationState.getState().offer.offering.USD;
    return Number(subTotal);
  }; // EOF

  _upsellTotal = function() {
    var upsellTotal = 0;
    if (applicationState.getState().upsell && applicationState.getState().upsell.enabled) {
      upsellTotal += applicationState.getState().upsell.price || 0;
    }
    return Number(upsellTotal);
  }; // EOF

  _getMagName = function() {
    return paymentController.magName;
  };

  _getSelectedTerm = function() {
    var termLength = applicationState.getState().offer.offering.term;
    var isGated = applicationState.getState().offer.isGated;

    if (isGated) {
      return 'Monthly rate\n';
    }
    return termLength;
  };

  _getSelectedUpsellTerm = function() {
    var upsellCopy = '';
    if (applicationState.getState().upsell && applicationState.getState().upsell.enabled) {
      upsellCopy = applicationState.getState().upsell.term;
    }

    return upsellCopy;
  };

  // RETURN LINEITEM OBJECT
  _setLineItems = function () {
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
    var details = {
      total: {
        label: _getSelectedTerm(),
        amount: {
          currency: 'USD',
          value: subTotal,
        }
      },
      displayItems: [
        {
          label: 'Plus Sales Tax',
          pending: true, 
          amount: {
            currency: 'USD',
            value: 0,
          },
        },
      ],
      shippingOptions: [
        {
          id: 'shipping',
          label: 'Standard Shipping',
          amount: {
            currency: 'USD',
            value: '0',
          },
          selected: true,
        },
      ],
    };

    if (upsellTotal != 0) {
      details.total.push({
        label: _getSelectedUpsellTerm(),
        amount: {
          currency: 'USD',
          value: upsellTotal,
        }
      });
    };

    return details;
  }; // EOF

  //ADDS ANDROIDPAY SPECIFIC CSS
  _addAndroidPayCSS = function() {
    var stylesheet = D.createElement("link");
    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("type", "text/css");
    stylesheet.setAttribute("href", '//subscription-assets.timeinc.com/prod/assets/themes/magazines/default/template-resources/css/shared/androidpay.css');
    // Insert stylesheet first into head, so that style modifications can be made
    var docHead = D.getElementsByTagName("head")[0];
    docHead.insertBefore(stylesheet, docHead.firstChild);
  }; //EOF

    // RETURNS TOTAL COST OF THE SUBSCRIPTION INCLUDING SALES TAX
  _setTotal = function() {
    var salesTax = 0;
    var labeText = _getMagName() + ' (Total Pending)';
    var totalCost = parseFloat(_subTotal() + _upsellTotal() + salesTax);
    return {
      label: labeText,
      amount: totalCost
    };
  }; // EOF

  // SETS BILLING ADDRESS BASED ON FLAG
  _setBilling = function() {
    var billingObject = MS.business.fulfillmentAddress.isBillingAddress ? ['postalAddress'] : [];
    return billingObject;
  }; // EOF

  // EXTRACTS BIILING INFO POST ANDROID PAY SUCCESS - STREET2 IS MANDATORY
  _extractBillingInformation = function(aPayResponse, aPayShippingResponse) {
    console.log("Extracting Billing Info");
    // If street2 not defined
    if (!(D.getElementById('billingAddress.street2'))) {
      var street2 = _createElement('input', {
        id: 'billingAddress.street2',
        name: 'billingAddress.street2',
        type: 'hidden'
      });
      D.getElementsByTagName('form')[0].appendChild(street2);
    }
    var name = aPayResponse.details.billingAddress.name;
    var nameArr = name.split(" ");
    D.getElementById('billingAddress.lastName').value = nameArr[nameArr.length - 1];
    D.getElementById('billingAddress.firstName').value = nameArr[0];
    console.log("testing Name: ", nameArr[0], nameArr[nameArr.length - 1]);
    D.getElementById('billingAddress.street1').value = aPayShippingResponse.addressLine[0];
    D.getElementById('billingAddress.street2').value = aPayShippingResponse.addressLine[1] || '';
    D.getElementById('billingAddress.city').value = aPayShippingResponse.city;
    D.getElementById('billingAddress.subCountry').value = aPayShippingResponse.region.trim().toUpperCase();
    D.getElementById('billingAddress.zipPostalCode').value = aPayShippingResponse.postalCode;
    D.getElementById('billingAddress.email').value = aPayResponse.payerEmail;
  }; //EOF

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

  /*

  CONTINUE WITH VALIDATE SHIPPING ADDRESS, 
  SHOULD BE ADDED IF REQUEST PAYMENT THEN VALIDATE AND RETURN STATUS FAILURE

  */
  // Checks storefront fields null check
  _validateShippingAddress = function (shippingAddress) {
    return !!((shippingAddress && shippingAddress.givenName && shippingAddress.familyName &&
          shippingAddress.emailAddress && shippingAddress.addressLines && shippingAddress.addressLines[0] && shippingAddress.locality && _validateSubCountry(shippingAddress.administrativeArea)
          && shippingAddress.postalCode));
  };

  // CLONES CC STYLES FOR AP BUTTONS IN PAYMENT SECTION
  _cloneCCStyles = function() {
    var styles = {
      androidpaychoiceBox: '',
      androidPaymentButton: ''
    };
    if (MS.view.payment.CREDITCARD.parentNode.id === 'paymentbuttonBox') {
      styles.androidpaychoiceBox = '';
    } else {
      styles.androidpaychoiceBox = MS.view.payment.CREDITCARD.parentNode.className;
    }
    styles.androidPaymentButton = MS.view.payment.CREDITCARD.style.backgroundColor;

    return styles;
  } // EOF

  // Bill me
  _createBillMeSection = function() {
    MS.view.payment.BILLME.PayPalExpressShortcutBillingSection.style.display = 'none';

    var androidPaymentButtonBilling = _createElement('button', {
      id: 'androidpaychoiceBillingSection',
      class: 'fa fa-android',
      type: 'button'
    });

    var androidPaymentButtonText = _createElement('span', {
      id: 'androidPaymentButtonTextBilling',
      class: 'underline'
    });

    D.getElementById('PayPalExpressShortcutWrapper').appendChild(androidPaymentButtonBilling);
    D.getElementById('androidpaychoiceBillingSection').appendChild(androidPaymentButtonText);
    D.getElementById('androidPaymentButtonTextBilling').innerHTML = 'Android Pay';
    D.getElementById('androidpaychoiceBillingSection').addEventListener('click', function () {
      applicationState.setState({
        payment: {
          paymentType: 'ANDROIDPAY'
        }
      });
      _onAndroidPayClick();
    });
  };

  _billMe = function(e) {
    _onbeforeAndroidPay(e);
    applicationState.setState({
      payment: {
        paymentType: 'BILLME'
      }
    });
  };

  // FUNCTION THAT CREATES ALL ANDROIDPAY UI ELEMENTS
  _showAndroidPayButtons = function() {
    var styles = _cloneCCStyles(); // Reterives CC styles and DOM structure

    var androidpaychoiceBox = _createElement("div", {
        id: "androidpaychoiceBox",
        class: styles.androidpaychoiceBox
    });
    var androidPayChoice = _createElement("button", {
        id: "androidpaychoice",
        class: "buttons",
        type: "button",
        style: 'background-color: ' + styles.androidPaymentButton + ' ', 
        "data-scroll-trigger": "form"
    });
    var androidSubmitWrapper = _createElement("div", {
        id: "androidpaybuttonBox",
        class: "hide"
    });
    var androidSubmitButton = _createElement("div", {
        id: "androidSubmitButton",
        class: "android-pay-button android-pay-button-black"
    });
    var androidContentBox = _createElement("div", {
        id: "content",
        style: "visibility: hidden; height: 1px;"
    });
    var androidResult = _createElement("pre", {
        id: "result"
    });
    var androidStatus = _createElement("pre", {
        id: "status"
    });
    var androidLog = _createElement("pre", {
        id: "log"
    });
    var otherpaymentschoiceBox = _createElement("div", {
        id: "otherpaychoiceBox",
        class: "col-xs-12 col-sm-12 col-md-6"
    });
    var otherpaymentLink = _createElement("a", {
        id: "otherpaychoice",
        "data-scroll-trigger": "payment"
    });
    
    androidPayChoice.addEventListener("click", _onAndroidPayChoiceClick);
    androidSubmitButton.addEventListener('click', _onAndroidPayClick);

    androidpaychoiceBox.appendChild(androidPayChoice);
    MS.view.payment.WRAPPER.appendChild(androidpaychoiceBox);
    androidSubmitWrapper.appendChild(androidSubmitButton);
    androidContentBox.appendChild(androidResult);
    androidContentBox.appendChild(androidStatus);
    androidContentBox.appendChild(androidLog);
    androidSubmitWrapper.appendChild(androidContentBox);
    MS.view.submitButton.WRAPPER.appendChild(androidSubmitWrapper);
    otherpaymentLink.innerHTML = "Other payment types";
    otherpaymentLink.addEventListener("click", _onbeforeandroidPay);
    otherpaymentschoiceBox.appendChild(otherpaymentLink);
    androidSubmitWrapper.appendChild(otherpaymentschoiceBox);
    androidPayChoice.innerHTML = "ANDROID PAY";
    androidSubmitButton.innerHTML = "PAY WITH ANDROID PAY";

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

    _onAfterAndroidPay();
   // _premiumViews();
  }; //EOF

  /**
  * Builds PaymentRequest for Android Pay, but does not show any UI yet. If you
  * encounter issues when running your own copy of this sample, run 'adb logcat |
  * grep Wallet' to see detailed error messages.
  *
  * @return {PaymentRequest} The PaymentRequest object.
  */
  _initPaymentRequest = function() {
    console.log('Android Pay init payment');
    let networks = ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'];
    //let types = ['debit', 'credit', 'prepaid'];
    let supportedInstruments = [{
      supportedMethods: ['https://android.com/pay'],
      data: {
        merchantName: 'Android Pay Demo',
        // Place your own Android Pay merchant ID here. The merchant ID is tied to
        // the origin of the website.
        merchantId: '07799602845071026933',
        //var msEnvironment = _getEnvironment().isQA
        //  ? 'TEST'
        //  : 'PROD';
        //environment: 'TEST',
        allowedCardNetworks: networks,
        paymentMethodTokenizationParameters: {
          tokenizationType: 'NETWORK_TOKEN',
          parameters: {
            //public key to encrypt response from Android Pay
            'publicKey': 'BOPzG8FWZ3MFnuWOP245tJNVXEFuqkDXdirZiSxgi/bUlriW3tW3pDR5lmbl1+DKKjOWS1g3L3ME/2r6zua9nhw='
          },
        },
      },
    }];

    let details = _setLineItems();

    let options = {
      requestShipping: true,
      requestPayerName: true,
      requestPayerEmail: true,
    };

    let request = new PaymentRequest(supportedInstruments, details, options);

    request.addEventListener('shippingaddresschange', function(evt) {
      evt.updateWith(Promise.resolve(details));
    });

    return request;
  }; //EOF

  /**
   * Invokes PaymentRequest for Android Pay.
   *
   * @param {PaymentRequest} request The PaymentRequest object.
   */
  _onAndroidPayClick = function() {
    request = _initPaymentRequest();
    request.show().then(function(instrumentResponse) {
      _sendPaymentToServer(instrumentResponse);
    })
    .catch(function(err) {
      _ChromeSamples.setStatus(err);
    });
  }; //EOF

  /**
   * Simulates processing the payment data on the server.
   *
   * @param {PaymentResponse} instrumentResponse The payment information to
   * process.
   */
  _sendPaymentToServer = function(instrumentResponse) {
    // There's no server-side component of these samples. No transactions are
    // processed and no money exchanged hands. Instantaneous transactions are not
    // realistic. Add a 2 second delay to make it seem more real.
    console.log("sending Payment to Server");
    window.setTimeout(function() {
      instrumentResponse.complete('success')
          .then(function() {
            var responseString = _instrumentToJsonString(instrumentResponse);
            D.getElementById('result').innerHTML = responseString;
            D.getElementById('paymentFormBean.androidPayPaymentData').value = responseString;
            _extractBillingInformation(instrumentResponse, request.shippingAddress);
            window.submitForm();
          })
          .catch(function(err) {
            _ChromeSamples.setStatus(err);
          });
    }, 2000);
  }; //EOF

  var _ChromeSamples = {
    log: function() {
      var line = Array.prototype.slice.call(arguments).map(function(argument) {
        return typeof argument === 'string' ? argument : JSON.stringify(argument);
      }).join(' ');
      document.querySelector('#log').textContent += line + '\n';
    },
    clearLog: function() {
      document.querySelector('#log').textContent = '';
    },
    setStatus: function(status) {
      //document.querySelector('#status').textContent = status;
    },
    setContent: function(newContent) {
      var content = document.querySelector('#content');
      while(content.hasChildNodes()) {
        content.removeChild(content.lastChild);
      }
      content.appendChild(newContent);
    }
  }; //END VAR

  /**
   * Converts the payment instrument into a JSON string.
   *
   * @param {PaymentResponse} instrument The instrument to convert.
   * @return {string} The JSON string representation of the instrument.
   */
  _instrumentToJsonString = function(instrument) {
    if (instrument.toJSON) {
      return JSON.stringify(instrument, undefined, 2);
    } else {
      return JSON.stringify({
        methodName: instrument.methodName,
        details: instrument.details,
      }, undefined, 2);
    }
  }; //EOF

  // Manages AP AR
  _androidPayAR = function() {
    var offers = document.querySelectorAll('[data-offer-id]');

    for (var offer in offers) {
      if (offers.hasOwnProperty(offer)) {
        offers[offer].addEventListener('click', function () {
          if (applicationState.getState().payment.paymentType == 'CREDITCARD') {
            _arLangTimer(0);
          } else if (applicationState.getState().payment.paymentType == 'ANDROIDPAY') {
            _arLangTimer(1);
          }
        }, false);
      }
    }
  }

  _changeOfferTargets = function() {
    var offerTriggerButtons = D.querySelectorAll('#offeringModule [data-scroll-trigger=payment]');
    for (i = 0; i < offerTriggerButtons.length; i++) {
      // only change trigger if there is no upsell
      if (offerTriggerButtons[i].className.indexOf('upsell') < 0) {
        offerTriggerButtons[i].setAttribute('data-scroll-trigger', 'form');
      }
    }
  }

  _initAndroidPay = function() {
    injector = angular.element(document.querySelector('[ng-app]')).injector();
    applicationState = injector.get('applicationStateService');
    paymentController = angular.element(document.getElementById('paymentModule')).controller();
    _changeOfferTargets();
    MS = _createSiteObject();
    _addAndroidPayCSS();
    _showAndroidPayButtons();
    _androidPayAR();
  }; //EOF

  /* 
  * If marketing is testing using Google Optimize, 
  * variable optimizeFlag is set to true from Optimize editor
  * Optimize has its own DOMContentLoaded, this will bypass ours below.
  */
  if (typeof optimizeFlag === 'undefined' || !optimizeFlag) {
    window.addEventListener('DOMContentLoaded', function () {
      if (window.PaymentRequest) {
        setTimeout(_initAndroidPay, 3000);
      }
    });
  } else {
    if (window.PaymentRequest) {
      setTimeout(_initAndroidPay, 3000);
    }
  };

}());
