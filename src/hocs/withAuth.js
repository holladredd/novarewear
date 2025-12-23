import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/");
      }
    }, [user, isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
