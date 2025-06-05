import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function FirstUserHandler() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const formData = new FormData();
      // @ts-expect-error // to be ignored
      formData.append("name", user?.fullName);
      // @ts-expect-error // to be ignored
      formData.append("email", user?.primaryEmailAddress?.emailAddress);
      formData.append("user_id", user?.id);

      fetch("http://localhost:8900/add-user", {
        method: "POST",
        body: formData,
      });
    }
  }, [isSignedIn, user]);

  return null;
}
