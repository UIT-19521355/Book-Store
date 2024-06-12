import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, deleteOrder, getOrderDataByID } from '../../../service/OrderService';
import AddOrderModal from '../../../components/AdminPanel/AddModal/AddOrderModal/AddOrderModal';
import EditOrderModal from '../../../components/AdminPanel/EditModal/EditOrderModal/EditOrderModal';
import DataTable from '../../../components/AdminPanel/DataTable/DataTable';
import './OrderListPage.css';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAdd = async (newOrderData) => {
    try {
      await createOrder(newOrderData);
      setAddModalVisible(false);
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleEditClick = async (orderId) => {
    try {
      const order = await getOrderDataByID(orderId);
      setSelectedOrder(order);
      setEditModalVisible(true);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  const handleAddClick = () => {
    setAddModalVisible(true);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'customerId', headerName: 'Customer ID', width: 200 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'totalPrice', headerName: 'Total Price', width: 150 },
    { field: 'startDate', headerName: 'Start Date', width: 200 },
  ];

  return (
    <div className='order-list'>
      <div className='info'>
        <h1>Order List</h1>
        <button onClick={handleAddClick}>Add New Order</button>
      </div>
      <DataTable columns={columns} rows={orders} handleDelete={handleDelete} handleEdit={handleEditClick} />
      {editModalVisible && (
        <EditOrderModal
          visible={editModalVisible}
          order={selectedOrder}
          onCancel={() => setEditModalVisible(false)}
          refresh={fetchOrders}
        />
      )}
      {addModalVisible && (
        <AddOrderModal
          visible={addModalVisible}
          setAddModalVisible={setAddModalVisible}
          onSave={handleAdd}
        />
      )}
    </div>
  );
};

export default OrderListPage;