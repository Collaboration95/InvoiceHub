//Checked by Ramita and Radhi (11/08)
document.addEventListener('DOMContentLoaded', init);
// Set the image URL to the img element
const paymentImagePreview = document.getElementById('paymentImagePreview');
    // Get the URL query parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const invoiceId = urlParams.get('invoiceId').split(",");
const SOAId = urlParams.get('SOA');
console.log(invoiceId);
console.log(SOAId);
let data;

async function init(){
    console.log("init");
    data = await retrieveData();
    console.log(data);
    setTimeout(() => {
        showPayment(data);
      }, 100);
    
    console.log("done");
}
    
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

    async function retrieveData() {
        try {
          const response = await fetch('/paid/all'); // Fetch data from the /payment/all endpoint
          data = await response.json();
          return data;
        } catch (error) {
          console.error('Error retrieving data from the server:', error);
          throw error;
        }
      }
    function showPayment(data){
        console.log("paying");
        data.forEach((payment) => {
            if (SOAId == null){
                console.log("invoice");
                array = String(payment.invoiceId).split(',');
                console.log("array", array);
                document.getElementById('soaDetails').style.display = 'none';
                console.log(array.includes(String(invoiceId)));

                if (array.includes(String(invoiceId))) {
                    console.log("invoiceId", invoiceId);
                    // Populate the payment details on the page
                    document.getElementById('invoiceId').textContent = invoiceId;
                    document.getElementById('datePaid').textContent = formatDate(payment.payment_date);
                    document.getElementById('totalPaid').textContent = payment.amount_paid;
                    document.getElementById("paymenttype").textContent = payment.payment_type;
                    document.getElementById("company").textContent = payment.Company;
                    paymentImagePreview.src = `../Image_payment/${payment.payment_Image}`;
                    console.log("SOA", payment.SOA);
                        if (payment.SOA != null){
                            document.getElementById('soaNumber').textContent = payment.SOA;
                            document.getElementById('allInvoicesPaid').textContent = payment.invoiceId; // You can set this dynamically based on your data.
                            document.getElementById('soaDetails').style.display = 'block';
                        }
                    }
                }
                else{
                    console.log("soa");
                    if (SOAId == payment.SOA) {
                        // Populate the payment details on the page
                        document.getElementById('invoiceId').textContent = SOAId;
                        document.getElementById('datePaid').textContent = formatDate(payment.payment_date);
                        document.getElementById('totalPaid').textContent = payment.amount_paid;
                        document.getElementById("paymenttype").textContent = payment.payment_type;
                        document.getElementById("company").textContent = payment.Company;
                        paymentImagePreview.src = `../Image_payment/${payment.payment_Image}`;
                        document.getElementById('soaNumber').textContent = payment.SOA;
                        document.getElementById('allInvoicesPaid').textContent = payment.invoiceId; // You can set this dynamically based on your data.
                        document.getElementById('soaDetails').style.display = 'block';
                        
                        paymentImagePreview.src = `../Image_payment/${payment.payment_Image}`;
                    }
                }
        
        });
        
    }
    
    
    
