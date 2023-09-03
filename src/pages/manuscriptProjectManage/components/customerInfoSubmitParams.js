import moment from 'moment';

export const customerListParams = values => {
  const {
    customerInfoCustomerName,
    customerInfoCustomerShortName,
    customerInfoCustomerType,
    customerInfoCustomerCode,
    customerInfoIndustryInvolved,
    customerInfoSetUpTime,
    customerInfoPublicSector,
    customerInfoPublicTime,
    customerInfoLegalRepresentative,
    customerInfoRegisteredCapital,
    customerInfoRegisteredCapitalCurrency,
    customerInfoContact,
    customerInfoContactNumber,
    customerInfoBusinessScope,
    customerInfoRemark,
    customerInfoIdType,
    customerInfoOtherIdType,
    customerInfoIdNumber,
    customerInfoSex,
    customerInfoEmail,
  } = values;
  const formValues = { ...values };

  formValues.customerList = formValues.customerList.map(item => {
    if (item.customerType === '1') {
      //客户类型：机构
      const customerType_1 = {
        customerName: customerInfoCustomerName[item.id],
        customerShortName: customerInfoCustomerShortName[item.id],
        customerType: customerInfoCustomerType[item.id],
        customerCode: customerInfoCustomerCode[item.id],
        industryInvolved: customerInfoIndustryInvolved[item.id],
        setUpTime: customerInfoSetUpTime[item.id]
          ? moment(customerInfoSetUpTime[item.id]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        publicSector: customerInfoPublicSector[item.id],
        legalRepresentative: customerInfoLegalRepresentative[item.id],
        registeredCapital: `${customerInfoRegisteredCapital[item.id] || ''}`,
        registeredCapitalCurrency: customerInfoRegisteredCapitalCurrency[item.id],
        contact: customerInfoContact[item.id],
        contactNumber: customerInfoContactNumber[item.id],
        businessScope: customerInfoBusinessScope[item.id],
        remark: customerInfoRemark[item.id],
      };

      if (item.publicSector !== '1006') {
        customerType_1.publicTime = customerInfoPublicTime[item.id]
          ? moment(customerInfoPublicTime[item.id]).format('YYYY-MM-DD HH:mm:ss')
          : '';
      }

      return customerType_1;
    }

    //客户类型：自然人
    const customerType_0 = {
      customerName: customerInfoCustomerName[item.id],
      customerShortName: customerInfoCustomerShortName[item.id],
      customerType: customerInfoCustomerType[item.id],
      idType: customerInfoIdType[item.id],
      idNumber: customerInfoIdNumber[item.id],
      sex: customerInfoSex[item.id],
      email: customerInfoEmail[item.id],
      contactNumber: customerInfoContactNumber[item.id],
      remark: customerInfoRemark[item.id],
    };

    if (item.idType === '1007') {
      customerType_0.otherIdType = customerInfoOtherIdType[item.id];
    }

    return customerType_0;
  });

  for (let key in formValues) {
    if (key.includes('customerInfo')) {
      delete formValues[key];
    }
  }

  return formValues;
};
