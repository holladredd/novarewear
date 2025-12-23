import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import withAuth from "./withAuth";

const withAdminAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && user?.role !== "admin") {
        router.push("/");
      }
    }, [user, loading, router]);

    if (loading || user?.role !== "admin") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return withAuth(Wrapper);
};

export default withAdminAuth;
