import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import Navbar from './Navbar';
import Footer from "./Footer";
import { toast } from 'react-toastify';


const GenerateBill = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [businessGST, setBusinessGST] = useState("");
  const [products, setProducts] = useState([{ name: "", quantity: 0, price: 0, total: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [originalSubtotal, setOriginalSubtotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [bills, setBills] = useState([]);  // State for storing all bills
  const [searchQuery, setSearchQuery] = useState("");  // State for search functionality
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility state
  const [selectedBill, setSelectedBill] = useState(null); // Store the selected bill details

  const [availableProducts, setAvailableProducts] = useState([]);


  const { token, user } = location.state || {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
  };
  // Refs for focusing input fields
  const customerNameRef = useRef();
  const customerContactRef = useRef();
  const businessGSTRef = useRef();
  const productNameRefs = useRef([]);
  const productQuantityRefs = useRef([]);

  const businessName = user.businessName.toUpperCase()

  // Fetch all bills
  const fetchBills = async () => {
    try {
      const response = await axios.get("https://bill-and-stock-management-application.onrender.com/api/bills/view-bills", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBills(response.data.bills);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error("Failed to fetch bills.");
    }
  };

  const fetchProductPrice = async (productName, productId) => {
    try {
      const token = localStorage.getItem("token");  // or get the token from your app's state or context

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.get(`https://bill-and-stock-management-application.onrender.com/api/stocks/view/${productName}`, {
        headers: {
          Authorization: `Bearer ${token}` // Attach token to request header
        }
      });

      if (response.status === 200) {
        return response.data.stock.price;
      } else {
        throw new Error("Product not found.");
      }
    } catch (error) {
      console.error("Error fetching product price:", error);
      toast.error("Failed to fetch product price.");
      return 0;  // Default price in case of error
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");  // or get the token from your app's state or context

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.get("https://bill-and-stock-management-application.onrender.com/api/stocks/view-stocks", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to request header
        },
      });

      if (response.status === 200) {
        return response.data.stocks; // returns the list of products with their details
      } else {
        throw new Error("Products not found.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
      return [];
    }
  };
  useEffect(() => {
    const loadProducts = async () => {
      const availableProducts = await fetchProducts();
      setAvailableProducts(availableProducts);
    };

    loadProducts();
  }, []);


  const calculateTotals = (newDiscount = discount) => {
    // Calculate the original subtotal (price * quantity for all products)
    const originalSubtotal = products.reduce((acc, item) => {
      const validQuantity = item.quantity > 0 ? item.quantity : 0;
      const validPrice = item.price > 0 ? item.price : 0;
      return acc + validQuantity * validPrice;
    }, 0);

    //console.log("Original Subtotal:", originalSubtotal);

    // Ensure the discount is treated as a valid number
    const numericDiscount = Number(newDiscount);

    // Calculate the discount amount
    const discountAmount = (numericDiscount / 100) * originalSubtotal;
    //console.log("Discount entered:", numericDiscount);
    //console.log("Discount amount:", discountAmount);

    // Calculate the subtotal after applying the discount
    const discountedSubtotal = originalSubtotal - discountAmount;

    // Calculate GST on the discounted subtotal
    const gstAmount = discountedSubtotal * 0.18;

    // Calculate the grand total
    const totalAfterDiscount = discountedSubtotal + gstAmount;

    // Update states to reflect the new totals
    setOriginalSubtotal(originalSubtotal); // Set the original subtotal
    setSubtotal(discountedSubtotal); // Set the discounted subtotal
    setGst(gstAmount); // Set GST amount
    setGrandTotal(totalAfterDiscount); // Set grand total
  };



  // Handle product changes
  const handleProductChange = async (index, field, value) => {
    const updatedProducts = [...products];
    if (field === "quantity") {
      const productPrice = await fetchProductPrice(updatedProducts[index].name);
      updatedProducts[index].price = productPrice;
    }
    updatedProducts[index][field] = field === "quantity" || field === "price" ? parseFloat(value) || 0 : value;
    updatedProducts[index].total = updatedProducts[index].quantity * updatedProducts[index].price;
    setProducts(updatedProducts);
    calculateTotals();
  };

  // Add and remove rows
  const addProductRow = () => setProducts([...products, { name: "", quantity: 0, price: 0, total: 0 }]);
  const removeProductRow = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    calculateTotals();
  };

  // const handleProductChange = async (index, field, value) => {
  //   const updatedProducts = [...products];
  //   if (field === "quantity") {
  //     // Recalculate total when quantity is changed
  //     updatedProducts[index].total = updatedProducts[index].quantity * updatedProducts[index].price;
  //   }
  //   updatedProducts[index][field] = field === "quantity" || field === "price" ? parseFloat(value) || 0 : value;
  //   setProducts(updatedProducts);
  //   calculateTotals();
  // };


  // Submit bill
  const handleGenerateBill = async () => {
    if (!token) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    // Validation: Check if all fields are filled
    if (!customerName) {
      toast.error("Please enter the customer name.");
      customerNameRef.current.focus();
      return;
    }
    if (!customerContact|| customerContact.length !== 10) {
      toast.error("Please enter the valid 10 digit customer contact.");
      customerContactRef.current.focus();
      return;
    }

    if (!businessGST) {
      toast.error("Please enter the business GST.");
      businessGSTRef.current.focus();
      return;
    }
    for (let i = 0; i < products.length; i++) {
      if (!products[i].name) {
        toast.error(`Please enter a product name for item ${i + 1}`);
        productNameRefs.current[i].focus();
        return;
      }
      if (products[i].quantity <= 0) {
        toast.error(`Please enter a valid quantity for product ${i + 1}`);
        productQuantityRefs.current[i].focus();
        return;
      }
    }
    try {
      const response = await axios.post(
        "https://bill-and-stock-management-application.onrender.com/api/bills/generate-bill",
        {
          customerName,
          customerContact,
          businessGST,
          products,
          originalSubtotal,
          discount,
          subtotal,
          gst,
          grandTotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Pass token in the Authorization header
        }
      );

      if (response.status === 200) {
        toast.success("Bill generated successfully!");
        setCustomerName("");
        setCustomerContact("");
        setBusinessGST("");
        setProducts([{ name: "", quantity: 0, price: 0, total: 0 }]);
        setOriginalSubtotal(0);
        setDiscount(0);
        setSubtotal(0);
        setGst(0);
        setGrandTotal(0);
        // setBillGenerated(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error generating bill:", error);
      toast.error("Failed to generate bill. Please try again.");
    }
  };
  // Open the modal and fetch bills
  const openBillsModal = () => {
    setIsModalOpen(true);
    fetchBills();
    
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
    setSearchQuery("");
  };

  // Filter bills based on search query (name, contact, or date)
  const filteredBills = bills.filter((bill) => {
    const formattedDate = new Date(bill.dateCreated).toLocaleDateString(); // Format the bill date
    return (
      bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.customerContact.includes(searchQuery) ||
      formattedDate.includes(searchQuery) // Match the formatted date
    );
  });


  const handleCustomerNameClick = (bill) => {
    setSelectedBill(bill); // Set the selected bill details
  };

  // Download bill
  const handleDownloadBill = () => {
    if (!customerName) {
      toast.error("Please enter the customer name.");
      customerNameRef.current.focus();
      return;
    }

    if (!customerContact|| customerContact.length !== 10) {
      toast.error("Please enter the valid 10 digit customer contact.");
      customerContactRef.current.focus();
      return;
    }

    if (!businessGST) {
      toast.error("Please enter the business GST.");
      businessGSTRef.current.focus();
      return;
    }
    for (let i = 0; i < products.length; i++) {
      if (!products[i].name) {
        toast.error(`Please enter a product name for item ${i + 1}`);
        productNameRefs.current[i].focus();
        return;
      }
      if (products[i].quantity <= 0) {
        toast.error(`Please enter a valid quantity for product ${i + 1}`);
        productQuantityRefs.current[i].focus();
        return;
      }
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(businessName, 105, 10, null, null, "center"); // Use dynamic businessName
    doc.setFontSize(12);
    doc.text(`GST Number: ${businessGST}`, 105, 20, null, null, "center");
    doc.text(`Customer Name: ${customerName}`, 10, 30);
    doc.text(`Customer Contact: ${customerContact}`, 10, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()} Time: ${new Date().toLocaleTimeString()}`, 10, 50);

    let y = 70;
    products.forEach((product, index) => {
      doc.text(
        `${index + 1}. ${product.name} - Qty: ${product.quantity} x Rs. ${product.price} = Rs. ${product.total.toFixed(2)}`,
        10,
        y
      );
      y += 10;
    });
    doc.text(`Subtotal: Rs. ${originalSubtotal.toFixed(2)}`, 10, y + 10);
    doc.text(`Discount: ${discount}%`, 10, y + 20);
    doc.text(`Discounted Subtotal: Rs. ${subtotal.toFixed(2)}`, 10, y + 30);
    doc.text(`GST (18%): Rs. ${gst.toFixed(2)}`, 10, y + 40);
    doc.text(`Grand Total: Rs. ${grandTotal.toFixed(2)}`, 10, y + 50);

    doc.save(`${customerName}_bill.pdf`);
  };

  // Print bill
  const handlePrintBill = () => {
    if (!customerName) {
      toast.error("Please enter the customer name.");
      customerNameRef.current.focus();
      return;
    }

    if (!customerContact|| customerContact.length !== 10) {
      toast.error("Please enter the valid 10 digit customer contact.");
      customerContactRef.current.focus();
      return;
    }



    if (!businessGST) {
      toast.error("Please enter the business GST.");
      businessGSTRef.current.focus();
      return;
    }
    for (let i = 0; i < products.length; i++) {
      if (!products[i].name) {
        toast.error(`Please enter a product name for item ${i + 1}`);
        productNameRefs.current[i].focus();
        return;
      }
      if (products[i].quantity <= 0) {
        toast.error(`Please enter a valid quantity for product ${i + 1}`);
        productQuantityRefs.current[i].focus();
        return;
      }
    }
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write("<html><head><title>Bill</title></head><body>");
    printWindow.document.write(`<h2 style='text-align:center'>${businessName}</h2>`); // Use dynamic businessName
    printWindow.document.write("<p style='text-align:center'>GST Number: " + businessGST + "</p>");
    printWindow.document.write("<p>Customer Name: " + customerName + "</p>");
    printWindow.document.write("<p>Customer Contact: " + customerContact + "</p>");
    printWindow.document.write("<p>Date: " + new Date().toLocaleDateString() + " Time: " + new Date().toLocaleTimeString() + "</p>");

    let y = 50;
    products.forEach((product, index) => {
      printWindow.document.write(
        `<p>${index + 1}. ${product.name} - Qty: ${product.quantity} x Rs. ${product.price} = Rs. ${product.total.toFixed(2)}</p>`
      );
    });
    printWindow.document.write(`<p>Subtotal: Rs. ${originalSubtotal.toFixed(2)}</p>`);
    printWindow.document.write(`<p>Discount: ${discount}%</p>`);
    printWindow.document.write(`<p>Discounted Subtotal: Rs. ${subtotal.toFixed(2)}</p>`);
    printWindow.document.write(`<p>GST (18%): Rs. ${gst.toFixed(2)}</p>`);
    printWindow.document.write(`<p>Grand Total: Rs. ${grandTotal.toFixed(2)}</p>`);

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto my-auto p-6 bg-white rounded-lg shadow-md mt-4">
        <h2 className="text-2xl font-bold text-center mb-6">Generate Bill</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Customer Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              ref={customerNameRef}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Customer Contact <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={customerContact}
              //onChange={(e) => setCustomerContact(e.target.value)}
              onChange={(e) => {
                // Allow only numeric input
                const input = e.target.value;
                if (!isNaN(input)) {
                  setCustomerContact(input);
                }
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              ref={customerContactRef}
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">GST Number<span className="text-red-500">*</span></label>
          <input
            type="text"
            value={businessGST}
            onChange={(e) => setBusinessGST(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            ref={businessGSTRef}

            required
          />
        </div>
        <table className="w-full mt-4 table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 text-left">Product Name</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Price(per unit)</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="p-2">
                  
                  <select
                    value={product.name}
                    onChange={async (e) => {
                      const selectedProductName = e.target.value;
                      const selectedProduct = availableProducts.find(
                        (p) => p.productName === selectedProductName
                      );

                      if (selectedProduct) {
                        const updatedProducts = [...products];
                        updatedProducts[index].name = selectedProduct.productName;
                        updatedProducts[index].price = selectedProduct.price;
                        updatedProducts[index].total = updatedProducts[index].quantity * selectedProduct.price;
                        setProducts(updatedProducts);
                        calculateTotals();
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Product</option>
                    {availableProducts
                      .filter((productItem) => productItem.quantity > 0) // Filter out products with 0 quantity
                      .map((productItem) => (
                        <option key={productItem._id} value={productItem.productName}>
                          {productItem.productName}
                        </option>
                      ))}
                  </select>


                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    ref={(el) => (productQuantityRefs.current[index] = el)}
                    required
                  />
                </td>
                <td className="p-2">{product.price}</td>
                <td className="p-2">{product.total.toFixed(2)}</td>
                <td className="p-2">
                  <button
                    onClick={() => removeProductRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
        <div className="mt-4">
          <button
            onClick={addProductRow}
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
        <div className="mt-4">
          <p className="font-medium">Subtotal: Rs. {originalSubtotal.toFixed(2)}</p>
          <label className="block text-sm font-medium">Discount (%):</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => {
              const newDiscount = parseFloat(e.target.value);
              console.log("Entered discount value:", e.target.value); // Log entered value as string
              if (!isNaN(newDiscount)) {
                setDiscount(newDiscount); // Update discount state
                calculateTotals(newDiscount); // Pass the new discount directly
              } else {
                setDiscount(0); // Fallback to 0 if invalid
                calculateTotals(0); // Recalculate with discount as 0
              }
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />



        </div>
        <div className="mt-4">
          <p className="font-medium">Discounted Subtotal: Rs. {subtotal.toFixed(2)}</p>
          <p className="font-medium">GST (18%): Rs. {gst.toFixed(2)}</p>
          <p className="font-medium">Grand Total: Rs. {grandTotal.toFixed(2)}</p>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleGenerateBill}
            className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-700"
          >
            Generate Bill
          </button>
          <div className="flex space-x-4">
            <button
              onClick={handleDownloadBill}
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700"

            >
              Download Bill
            </button>
            <button
              onClick={handlePrintBill}
              className="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-700"

            >
              Print Bill
            </button>
          </div>
        </div>
        {/* View Bills Button */}
        <div className="mt-4 text-center">
          <button
            onClick={openBillsModal}
            className="py-2 px-4 mr-12 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            View Bills
          </button>
        </div>

        {/* Modal for Viewing Bills */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96 overflow-y-scroll" style={{ maxHeight: "90vh" }}>
              <h3 className="text-xl font-bold">View Bills</h3>
              <input
                type="text"
                placeholder="Search by name ,contact, or date"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-2 mb-4 w-full p-2 border border-gray-300 rounded-md"
              />
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Customer Name</th>
                    <th className="p-2 text-left">Contact</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill, index) => (
                    <tr key={index} className="border-t border-gray-300">
                      <td
                        className="p-2 text-blue-500 cursor-pointer"
                        onClick={() => handleCustomerNameClick(bill)}
                      >
                        {bill.customerName}
                      </td>
                      <td className="p-2">{bill.customerContact}</td>
                      <td className="p-2">{new Date(bill.dateCreated).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* If a bill is selected, display its details */}
              {selectedBill && (
                <div className="mt-4 overflow-y-scroll" style={{ maxHeight: "40vh" }} >
                  <h3 className="text-xl font-semibold">
                    Bill Details for {selectedBill.customerName}
                  </h3>
                  <p>
                    <strong>Customer Contact:</strong> {selectedBill.customerContact}
                  </p>
                  {/* Display the products in the bill */}
                  <table className="w-full mt-4 mb-4 table-auto border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="p-2 text-left">Product Name</th>
                        <th className="p-2 text-left">Quantity</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.products.map((product, index) => (
                        <tr key={index} className="border-t border-gray-300">
                          <td className="p-2">{product.name}</td>
                          <td className="p-2">{product.quantity}</td>
                          <td className="p-2">₹{product.price}</td>
                          <td className="p-2">₹{product.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p>
                    <strong>Subtotal:</strong> Rs. {selectedBill.originalSubtotal}
                  </p>
                  <p>
                    <strong>Discount:</strong> {selectedBill.discount}%
                  </p>
                  <p>
                    <strong>Discounted Subtotal:</strong> Rs. {selectedBill.subtotal.toFixed(2)}
                  </p>
                  <p>
                    <strong>GST (18%):</strong> Rs. {selectedBill.gst.toFixed(2)}
                  </p>
                  <p>
                    <strong>Grand Total:</strong> Rs. {selectedBill.grandTotal.toFixed(2)}
                  </p>

                  
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GenerateBill;
