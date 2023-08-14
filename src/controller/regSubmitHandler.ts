import { createCustomer } from '../model/api/apiRoot';
import countries from '../model/data/countries';
import { Address, CustomerDraft } from '../types/API-interfaces';
import registrationForm from '../view/pages/registration/registration';
import resultMessage from '../view/pages/registration/resultMessage';

const getRegFormData = (e: Event): CustomerDraft => {
  const regForm = e.target as HTMLFormElement;
  const formData = new FormData(regForm);

  const newCustomer: CustomerDraft = {
    email: `${formData.get('email')}`,
    password: `${formData.get('password')}`,
    customerNumber: `${formData.get('tel')}`,
    firstName: `${formData.get('firstName')}`,
    lastName: `${formData.get('lastName')}`,
    dateOfBirth: `${formData.get('dateOfBirth')}`,
    addresses: [],
  };

  const shippingCountry = `${formData.get('shippingCountry')}`;
  const shipAsDefault = `${formData.get('defaultshippingAddress')}` === 'on';
  const bothShipAsDefault = `${formData.get('bothDefaultAddress')}` === 'on';

  let shippingAddress: Address;
  if (shippingCountry) {
    shippingAddress = {
      country: countries[shippingCountry as keyof typeof countries],
      city: `${formData.get('shippingCity')}`,
      streetName: `${formData.get('shippingStreet')}`,
      postalCode: `${formData.get('shippingPostCode')}`,
      firstName: `${formData.get('firstName')}`,
      lastName: `${formData.get('lastName')}`,
      phone: `${formData.get('tel')}`,
    };
    newCustomer.addresses?.push(shippingAddress);
    if (shipAsDefault) {
      newCustomer.defaultShippingAddress = 0;
    }
    if (bothShipAsDefault) {
      newCustomer.defaultBillingAddress = 0;
      newCustomer.defaultShippingAddress = 0;
    }
  }

  const billingCountry = `${formData.get('billingCountry')}`;
  const billAsDefault = `${formData.get('defaultbillingAddress')}` === 'on';
  let billingAddress: Address;
  console.log(billingCountry);
  if (billingCountry && billingCountry !== 'null' && !bothShipAsDefault) {
    console.log('hello');
    billingAddress = {
      country: countries[billingCountry as keyof typeof countries],
      city: `${formData.get('billingCity')}`,
      streetName: `${formData.get('billingStreet')}`,
      postalCode: `${formData.get('billingPostCode')}`,
      firstName: `${formData.get('firstName')}`,
      lastName: `${formData.get('lastName')}`,
      phone: `${formData.get('tel')}`,
    };
    newCustomer.addresses?.push(billingAddress);
    if (billAsDefault && shippingCountry) {
      newCustomer.defaultBillingAddress = 1;
    }
    if (billAsDefault && !shippingCountry) {
      newCustomer.defaultBillingAddress = 0;
    }
  }

  return newCustomer;
};

const submitHandler = async (e: Event) => {
  e.preventDefault();
  const newCustomer = getRegFormData(e);
  const response = await createCustomer(newCustomer);
  console.log(response);
  if (response.statusCode === 201) {
    resultMessage.textContent = `Successfully registered`;
    // redirect to main page
    // setTimeout(() => {window.location.href = '/'}, 3000 )
  } else {
    resultMessage.textContent = response.message;
    // show error massage "try again"
  }
};

registrationForm.addEventListener('submit', submitHandler);
