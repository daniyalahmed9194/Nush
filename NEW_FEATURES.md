# NUSH Restaurant - Order Management System

## 🎉 New Features Implemented

### 1. **Shopping Cart System**
- ✅ Add items to cart from menu
- ✅ View cart with item quantities
- ✅ Update quantities (increase/decrease)
- ✅ Remove items from cart
- ✅ Real-time total calculation
- ✅ Cart badge showing total items

### 2. **Customer Order Placement**
- ✅ Checkout form with customer details:
  - Full Name (minimum 2 characters)
  - Pakistan Phone Number (format: 03XXXXXXXXX or +923XXXXXXXXX)
  - Delivery Location (detailed address)
- ✅ Form validation with error messages
- ✅ Order summary before confirmation
- ✅ Success confirmation after order placement
- ✅ Cart automatically clears after successful order

### 3. **Admin Dashboard** (`/admin` route)
- ✅ View all orders in real-time
- ✅ Order statistics (Total, Pending, Preparing, Completed)
- ✅ Customer details for each order:
  - Name
  - Phone number
  - Delivery location
- ✅ Order items with quantities and prices
- ✅ Total amount for each order
- ✅ Order status management
- ✅ **Real-time notifications** when new orders arrive
- ✅ Visual and audio alerts for new orders

### 4. **Database Schema**

#### **customers** table
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| name | text | Customer full name |
| phone | text | Pakistan phone number |
| location | text | Delivery address |
| created_at | timestamp | When customer record was created |

#### **orders** table
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| customer_id | integer | Foreign key to customers |
| total_amount | integer | Total price in cents |
| status | text | Order status (pending/confirmed/preparing/completed/cancelled) |
| created_at | timestamp | When order was placed |
| updated_at | timestamp | Last status update time |

#### **order_items** table
| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| order_id | integer | Foreign key to orders |
| menu_item_id | integer | Foreign key to menu_items |
| quantity | integer | Number of items ordered |
| price_at_time | integer | Price when ordered (in cents) |

## 🚀 How to Use

### For Customers:
1. Browse the menu sections (Burgers, Wraps, Chicken, etc.)
2. Click "Add to Cart" on desired items
3. Click the cart icon in the navbar to view your cart
4. Adjust quantities or remove items as needed
5. Click "Proceed to Checkout"
6. Fill in your details:
   - Full Name
   - Pakistan Phone Number
   - Delivery Location
7. Click "Confirm Order"
8. Your order is placed! The restaurant will contact you soon.

### For Admin:
1. Navigate to `/admin` in your browser
2. View all incoming orders in real-time
3. Get notified (visual + audio) when new orders arrive
4. See customer details and order items
5. Update order status as you process them:
   - **Pending** → **Confirmed** → **Preparing** → **Completed**
   - Or mark as **Cancelled** if needed
6. Track statistics at the top of the dashboard

## 📡 Real-time Features
- WebSocket connection between server and admin dashboard
- Instant notifications when customers place orders
- No page refresh needed - orders appear automatically
- Bell icon animation when new orders arrive

## 🔧 API Endpoints

### Orders
- **POST** `/api/orders` - Create new order with customer details
- **GET** `/api/orders` - Get all orders (admin)
- **PATCH** `/api/orders/:id/status` - Update order status

### WebSocket
- **WS** `/ws` - Real-time order notifications for admin

## 📝 Validation
- Pakistan phone number format strictly validated
- All required fields enforced
- Minimum character limits on name and location
- Cart must have at least one item to checkout

## 🎨 UI Components Created
- `CartDrawer.tsx` - Shopping cart side panel
- `CheckoutForm.tsx` - Customer details form
- `AdminDashboard.tsx` - Admin order management page
- `CartContext.tsx` - Global cart state management

## 🔐 Currency
All prices displayed in Pakistani Rupees (Rs.) format.

## 📱 Mobile Responsive
All new features are fully responsive and work on mobile devices.
