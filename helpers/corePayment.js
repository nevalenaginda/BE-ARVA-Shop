const midtransClient = require("midtrans-client");

exports.coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: "SB-Mid-server-FiwdhpF6CNcmOSV_Ui_BoVyq",
  clientKey: "SB-Mid-client-vy5iRX9f7xvkAPRe",
});

exports.CreateTrx = (core, body) =>
  new Promise((resolve, reject) => {
    const parameter = {
      payment_type: "bank_transfer",
      transaction_details: {
        gross_amount: body.totalPayment,
        order_id: body.orderId,
      },
      customer_details: {
        email: body.emailUser,
        first_name: body.firstName,
        last_name: body.lastName,
        phone: body.phone,
      },
      bank_transfer: {
        bank: "bca",
        va_number: "54767111111",
        bca: {
          sub_company_code: "00000",
        },
      },
    };
    core
      .charge(parameter)
      .then((chargeResponse) => {
        resolve(chargeResponse);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
