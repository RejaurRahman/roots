import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  NextOrObserver,
  User
} from "firebase/auth"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  setDoc,
  writeBatch
} from "firebase/firestore"

import { CartItem } from "../../store/cart/cart.types"
import { Category } from "../../store/categories/category.types"

const firebaseConfig = {
  apiKey: "AIzaSyCexgdWveMnjM3Gk3FJ-mG0ZdTxMNDdgAo",
  authDomain: "roots-restaurant.firebaseapp.com",
  projectId: "roots-restaurant",
  storageBucket: "roots-restaurant.appspot.com",
  messagingSenderId: "837058753065",
  appId: "1:837058753065:web:e258a2a5d429ccaec3a238"
}

const firebaseApp = initializeApp(firebaseConfig)

export { firebaseApp }

const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  prompt: "select_account"
})

export const auth = getAuth()
export const signInWithGooglePopup = async () => {
  const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth")
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export const signInWithGoogleRedirect = async () => {
  const { signInWithRedirect, GoogleAuthProvider } = await import("firebase/auth")
  const provider = new GoogleAuthProvider()
  return signInWithRedirect(auth, provider)
}
export const db = getFirestore()

export type ObjectToAdd = {
  title: string
}

export const addCollectionAndDocuments = async <T extends ObjectToAdd>(
  collectionKey: string,
  objectsToAdd: T[]
): Promise<void> => {
  const { collection, writeBatch, doc } = await import("firebase/firestore")
  const collectionRef = collection(db, collectionKey)
  const batch = writeBatch(db)

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase())
    batch.set(docRef, object)
  })

  await batch.commit()
}

export const getCategoriesAndDocuments = async (): Promise<Category[]> => {
  const collectionRef = collection(db, "categories")
  const q = query(collectionRef)
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(
    (docSnapshot) => docSnapshot.data() as Category
  )
}

export type AdditionalInformation = {
  displayName?: string
}

export type UserData = {
  createdAt: Date
  displayName: string
  email: string
  id?: string
}

export type OrderData = {
  cartItems: CartItem[]
  orderDate: Date
  orderId: string
  totalAmount: number
  userId: string
}

export const createOrderDocument = async (
  cartItems: CartItem[],
  totalAmount: number,
  orderId: string,
  userId: string
): Promise<any> => {
  try {
    const orderCollectionRef = collection(db, "orders")
    const orderData: OrderData = {
      cartItems,
      orderDate: new Date(),
      orderId,
      totalAmount,
      userId,
    }

    await addDoc(orderCollectionRef, orderData)
  } catch (error) {
    console.log(error)
  }
}

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation = {} as AdditionalInformation
): Promise<void | QueryDocumentSnapshot<UserData>> => {
  if (!userAuth) return

  const userDocRef = doc(db, "users", userAuth.uid)
  const userSnapshot = await getDoc(userDocRef)

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth
    const createdAt = new Date()

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation
      })
    } catch (error) {
      console.log("error creating the user", error)
    }
  }

  return userSnapshot as QueryDocumentSnapshot<UserData>
}

export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return

  return await createUserWithEmailAndPassword(auth, email, password)
}

export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return

  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth)

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) => onAuthStateChanged(auth, callback)

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe()
        resolve(userAuth)
      },
      reject
    )
  })
}
