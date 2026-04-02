import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

// Products Collection
export const productsCollection = collection(db, 'products');

// Orders Collection
export const ordersCollection = collection(db, 'orders');

// Users Collection
export const usersCollection = collection(db, 'users');

// Product CRUD Operations
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(productsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Order CRUD Operations
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const q = query(
      ordersCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// User Profile Operations
export const createUserProfile = async (userId, userData) => {
  try {
    await addDoc(usersCollection, {
      uid: userId,
      ...userData,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const q = query(usersCollection, where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const q = query(usersCollection, where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'users', querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToProducts = (callback) => {
  return onSnapshot(productsCollection, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(products);
  });
};

export const subscribeToUserOrders = (userId, callback) => {
  const q = query(
    ordersCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(orders);
  });
};