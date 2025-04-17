# API Documentation

## Base URL

```
/api
```

All API endpoints are relative to this base URL.

## Authentication

Most endpoints require authentication using JWT (JSON Web Token).

**How to authenticate:**

Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

You can obtain a token by logging in through the `/api/users/login` endpoint.

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `500 Server Error`: Server-side error

Error responses follow this format:

```json
{
  "message": "Error message description"
}
```

---

# Users API

## Register User

Creates a new user account.

- **URL**: `/api/users`
- **Method**: `POST`
- **Auth required**: No

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Success Response

- **Code**: `201 Created`
- **Content**:

```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "user",
  "token": "JWT_TOKEN"
}
```

### Error Response

- **Code**: `400 Bad Request`
- **Content**:

```json
{
  "message": "User already exists"
}
```

## Login User

Authenticates a user and returns a token.

- **URL**: `/api/users/login`
- **Method**: `POST`
- **Auth required**: No

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "user",
  "token": "JWT_TOKEN"
}
```

### Error Response

- **Code**: `401 Unauthorized`
- **Content**:

```json
{
  "message": "Invalid credentials"
}
```

## Get User Profile

Returns the authenticated user's profile.

- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Auth required**: Yes

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "user",
  "addresses": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Home",
      "addressLine1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "India",
      "phone": "9876543210",
      "isDefault": true
    }
  ]
}
```

## Update User Profile

Updates the authenticated user's profile.

- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Auth required**: Yes

### Request Body

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "newpassword123"
}
```

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "user",
  "addresses": []
}
```

## Add User Address

Adds a new address to the user's profile.

- **URL**: `/api/users/address`
- **Method**: `POST`
- **Auth required**: Yes

### Request Body

```json
{
  "name": "Home",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "India",
  "phone": "9876543210",
  "isDefault": true
}
```

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "addresses": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Home",
      "addressLine1": "123 Main St",
      "addressLine2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "India",
      "phone": "9876543210",
      "isDefault": true
    }
  ]
}
```

## Update User Address

Updates an existing address.

- **URL**: `/api/users/address/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **URL Parameters**: `:id` - ID of the address to update

### Request Body

```json
{
  "name": "Office",
  "addressLine1": "456 Business Ave",
  "city": "New York",
  "state": "NY",
  "postalCode": "10002",
  "country": "India",
  "phone": "9876543210",
  "isDefault": false
}
```

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "addresses": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Office",
      "addressLine1": "456 Business Ave",
      "city": "New York",
      "state": "NY",
      "postalCode": "10002",
      "country": "India",
      "phone": "9876543210",
      "isDefault": false
    }
  ]
}
```

## Delete User Address

Deletes an address from the user's profile.

- **URL**: `/api/users/address/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **URL Parameters**: `:id` - ID of the address to delete

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "message": "Address removed",
  "addresses": []
}
```

## Get All Users (Admin Only)

Returns a list of all users (admin only).

- **URL**: `/api/users`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of users per page (default: 10)
  - `keyword`: Search term for name or email

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "users": [
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "user"
    },
    {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Admin User",
      "email": "admin@example.com",
      "phone": "9876543211",
      "role": "admin"
    }
  ],
  "page": 1,
  "pages": 1,
  "count": 2
}
```

---

# Products API

## Get All Products

Returns a list of products with optional filtering.

- **URL**: `/api/products`
- **Method**: `GET`
- **Auth required**: No
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of products per page (default: 10)
  - `keyword`: Search term for product name
  - `category`: Filter by category ID
  - `min`: Minimum price
  - `max`: Maximum price
  - `sort`: Sort order (e.g., "price", "-price", "name", "-name")

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "products": [
    {
      "_id": "60d0fe4f5311236168a109cc",
      "name": "Bhagavad Gita - Hardcover",
      "slug": "bhagavad-gita-hardcover",
      "image": "/images/products/bhagavad-gita.jpg",
      "brand": "Gita Press",
      "price": 299,
      "mrp": 399,
      "countInStock": 50,
      "category": {
        "_id": "60d0fe4f5311236168a109cd",
        "name": "Religious Books"
      },
      "rating": 4.8,
      "numReviews": 12,
      "discountPercentage": 25
    }
  ],
  "page": 1,
  "pages": 1,
  "count": 1
}
```

## Get Product by ID

Returns a single product by ID.

- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `:id` - ID of the product to retrieve

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "_id": "60d0fe4f5311236168a109cc",
  "name": "Bhagavad Gita - Hardcover",
  "slug": "bhagavad-gita-hardcover",
  "image": "/images/products/bhagavad-gita.jpg",
  "images": [
    "/images/products/bhagavad-gita-1.jpg",
    "/images/products/bhagavad-gita-2.jpg"
  ],
  "brand": "Gita Press",
  "price": 299,
  "mrp": 399,
  "countInStock": 50,
  "category": {
    "_id": "60d0fe4f5311236168a109cd",
    "name": "Religious Books"
  },
  "description": "Sacred Hindu scripture with commentary",
  "rating": 4.8,
  "numReviews": 12,
  "reviews": [
    {
      "_id": "60d0fe4f5311236168a109ce",
      "name": "John Doe",
      "rating": 5,
      "comment": "Excellent quality and content",
      "user": "60d0fe4f5311236168a109ca",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "specifications": [
    {
      "name": "Pages",
      "value": "700"
    },
    {
      "name": "Language",
      "value": "Sanskrit with English translation"
    }
  ],
  "discountPercentage": 25
}
```

### Error Response

- **Code**: `404 Not Found`
- **Content**:

```json
{
  "message": "Product not found"
}
```

## Get Product by Slug

Returns a single product by slug.

- **URL**: `/api/products/slug/:slug`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `:slug` - Slug of the product to retrieve

### Success Response

- **Code**: `200 OK`
- **Content**: Same as "Get Product by ID"

### Error Response

- **Code**: `404 Not Found`
- **Content**:

```json
{
  "message": "Product not found"
}
```

## Get Top Products

Returns the top-rated products.

- **URL**: `/api/products/top`
- **Method**: `GET`
- **Auth required**: No
- **Query Parameters**:
  - `limit`: Number of products to return (default: 5)

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
[
  {
    "_id": "60d0fe4f5311236168a109cc",
    "name": "Bhagavad Gita - Hardcover",
    "image": "/images/products/bhagavad-gita.jpg",
    "price": 299,
    "rating": 4.8
  }
]
```

## Get Related Products

Returns products related to a specific product.

- **URL**: `/api/products/:id/related`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `:id` - ID of the reference product
- **Query Parameters**:
  - `limit`: Number of products to return (default: 4)

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
[
  {
    "_id": "60d0fe4f5311236168a109cf",
    "name": "Ramayana - Hardcover",
    "image": "/images/products/ramayana.jpg",
    "price": 349,
    "rating": 4.7
  }
]
```

## Create Product (Admin Only)

Creates a new product.

- **URL**: `/api/products`
- **Method**: `POST`
- **Auth required**: Yes (Admin)

### Request Body

```json
{
  "name": "New Product",
  "image": "/images/products/new-product.jpg",
  "brand": "Brand Name",
  "category": "60d0fe4f5311236168a109cd",
  "description": "Product description",
  "price": 199,
  "mrp": 249,
  "countInStock": 25,
  "specifications": [
    {
      "name": "Weight",
      "value": "500g"
    }
  ]
}
```

### Success Response

- **Code**: `201 Created`
- **Content**: Created product object

## Update Product (Admin Only)

Updates an existing product.

- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Auth required**: Yes (Admin)
- **URL Parameters**: `:id` - ID of the product to update

### Request Body

```json
{
  "name": "Updated Product Name",
  "price": 229,
  "countInStock": 30
}
```

### Success Response

- **Code**: `200 OK`
- **Content**: Updated product object

## Delete Product (Admin Only)

Deletes a product.

- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **URL Parameters**: `:id` - ID of the product to delete

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "message": "Product removed"
}
```

---

# Categories API

## Get All Categories

Returns a list of all categories.

- **URL**: `/api/categories`
- **Method**: `GET`
- **Auth required**: No

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
[
  {
    "_id": "60d0fe4f5311236168a109cd",
    "name": "Religious Books",
    "slug": "religious-books",
    "description": "Sacred texts and religious literature",
    "image": "/images/categories/books.jpg",
    "parent": null,
    "isActive": true
  },
  {
    "_id": "60d0fe4f5311236168a109d0",
    "name": "Pooja Items",
    "slug": "pooja-items",
    "description": "Essential items for religious ceremonies",
    "image": "/images/categories/pooja.jpg",
    "parent": null,
    "isActive": true
  }
]
```

## Get Category by ID

Returns a single category by ID.

- **URL**: `/api/categories/:id`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `:id` - ID of the category to retrieve

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "_id": "60d0fe4f5311236168a109cd",
  "name": "Religious Books",
  "slug": "religious-books",
  "description": "Sacred texts and religious literature",
  "image": "/images/categories/books.jpg",
  "parent": null,
  "isActive": true
}
```

## Get Category by Slug

Returns a single category by slug.

- **URL**: `/api/categories/slug/:slug`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `:slug` - Slug of the category to retrieve

### Success Response

- **Code**: `200 OK`
- **Content**: Same as "Get Category by ID"

## Get Parent Categories

Returns all top-level categories (with no parent).

- **URL**: `/api/categories/parents`
- **Method**: `GET`
- **Auth required**: No

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
[
  {
    "_id": "60d0fe4f5311236168a109cd",
    "name": "Religious Books",
    "slug": "religious-books",
    "image": "/images/categories/books.jpg"
  },
  {
    "_id": "60d0fe4f5311236168a109d0",
    "name": "Pooja Items",
    "slug": "pooja-items",
    "image": "/images/categories/pooja.jpg"
  }
]
```

## Get Subcategories

Returns all subcategories of a specific category.

- **URL**: `/api/categories/:id/subcategories`
- **Method**: `GET`
- **Auth required**: No
- **URL Parameters**: `:id` - ID of the parent category

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
[
  {
    "_id": "60d0fe4f5311236168a109d1",
    "name": "Vedic Texts",
    "slug": "vedic-texts",
    "image": "/images/categories/vedic.jpg",
    "parent": "60d0fe4f5311236168a109cd"
  }
]
```

## Get Festival Categories

Returns all categories marked as festivals.

- **URL**: `/api/categories/festivals`
- **Method**: `GET`
- **Auth required**: No

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
[
  {
    "_id": "60d0fe4f5311236168a109d2",
    "name": "Diwali",
    "slug": "diwali",
    "image": "/images/categories/diwali.jpg",
    "isFestival": true
  }
]
```

## Create Category (Admin Only)

Creates a new category.

- **URL**: `/api/categories`
- **Method**: `POST`
- **Auth required**: Yes (Admin)

### Request Body

```json
{
  "name": "New Category",
  "description": "Category description",
  "image": "/images/categories/new-category.jpg",
  "parent": null,
  "isFestival": false,
  "isActive": true,
  "order": 5
}
```

### Success Response

- **Code**: `201 Created`
- **Content**: Created category object

---

# Orders API

## Create Order

Creates a new order.

- **URL**: `/api/orders`
- **Method**: `POST`
- **Auth required**: Yes

### Request Body

```json
{
  "orderItems": [
    {
      "name": "Bhagavad Gita - Hardcover",
      "qty": 2,
      "image": "/images/products/bhagavad-gita.jpg",
      "price": 299,
      "product": "60d0fe4f5311236168a109cc"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "India",
    "phone": "9876543210"
  },
  "paymentMethod": "COD",
  "itemsPrice": 598,
  "taxPrice": 59.8,
  "shippingPrice": 0,
  "totalPrice": 657.8,
  "notes": "Please deliver in the evening"
}
```

### Success Response

- **Code**: `201 Created`
- **Content**:

```json
{
  "_id": "60d0fe4f5311236168a109d3",
  "orderItems": [
    {
      "name": "Bhagavad Gita - Hardcover",
      "qty": 2,
      "image": "/images/products/bhagavad-gita.jpg",
      "price": 299,
      "product": "60d0fe4f5311236168a109cc"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "India",
    "phone": "9876543210"
  },
  "paymentMethod": "COD",
  "itemsPrice": 598,
  "taxPrice": 59.8,
  "shippingPrice": 0,
  "totalPrice": 657.8,
  "notes": "Please deliver in the evening",
  "user": "60d0fe4f5311236168a109ca",
  "isPaid": false,
  "isDelivered": false,
  "status": "Pending",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

## Get Order by ID

Returns a single order by ID.

- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **URL Parameters**: `:id` - ID of the order to retrieve

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "_id": "60d0fe4f5311236168a109d3",
  "orderItems": [
    {
      "name": "Bhagavad Gita - Hardcover",
      "qty": 2,
      "image": "/images/products/bhagavad-gita.jpg",
      "price": 299,
      "product": "60d0fe4f5311236168a109cc"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "India",
    "phone": "9876543210"
  },
  "paymentMethod": "COD",
  "itemsPrice": 598,
  "taxPrice": 59.8,
  "shippingPrice": 0,
  "totalPrice": 657.8,
  "notes": "Please deliver in the evening",
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "isPaid": false,
  "isDelivered": false,
  "status": "Pending",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Error Response

- **Code**: `404 Not Found`
- **Content**:

```json
{
  "message": "Order not found"
}
```

## Get My Orders

Returns all orders for the authenticated user.

- **URL**: `/api/orders/myorders`
- **Method**: `GET`
- **Auth required**: Yes

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
[
  {
    "_id": "60d0fe4f5311236168a109d3",
    "totalPrice": 657.8,
    "isPaid": false,
    "isDelivered": false,
    "status": "Pending",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

## Update Order to Paid

Updates an order's payment status.

- **URL**: `/api/orders/:id/pay`
- **Method**: `PUT`
- **Auth required**: Yes
- **URL Parameters**: `:id` - ID of the order to update

### Request Body

```json
{
  "id": "PAYMENT_ID",
  "status": "COMPLETED",
  "update_time": "2023-01-01T00:00:00Z",
  "email_address": "john@example.com"
}
```

### Success Response

- **Code**: `200 OK`
- **Content**: Updated order object

## Update Order Status (Admin Only)

Updates an order's status.

- **URL**: `/api/orders/:id`
- **Method**: `PUT`
- **Auth required**: Yes (Admin)
- **URL Parameters**: `:id` - ID of the order to update

### Request Body

```json
{
  "status": "Processing",
  "trackingNumber": "TRK123456789",
  "notes": "Order processed and ready for shipping"
}
```

### Success Response

- **Code**: `200 OK`
- **Content**: Updated order object

## Get All Orders (Admin Only)

Returns all orders (admin only).

- **URL**: `/api/orders`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of orders per page (default: 10)
  - `status`: Filter by status
  - `startDate`: Filter by start date
  - `endDate`: Filter by end date

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "orders": [
    {
      "_id": "60d0fe4f5311236168a109d3",
      "user": {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "John Doe"
      },
      "totalPrice": 657.8,
      "isPaid": false,
      "isDelivered": false,
      "status": "Pending",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "pages": 1,
  "count": 1
}
```

---

# Cart API

## Get Cart

Returns the authenticated user's cart.

- **URL**: `/api/cart`
- **Method**: `GET`
- **Auth required**: Yes

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "cartItems": [
    {
      "product": "60d0fe4f5311236168a109cc",
      "name": "Bhagavad Gita - Hardcover",
      "image": "/images/products/bhagavad-gita.jpg",
      "price": 299,
      "qty": 2
    }
  ],
  "totalPrice": 598,
  "totalItems": 2
}
```

## Add to Cart

Adds an item to the cart.

- **URL**: `/api/cart`
- **Method**: `POST`
- **Auth required**: Yes

### Request Body

```json
{
  "productId": "60d0fe4f5311236168a109cc",
  "qty": 1
}
```

### Success Response

- **Code**: `200 OK`
- **Content**: Updated cart object

## Update Cart Item

Updates the quantity of an item in the cart.

- **URL**: `/api/cart/:productId`
- **Method**: `PUT`
- **Auth required**: Yes
- **URL Parameters**: `:productId` - ID of the product to update

### Request Body

```json
{
  "qty": 3
}
```

### Success Response

- **Code**: `200 OK`
- **Content**: Updated cart object

## Remove from Cart

Removes an item from the cart.

- **URL**: `/api/cart/:productId`
- **Method**: `DELETE`
- **Auth required**: Yes
- **URL Parameters**: `:productId` - ID of the product to remove

### Success Response

- **Code**: `200 OK`
- **Content**: Updated cart object

## Clear Cart

Removes all items from the cart.

- **URL**: `/api/cart`
- **Method**: `DELETE`
- **Auth required**: Yes

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "message": "Cart cleared",
  "cartItems": [],
  "totalPrice": 0,
  "totalItems": 0
}
```

---

# Admin Dashboard API

## Get Product Count

Returns product count statistics.

- **URL**: `/api/admin/products/count`
- **Method**: `GET`
- **Auth required**: Yes (Admin)

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "count": 78,
  "activeCount": 65,
  "inactiveCount": 13,
  "lowStockCount": 8,
  "featuredCount": 12
}
```

## Get User Count

Returns user count statistics.

- **URL**: `/api/admin/users/count`
- **Method**: `GET`
- **Auth required**: Yes (Admin)

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "count": 245,
  "adminCount": 3,
  "customerCount": 242
}
```

## Get Order Count

Returns order count statistics.

- **URL**: `/api/admin/orders/count`
- **Method**: `GET`
- **Auth required**: Yes (Admin)

### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "count": 156,
  "pendingCount": 23,
  "processingCount": 45,
  "shippedCount": 32,
  "deliveredCount": 56
}
```
