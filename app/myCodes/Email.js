import axios from "axios"




export const OrderConfirmationMail = async (url,customerInfo,OwnerEmail, service, addons, apointmentTime, apointmentDate,emailID) => {
    const { data } = await axios.post(`${url}/api/Emails/bookingConfirmed`, {
      customerInfo: customerInfo,
      service: service,
      addons: addons,
       apointmentTime:apointmentTime,
       apointmentDate:apointmentDate,
       emailID:emailID,
       OwnerEmail:OwnerEmail,
     
    },
      {
        headers: {
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
    
    return (data)
  }
