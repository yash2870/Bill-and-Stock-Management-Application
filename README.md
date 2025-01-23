
# Bill Sahayak

Bill Sahayak is an all-in-one solution for seamless billing and stock management. This platform streamlines inventory control, billing processes, and ensures accurate calculations with minimal effort. With user authentication and an intuitive interface, Bill Sahayak is perfect for businesses of all sizes.


---

## **Features**

### **Authentication**
- Secure user registration and login using **JWT Tokens**.
- User authentication ensures data privacy and personalized experiences.

---

### **Home Page**
Once logged in, users are directed to the **Home Page**, which provides two main functionalities:
1. **Manage Bills**
2. **Generate Bills**

---

### **Manage Bills**
This section offers three powerful tools to handle stock management:

#### 1. **Add Items**  
   - Add new stock items with details like:
     - Item name.
     - Quantity (in Kg/Pcs).
     - Price per unit.
   - The stocks are stored in the database for future use.

#### 2. **View Stocks**
   - View all added stocks in the following format:
     ```
     Dell Laptop
     Quantity (Kg/Pcs): 3
     Price (per unit): Rs.50000
     Added: 1/22/2025
     Updated: 1/22/2025
     ```
   - Features:
     - **Search functionality**: Search stocks by name or date.
     - **Edit stocks**: Update existing stock details like quantity or price.

#### 3. **Delete Stocks**
   - Delete any unwanted or outdated stock items.
   - The stocks are displayed in the same format as in the "View Stocks" tab.
   - Includes **search functionality** for quick access.

---

### **Generate Bills**
This section focuses on generating and managing bills:

#### **Bill Generation Process**:
1. Enter customer details:
   - Customer's name.
   - Contact number.
   - Business GST number.
2. Select products to bill:
   - Choose products from a dropdown list containing all available stock items.
   - Automatic calculation of:
     - Subtotal.
     - Discount.
     - GST.
     - Grand total.
3. Generate the bill:
   - The generated bill is stored in the database for future reference.
   - Bills can be downloaded and printed for offline usage.

#### **View Bills**:
- View all previously generated bills.
- Features **search functionality**:
  - Search bills by customer's name, contact number, or date of bill creation.

---
## **Technologies Used**
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS

---
## Screenshots

### Landing Page
![Landing Page](https://github.com/yash2870/Bill-Sahayak/blob/main/Landing%20Page.png)

### Manage Stocks
![Manage Stocks](https://github.com/yash2870/Bill-Sahayak/blob/main/Manage%20Stocks.png)

### Generate Bill
![Generate Bill](https://github.com/yash2870/Bill-Sahayak/blob/main/Generate%20Bill.png)

## 🚀 Hosted Application

You can access the live application here:  
[**Bill Sahayak - Live App**]((https://bill-sahayak.onrender.com))  
