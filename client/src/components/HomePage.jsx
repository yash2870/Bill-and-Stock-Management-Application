import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from 'react-icons/fa';
import Footer from './Footer';
const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [stockItems, setStockItems] = useState([]); // For "Update Stock" tab removed
    const [addedItems, setAddedItems] = useState([]); // For "Add Items" tab
    const [selectedStock, setSelectedStock] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingStock, setEditingStock] = useState(null);

    const { token, user } = location.state || {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user')),
    };

    if (!token || !user) {
        navigate('/login');
        return null;
    }

    // Fetch stock items independently
    const fetchStocks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/stocks/view', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStockItems(response.data.stocks);
        } catch (error) {
            console.error('Error fetching stocks', error);
        }
    };

    // Add stock item
    const handleAddItem = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/stocks/add',
                { productName, quantity, price },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Update stockItems immediately
            setStockItems([...stockItems, response.data.newStockItem]); // Directly update stockItems state
            setProductName('');
            setQuantity('');
            setPrice('');
            toast.success('Item added successfully!');
        } catch (error) {
            console.error('Error adding stock item', error);
        }
    };
    // Edit stock item
    // const handleEditItem = async () => {
    //     try {
    //         const response = await axios.put(
    //             `http://localhost:8000/api/stocks/update/${editingStock._id}`,
    //             {
    //                 productName: editingStock.productName,
    //                 quantity: editingStock.quantity,
    //                 price: editingStock.price,
    //             },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         // Update stockItems with the edited item
    //         setStockItems(
    //             stockItems.map((item) =>
    //                 item._id === editingStock._id ? response.data.updatedStockItem : item
    //             )
    //         );
    //         toast.success('Stock updated successfully!');
    //         setEditingStock(null); // Close the modal
    //     } catch (error) {
    //         console.error('Error updating stock item', error);
    //     }
    // };
    const handleEditItem = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/stocks/update/${editingStock._id}`,
                {
                    productName: editingStock.productName,
                    quantity: editingStock.quantity,
                    price: editingStock.price,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedStock = response.data.updatedStockItem;

            if (updatedStock.quantity === 0) {
                // Delete the stock item if quantity is 0
                await axios.delete(`http://localhost:8000/api/stocks/delete/${editingStock._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStockItems(stockItems.filter((item) => item._id !== editingStock._id));
            } else {
                setStockItems(
                    stockItems.map((item) =>
                        item._id === editingStock._id ? updatedStock : item
                    )
                );
            }

            toast.success('Stock updated successfully!');
            setEditingStock(null); // Close the modal
        } catch (error) {
            console.error('Error updating stock item', error);
        }
    };

    // Delete stock item
    const handleDeleteItem = async () => {
        if (!itemToDelete) return;

        try {
            await axios.delete(`http://localhost:8000/api/stocks/delete/${itemToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStockItems(stockItems.filter((item) => item._id !== itemToDelete._id));
            toast.success('Stock deleted successfully!');
            setShowConfirmationDialog(false); // Close dialog after deletion
        } catch (error) {
            console.error('Error deleting stock item', error);
        }
    };

    const handleConfirmationDialog = (item) => {
        setItemToDelete(item);
        setShowConfirmationDialog(true);
    };

    const handleCloseConfirmationDialog = () => {
        setShowConfirmationDialog(false);
        setItemToDelete(null);
    };
    const handleGenerateBillClick = () => {
        navigate("/bill", { state: { token, user } }); // Navigate to the generate bill page
    };
    useEffect(() => {
        fetchStocks();
    }, []);

    // Fetch stock items only when "View Stocks" or "Delete Stocks" tab is selected
    useEffect(() => {
        if (activeTabIndex === 1 || activeTabIndex === 3) { // "View Stocks" or "Delete Stocks" tab is selected
            fetchStocks(); // Refresh stock data
        }
    }, [activeTabIndex]);
    const handleOpenModal = () => {
        setActiveTabIndex(0); // Set the active tab to "Add Items"
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setSearchTerm("");
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (!isModalOpen) {
            setSearchTerm('');
        }
    }, [isModalOpen]);
    useEffect(() => {
        if (activeTabIndex !== 1) {
            setSearchTerm('');
        }
    }, [activeTabIndex]);


    // const filteredStockItems = stockItems.filter((item) =>
    //     item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     new Date(item.createdAt).toLocaleDateString().includes(searchTerm) ||
    //     new Date(item.updatedAt).toLocaleDateString().includes(searchTerm)
    // );
    const normalizeDate = (date) => {
        try {
            const d = new Date(date);
            return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${d.getFullYear()}`;
        } catch (error) {
            console.error("Date parsing error:", error);
            return "";
        }
    };
    
    const normalizeSearchTerm = (searchTerm) => {
        // Convert search term (e.g., "1/5/2025") into "MM-DD-YYYY" format
        const parts = searchTerm.split('/');
        if (parts.length === 3) {
            return `${String(parts[0]).padStart(2, "0")}-${String(parts[1]).padStart(2, "0")}-${parts[2]}`;
        }
        return searchTerm; // Return as is if not in date format
    };
    
    
    const filteredStockItems = stockItems.filter((item) => {
        const normalizedCreatedAt = normalizeDate(item.createdAt);
        const normalizedUpdatedAt = normalizeDate(item.updatedAt);
        const normalizedSearchTerm = normalizeSearchTerm(searchTerm.trim().toLowerCase());
    
        // console.log("Search Term:", normalizedSearchTerm);
        // console.log("Normalized CreatedAt:", normalizedCreatedAt);
        // console.log("Normalized UpdatedAt:", normalizedUpdatedAt);
    
        return (
            item.productName.toLowerCase().includes(normalizedSearchTerm) ||
            normalizedCreatedAt.includes(normalizedSearchTerm) ||
            normalizedUpdatedAt.includes(normalizedSearchTerm)
        );
    });
    
    
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 mt-3">
                <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-2xl 
        transform translate-y-4 sm:translate-y-0 md:-translate-y-12" >
                    <h1 className="text-3xl font-semibold text-center mb-4 text-gray-800">
                        Welcome, {user?.businessName ? user.businessName.toUpperCase() : 'User'}
                        !
                    </h1>
                    <p className="text-center text-gray-600">You can now manage your bills and stocks.</p>
                    <div className="flex justify-center mt-6 space-x-4">
                        <button onClick={handleOpenModal} className="bg-blue-500 text-white p-2 rounded">
                            Manage Stocks
                        </button>
                        <button onClick={handleGenerateBillClick} className="bg-teal-500 text-white p-2 rounded">Generate Bills</button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center px-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl sm:w-full md:w-3/4 lg:w-1/2 max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Manage Stocks</h2>
                            <button
                                onClick={handleCloseModal}
                                className="bg-red-500 text-white p-2 rounded-full text-lg w-10 h-10 flex items-center justify-center font-bold"
                            >
                                X
                            </button>
                        </div>
                        <div>
                            <div className="flex space-x-4 mb-4">
                                <button
                                    onClick={() => setActiveTabIndex(0)}
                                    className={`p-2 w-full text-center ${activeTabIndex === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    Add Items
                                </button>
                                <button
                                    onClick={() => setActiveTabIndex(1)}
                                    className={`p-2 w-full text-center ${activeTabIndex === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    View Stocks
                                </button>
                                <button
                                    onClick={() => setActiveTabIndex(3)}
                                    className={`p-2 w-full text-center ${activeTabIndex === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    Delete Stocks
                                </button>
                            </div>

                            {activeTabIndex === 0 && (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Product Name"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Quantity(Kg/Pcs)"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price(per Unit)"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    <button onClick={handleAddItem} className="bg-green-500 text-white p-2 rounded mt-4">
                                        Add Item
                                    </button>
                                </div>
                            )}


                            {activeTabIndex === 1 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Current Stock Items</h3>

                                    {/* Search Bar */}
                                    <input
                                        type="text"
                                        placeholder="Search stock by name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                    />

                                    {/* Stock List */}
                                    <ul className="space-y-2 max-h-[50vh] overflow-y-scroll">
                                        {filteredStockItems.map((item) => (
                                            <li
                                                key={item._id}
                                                className={`p-2 border border-gray-200 rounded-md flex justify-between items-center ${item.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                                                    }`}
                                            >
                                                <div>
                                                    <div className="font-semibold">{item.productName}</div>
                                                    <div>Quantity(Kg/Pcs): {item.quantity}</div>
                                                    <div>Price (per unit): Rs.{item.price}</div>
                                                    <div>Added: {new Date(item.createdAt).toLocaleDateString()}</div>
                                                    <div>Updated: {new Date(item.updatedAt).toLocaleDateString()}</div>
                                                </div>
                                                <button
                                                    onClick={() => setEditingStock(item)}
                                                    className="text-blue-500 text-lg"
                                                >
                                                    <FaEdit />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            )}

                            {editingStock && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center px-4">
                                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl sm:w-full md:w-3/4 lg:w-1/2">
                                        <h3 className="text-xl font-semibold mb-4">Edit Stock Item</h3>
                                        <input
                                            type="text"
                                            value={editingStock.productName}
                                            onChange={(e) =>
                                                setEditingStock({ ...editingStock, productName: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                            placeholder="Product Name"
                                        />
                                        <input
                                            type="number"
                                            value={editingStock.quantity}
                                            onChange={(e) =>
                                                setEditingStock({ ...editingStock, quantity: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                            placeholder="Quantity"
                                        />
                                        <input
                                            type="number"
                                            value={editingStock.price}
                                            onChange={(e) =>
                                                setEditingStock({ ...editingStock, price: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                            placeholder="Price"
                                        />
                                        <div className="flex justify-between">
                                            <button
                                                onClick={handleEditItem}
                                                className="bg-green-500 text-white p-2 rounded w-1/3"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingStock(null)}
                                                className="bg-gray-500 text-white p-2 rounded w-1/3"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {activeTabIndex === 3 && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Delete Stock Item</h3>

                                    {/* Search Bar */}
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            placeholder="Search by product name, creation date, or update date..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Filtered Stock Items */}
                                    <ul className="space-y-2 max-h-[50vh] overflow-y-scroll">
                                        {filteredStockItems.length > 0 ? (
                                            filteredStockItems.map((item) => (
                                                <li
                                                    key={item._id}
                                                    className="p-2 border border-gray-200 rounded-md flex justify-between items-center"
                                                >
                                                    <div>
                                                        <div className="font-medium">{item.productName}</div>
                                                        <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                                                        <div className="text-sm text-gray-500">
                                                            Added: {new Date(item.createdAt).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Updated: {new Date(item.updatedAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleConfirmationDialog(item)}
                                                        className="bg-red-500 text-white p-2 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-center text-gray-500">No items match your search.</li>
                                        )}
                                    </ul>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            )}
            {/* Confirmation Dialog */}
            {showConfirmationDialog && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center px-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl sm:w-full md:w-3/4 lg:w-1/2">
                        <h3 className="text-xl font-semibold mb-4">
                            Are you sure you want to delete <strong>{itemToDelete?.productName}</strong>?
                        </h3>
                        <div className="flex justify-between">
                            <button
                                onClick={handleDeleteItem}
                                className="bg-red-500 text-white p-2 rounded w-1/3"
                            >
                                Yes
                            </button>
                            <button
                                onClick={handleCloseConfirmationDialog}
                                className="bg-gray-500 text-white p-2 rounded w-1/3"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add the Footer here */}
            <Footer />
        </div>
    );
};

export default HomePage;