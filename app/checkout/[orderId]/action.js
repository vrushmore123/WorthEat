export const fetchOrderDetails = async (orderId) => {
  try {
    const response = await fetch(
      `/api/Vendor/orderDetailsPage?orderId=${orderId}`
    );
    const data = await response.json();
    // console.log(data)
    if (response.ok) {
      return data;
    } else {
      console.error("Order not found:", data.message);
      throw new Error(data.message || "Failed to fetch order details");
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};
