// // function processPayment(callback){
// //     console.log("Processing payment...");
// //     setTimeout(()=>{
// //         console.log("Payment successfull");
// //         callback();
// //     },2000);
// // }
// // function sendReceipt(){
// //     console.log("Receipt sent to user");
// // }
// // processPayment(sendReceipt());
// const paymentPromise= new Promise((resolve,reject)=>{
//     let paymentSuccess=false;
//     if(paymentSuccess){
//         resolve("Payment successfull");
//     }
//     else{
//         reject("Payment failed");
//     }
// });
// paymentPromise.then((message) => {
//     console.log(message);
// })
// .catch((error)=>{
//     console.log(error);
// })
function getData(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("Data received");
        },2000);
    });
}
async function fetchData(){
    const result=await getData();
    console.log(result);
}
fetchData();