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
import { db, isFirebaseAvailable } from './firebase';

// Collections helper
const getCollection = (collectionName) => {
  if (!isFirebaseAvailable || !db) {
    return null;
  }
  return collection(db, collectionName);
};

export const productsCollection = getCollection('products');
export const ordersCollection = getCollection('orders');
export const usersCollection = getCollection('users');

// Product CRUD Operations
export const getProducts = async () => {
  if (!isFirebaseAvailable || !productsCollection) {
    console.warn('Firebase unavailable: getProducts returning empty array');
    return [];
  }

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
  if (!isFirebaseAvailable || !db) {
    console.warn('Firebase unavailable: getProductById returning null');
    return null;
  }

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
  if (!isFirebaseAvailable || !productsCollection) {
    console.warn('Firebase unavailable: addProduct cannot create product');
    throw new Error('Firebase unavailable');
  }

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
  if (!isFirebaseAvailable || !db) {
    console.warn('Firebase unavailable: updateProduct cannot update product');
    throw new Error('Firebase unavailable');
  }

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
  if (!isFirebaseAvailable || !db) {
    console.warn('Firebase unavailable: deleteProduct cannot delete product');
    throw new Error('Firebase unavailable');
  }

  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Order CRUD Operations
export const createOrder = async (orderData) => {
  if (!isFirebaseAvailable || !ordersCollection) {
    console.warn('Firebase unavailable: createOrder cannot create order');
    throw new Error('Firebase unavailable');
  }

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
  if (!isFirebaseAvailable || !ordersCollection) {
    console.warn('Firebase unavailable: getUserOrders returning empty array');
    return [];
  }

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
  if (!isFirebaseAvailable || !db) {
    console.warn('Firebase unavailable: getOrderById returning null');
    return null;
  }

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
  if (!isFirebaseAvailable || !db) {
    console.warn('Firebase unavailable: updateOrderStatus cannot update status');
    throw new Error('Firebase unavailable');
  }

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
  if (!isFirebaseAvailable || !usersCollection) {
    console.warn('Firebase unavailable: createUserProfile cannot create profile');
    throw new Error('Firebase unavailable');
  }

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
  if (!isFirebaseAvailable || !usersCollection) {
    console.warn('Firebase unavailable: getUserProfile returning null');
    return null;
  }

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
  if (!isFirebaseAvailable || !usersCollection || !db) {
    console.warn('Firebase unavailable: updateUserProfile cannot update profile');
    throw new Error('Firebase unavailable');
  }

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
  if (!isFirebaseAvailable || !productsCollection) {
    console.warn('Firebase unavailable: subscribeToProducts no-op');
    return () => {};
  }

  return onSnapshot(productsCollection, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(products);
  });
};

export const subscribeToUserOrders = (userId, callback) => {
  if (!isFirebaseAvailable || !ordersCollection) {
    console.warn('Firebase unavailable: subscribeToUserOrders no-op');
    return () => {};
  }

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