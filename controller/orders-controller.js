const connection = require('../db/db-connection');

// Get all orders with items for a specific user
const getUserOrders = (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const query = `
    SELECT 
      o.order_id,
      o.user_id,
      o.payment_method,
      o.card_last4,
      o.subtotal,
      o.tax,
      o.shipping_fee,
      o.total_amount,
      o.created_at,
      oi.item_id,
      oi.product_id,
      oi.product_name,
      oi.price AS item_price,
      oi.quantity,
      oi.total_price AS item_total_price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.user_id = ?
    ORDER BY o.order_id, oi.item_id;
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user orders with items:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Transform result to group items under their order
    const orders = {};

    results.forEach(row => {
      const {
        order_id,
        user_id,
        payment_method,
        card_last4,
        subtotal,
        tax,
        shipping_fee,
        total_amount,
        created_at,
        item_id,
        product_id,
        product_name,
        item_price,
        quantity,
        item_total_price
      } = row;

      if (!orders[order_id]) {
        orders[order_id] = {
          order_id,
          user_id,
          payment_method,
          card_last4,
          subtotal,
          tax,
          shipping_fee,
          total_amount,
          created_at,
          items: []
        };
      }

      orders[order_id].items.push({
        item_id,
        product_id,
        product_name,
        price: item_price,
        quantity,
        total_price: item_total_price
      });
    });

    const orderArray = Object.values(orders);
    return res.status(200).json(orderArray);
  });
};


const getAllOrderHistory = (req, res) => {
  const sql = `
    SELECT
      o.order_id,
      o.user_id,
      o.payment_method,
      p.payment_id,  -- Add payment_id
      p.card_holder, -- Add card_holder
      o.card_last4,
      o.subtotal,
      o.tax,
      o.shipping_fee,
      o.total_amount,
      o.created_at,
      oi.product_name,
      oi.quantity,
      oi.price,
      oi.total_price AS item_total_price,
      p.payment_status,
      p.paid_amount,
      p.paid_at
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN payments p ON o.order_id = p.order_id
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching order history', error: err });
    }

    // Sending the results back as JSON
    res.status(200).json(results);
  });
};



const getPaymentHistory = (req, res) => {
  const query = `
    SELECT
  p.payment_id,
  o.order_id,
  o.user_id,
  p.payment_method,
  p.card_holder,
  p.card_last4,
  p.payment_status,
  p.paid_amount,
  p.paid_at
FROM orders o
LEFT JOIN payments p ON o.order_id = p.order_id
GROUP BY
  p.payment_id,
  o.order_id,
  o.user_id,
  p.payment_method,
  p.card_holder,
  p.card_last4,
  p.payment_status,
  p.paid_amount,
  p.paid_at;

  `;

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching payment history:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(result);
  });
};


module.exports = { getUserOrders ,getAllOrderHistory, getPaymentHistory};
