import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

const useFirebaseAuth = () => {
    const [user, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(true);
    const [providerId, setProviderId] = useState<string>();

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                if (user.providerData.length > 0) {
                    setProviderId(user.providerData[0].providerId);
                }
                setIsLoading(false);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, isLoading, providerId };
}

export default useFirebaseAuth;