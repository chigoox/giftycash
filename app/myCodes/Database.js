import { arrayRemove, arrayUnion, collection, deleteField, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where, onSnapshot, deleteDoc } from "firebase/firestore";
import { DATABASE } from '../../Firebase';


export async function addToDatabase(collection, Doc, field, data, merge = true) {
    console.log(collection, Doc, field, data)
    if (Doc) {
        try {
            await setDoc(doc(DATABASE, collection, Doc), {
                [field]: data,
            }, { merge: merge });
        } catch (error) {
            console.log(error.message)
        }
    }

}

export const watchDocument = async (collection, Doc, setter) => {
    onSnapshot(doc(DATABASE, collection, Doc), (doc) => {
        if (setter) setter(doc.data())
        return doc.data()
    });
}

export async function addToDoc(collection, Doc, data) {
    console.log(collection, Doc, data)
    if (Doc) {
        try {
            await setDoc(doc(DATABASE, collection, Doc),
                { ...data }, { merge: true });
        } catch (error) {
            console.log(error.message)
        }
    }

}
export async function updateDatabaseItem(collection, Doc, Field, Value) {

    await updateDoc(doc(DATABASE, collection, Doc), {
        [Field]: Value ? Value : deleteField()
    });
}

export async function updateArrayDatabaseItem(collection, Doc, Field, Value, remove) {
    await updateDoc(doc(DATABASE, collection, Doc), {
        [Field]: !remove ? arrayUnion(Value) : arrayRemove(Value)
    });
}

export async function fetchDocument(collection, document, setterfunction) {
    const docRef = doc(DATABASE, collection, document);
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            if (setterfunction) setterfunction(docSnap.data());
            return docSnap.data()
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    } catch (error) {
        console.log(error.message)
    }
}
export async function fetchDocument2(collection, document, setterfunction) {
    const docRef = doc(DATABASE, 'User', collection, document ? document : '');
    try {
        console.log(docRef)
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            if (setterfunction) setterfunction(docSnap.data());
            return docSnap.data()
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            return ("No such document!");
        }
    } catch (error) {
        console.log(error.message)
    }
}

export const FetchTheseDocs = async (datacollection, key, opp, value, orderby) => {
    const ref = collection(DATABASE, `${datacollection}`)
    const qry = orderby ? query(ref, where(`${key}`, `${opp}`, `${value}`), orderBy(`${orderby}`, 'desc')) : query(ref, where(`${value}`, `${opp}`, `${key}`))
    const snapShot = await getDocs(qry)
    let data = []
    snapShot.forEach((doc) => {
        data = [...data, doc.data()]
    });
    return data
}
export const useFetchDocsPresist = async (datacollection, key, opp, value, orderby, setter) => {
    const ref = collection(DATABASE, datacollection); // No need for template literals
    const qry = orderby
        ? query(ref, where(key, opp, value), orderBy(orderby, 'desc')) // Correct order of where
        : query(ref, where(key, opp, value)); // Simplified for no orderBy

    onSnapshot(qry, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data()); // Efficiently map doc.data()
        setter(data);
    });
};


export async function deleteDocument(collection, Doc) {
    try {
        await deleteDoc(doc(DATABASE, collection, Doc));
    } catch (error) {
        console.log(error.message)

    }

}