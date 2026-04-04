import Cookies from "js-cookie";

export const getBackendUrl = () => {
    if (typeof window !== "undefined") {
        return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    return process.env.BACKEND_URL;
}

export const register = async (email: string, password: string, name?: string) => {
    const res = await fetch(`${getBackendUrl()}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-internal-secret": process.env.NEXT_PUBLIC_INTERNAL_API_SECRET || process.env.INTERNAL_API_SECRET || "9123dae4ee9679Youngf2x29720841a062b2", // Using the literal generated secret just in case
        },
        body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    if (!res.ok) {
        return { error: data.error || "Failed to register" };
    }
    return { success: "Account created!", user: data.user };
};

export const login = async (email: string, password: string) => {
    const res = await fetch(`${getBackendUrl()}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
        return { error: data.error || "Invalid credentials" };
    }

    if (data.session && data.session.access_token) {
        const isSecure = typeof window !== 'undefined' ? window.location.protocol === 'https:' : false;
        Cookies.set("comfhutt_access_token", data.session.access_token, { secure: isSecure, sameSite: 'strict', expires: 7 }); // 7 days
    }
    if (data.session && data.session.refresh_token) {
        const isSecure = typeof window !== 'undefined' ? window.location.protocol === 'https:' : false;
        Cookies.set("comfhutt_refresh_token", data.session.refresh_token, { secure: isSecure, sameSite: 'strict', expires: 30 }); // 30 days
    }

    return { success: "Logged in!", user: data.user };
};

export const logout = async () => {
    const token = Cookies.get("comfhutt_access_token");
    if (token) {
        try {
            await fetch(`${getBackendUrl()}/api/auth/logout`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Logout request failed", error);
        }
    }
    
    Cookies.remove("comfhutt_access_token");
    Cookies.remove("comfhutt_refresh_token");
    return { success: true };
};

// Intended to be used mostly inside client components.
export const getSession = async () => {
    const token = Cookies.get("comfhutt_access_token");
    if (!token) return null;

    try {
        const res = await fetch(`${getBackendUrl()}/api/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            return null;
        }

        const user = await res.json();
        return { user };
    } catch (error) {
        console.error("Failed to get session", error);
        return null;
    }
};

export const googleLogin = () => {
    if (typeof window !== "undefined") {
        window.location.href = `${getBackendUrl()}/api/auth/google`;
    }
};
