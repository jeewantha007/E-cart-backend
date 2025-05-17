const connection = require('../db/db-connection');

// Get promise-based connection
const promiseConnection = connection.promise();

// Transaction logic function
const processOrderTransaction = async ({
  userId,
  cartItems,
  paymentMethod,
  cardDetails,
}) => {
  // Validate cartItems
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('cartItems is missing or not a valid array');
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const tax = subtotal * 0.12;
  const shippingFee = 500.00; // Fixed shipping fee as per schema
  const totalAmount = subtotal + tax + shippingFee;

  const paymentStatus = paymentMethod === 'cod' ? 'Pending' : 'Success';

  try {
    await promiseConnection.beginTransaction();

    // 1. Insert into orders
    const [orderResult] = await promiseConnection.query(
      `INSERT INTO orders (
        user_id, payment_method, card_last4, subtotal, tax, 
        shipping_fee, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, 
        paymentMethod, 
        paymentMethod === 'card' ? cardDetails.last4 : null,
        subtotal.toFixed(2),
        tax.toFixed(2),
        shippingFee.toFixed(2),
        totalAmount.toFixed(2)
      ]
    );
    const orderId = orderResult.insertId;

    // 2. Insert into order_items and update product inventory
    for (const item of cartItems) {
      // Insert order item
      await promiseConnection.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
        [
          orderId, 
          item.productId, 
          item.productName, 
          item.quantity, 
          item.price, 
          (item.price * item.quantity).toFixed(2)
        ]
      );
      
      // Check current stock level before updating
      const [stockResult] = await promiseConnection.query(
        'SELECT qty FROM products WHERE id = ?',
        [item.productId]
      );
      
      if (stockResult.length === 0) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      
      const currentStock = stockResult[0].qty;
      
      // Ensure we have enough stock
      if (currentStock < item.quantity) {
        throw new Error(`Insufficient stock for product ID ${item.productId}. Available: ${currentStock}, Requested: ${item.quantity}`);
      }
      
      // Update product inventory (subtract purchased quantity)
      await promiseConnection.query(
        'UPDATE products SET qty = qty - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // 3. Insert into payments
    await promiseConnection.query(
      `INSERT INTO payments (
        order_id, payment_method, card_holder, card_last4, payment_status, paid_amount
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        paymentMethod,
        paymentMethod === 'card' ? cardDetails.holder : null,
        paymentMethod === 'card' ? cardDetails.last4 : null,
        paymentStatus,
        totalAmount.toFixed(2)
      ]
    );

    await promiseConnection.commit();
    return { success: true, orderId, totalAmount };
  } catch (error) {
    await promiseConnection.rollback();
    console.error('Transaction failed:', error);
    throw error;
  }
};

// Express middleware handler
const orderTransaction = async (req, res) => {
  try {
    // Extract data from request body
    const { userId, cartItems, paymentMethod, cardDetails } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    if (!paymentMethod || !['cod', 'card'].includes(paymentMethod)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment method is required and must be either "cod" or "card"' 
      });
    }
    
    // Validate card details if payment method is card
    if (paymentMethod === 'card' && (!cardDetails || !cardDetails.holder || !cardDetails.last4)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Card details are required for card payment' 
      });
    }

    // Process the transaction
    const result = await processOrderTransaction({
      userId,
      cartItems,
      paymentMethod,
      cardDetails
    });

    return res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      orderId: result.orderId,
      totalAmount: result.totalAmount
    });
  } catch (error) {
    console.error('Order transaction failed:', error);
    
    // Provide more specific error messages for stock-related issues
    if (error.message.includes('Insufficient stock')) {
      return res.status(400).json({
        success: false,
        message: error.message,
        type: 'STOCK_ERROR'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Order placement failed',
      error: error.message
    });
  }
};

module.exports = { orderTransaction };